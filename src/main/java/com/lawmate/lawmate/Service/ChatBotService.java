package com.lawmate.lawmate.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawmate.lawmate.DTO.ChatRequestDto;
import com.lawmate.lawmate.DTO.ChatResponseDto;
import com.lawmate.lawmate.DTO.MessageDto;
import com.lawmate.lawmate.DTO.OpenAiRequest;
import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.GptInfo;
import com.lawmate.lawmate.Domain.LegalTemplate;
import com.lawmate.lawmate.Repository.ConsultationRepository;
import com.lawmate.lawmate.Repository.GptInfoRepository;
import com.lawmate.lawmate.Repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatBotService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    // 의존성 주입 : DB 접근을 위한 Repository 들
    private final ConsultationRepository consultationRepository;
    private final TemplateRepository templateRepository;
    private final GptInfoRepository documentAnswerRepository;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    /**
     * 프론트엔드에서 전달된 요청을 기반으로 GPT와 대화하고, 응답에 따라 필요한 정보를 저장하는 핵심 서비스 메서드
     */
    public ChatResponseDto processChat(ChatRequestDto request) {
        List<MessageDto> allMessages = new ArrayList<>();

        // 1. 시스템 프롬프트 작성 추가 (GPT가 따라야 할 지침)
        allMessages.add(new MessageDto("system", getSystemPrompt()));

        // 2. 사용자 메시지 추가 (프론트에서 온 메시지들)
        allMessages.addAll(request.getMessages());
        // 3. GPT 요청 객체 구성
        OpenAiRequest openAiRequest = OpenAiRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(allMessages)
                .build();
        // 4. GPT API 호출
        String reply = callOpenAiApi(openAiRequest);

        // 5-1. 문서 작성 모드 진입 응답일 경우 → 상담 정보 저장 + 문서요약 저장
        if (reply.contains("✅ 문서 작성 모드로 전환합니다")) {
            extractAndSaveConsultationInfo(reply, request.getConsultationId());
            saveDocumentSummary(reply, request.getConsultationId());
        }
        // 5-2. 상담 종료 응답일 경우 → 상담 요약 정보만 저장
        if (reply.contains("✅ 상담을 종료하겠습니다")) {
            extractAndSaveConsultationInfo(reply, request.getConsultationId());
        }
        // 6. GPT 응답을 프론트로 반환
        return ChatResponseDto.builder().message(reply).build();
    }

    /**
     * GPT API 호출 수행 메서드
     * GPT 요청을 전송하고 응답 메시지를 받아 문자열로 반환
     */
    private String callOpenAiApi(OpenAiRequest requestDto) {
        OkHttpClient client = new OkHttpClient();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            String jsonBody = objectMapper.writeValueAsString(requestDto);

            Request request = new Request.Builder()
                    .url(OPENAI_API_URL)
                    .addHeader("Authorization", "Bearer " + openAiApiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(RequestBody.create(jsonBody, MediaType.parse("application/json")))
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    String responseBody = response.body().string();
                    JsonNode root = objectMapper.readTree(responseBody);
                    return root.get("choices").get(0).get("message").get("content").asText();
                } else {
                    return "GPT 응답 실패: " + response.code() + " - " + response.body().string();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "GPT 호출 중 오류 발생: " + e.getMessage();
        }
    }

    /**
     * GPT 응답 중 포함된 JSON 블록을 파싱하여 상담 요약 정보 저장 - 마이페이지 확인을 위한 상담 테이블 저장용
     * → 대상: ConsultationRecord (issue, summary, template)
     */
    private void extractAndSaveConsultationInfo(String reply, Long consultationId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Pattern pattern = Pattern.compile("```json\\s*(\\{.*?})\\s*```|\\{.*?}", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(reply);

            if (matcher.find()) {
                String jsonBlock = matcher.group(1) != null ? matcher.group(1) : matcher.group();
                JsonNode json = mapper.readTree(jsonBlock);

                String summary = json.get("summary").asText();
                String issue = json.get("issue").asText();
                String templateName = json.get("template").asText();

                ConsultationRecord record = consultationRepository.findById(consultationId)
                        .orElseThrow(() -> new IllegalArgumentException("상담 ID 없음"));

                record.setSummary(summary);
                record.setIssue(issue);

                Optional<LegalTemplate> template = templateRepository.findByTemplateName(templateName);
                template.ifPresent(record::setTemplate);

                consultationRepository.save(record);
            }
        } catch (Exception e) {
            log.error("❌ 상담 요약 저장 실패", e);
        }
    }

    /**
     * GPT 응답 중 `---문서요약시작---` ~ `---문서요약끝---` 블록을 파싱하여 문서 작성용 요약 저장
     * → 대상: DocumentAnswer (summaryText)
     */
    private void saveDocumentSummary(String reply, Long consultationId) {
        try {
            String start = "---문서요약시작---";
            String end = "---문서요약끝---";

            int startIdx = reply.indexOf(start);
            int endIdx = reply.indexOf(end);

            if (startIdx == -1 || endIdx == -1 || endIdx <= startIdx) {
                log.warn("✖ 요약 블록이 포함되지 않은 응답입니다.");
                return;
            }

            String summaryText = reply.substring(startIdx + start.length(), endIdx).trim();

            ConsultationRecord consultation = consultationRepository.findById(consultationId)
                    .orElseThrow(() -> new IllegalArgumentException("상담 ID 없음"));

            LegalTemplate template = consultation.getTemplate();

            GptInfo answer = GptInfo.builder()
                    .consultation(consultation)
                    .template(template)
                    .summaryText(summaryText)
                    .build();

            documentAnswerRepository.save(answer);
            log.info("✅ 요약 텍스트 기반 DocumentAnswer 저장 완료");

        } catch (Exception e) {
            log.error("문서 요약 저장 중 오류 발생", e);
        }
    }

    /**
     * GPT가 참고할 시스템 프롬프트 반환 (법률 상담과 문서 작성에 필요한 규칙 포함)
     */
    private String getSystemPrompt() {
        return "너는 한국 법률 상담을 전문으로 하는 AI 챗봇이야. 다음 지침에 따라 일관되게 상담을 진행해.\n\n" +
                "🟢 1. 사용자의 상황을 파악하고, 구체적인 질문으로 추가 정보를 수집해.\n" +
                "- 예: \"회사 측에서 어떤 해고 사유를 설명했나요?\"\n" +
                "- 예: \"해고 통보는 언제, 어떤 방식으로 받으셨나요? 서면으로 받으셨나요?\"\n\n" +
                "🟡 2. 충분한 정보가 모이면 핵심 법적 쟁점을 하나로 정리해 설명해.\n" +
                "- 예: \"이 상황은 근로기준법 제26조 위반 소지가 있어 보입니다.\"\n" +
                "- 예: \"부당해고 여부는 해고 사유와 절차의 정당성에 따라 판단됩니다.\"\n" +
                "2.2 그리고는 이 해당 핵심 법정 쟁점을 분류할 수 있는 하나의 키워드로 설명해줘\n\n" +
                "🔵 3. 관련 법적 대응 방안을 제시하고, 적절한 문서 템플릿을 추천해.\n" +
                "- 등록된 문서 템플릿:\n  1. 내용증명\n  2. 계약서\n  3. 차용증\n  4. 부동산 임대차 계약\n  5. 유언장\n  6. 진정서/탄원서/고소장\n  7. 이의신청서/행정심판 청구서\n"
                +
                "- 템플릿이 여러 개 가능하면 함께 제안을 해주고, 등록된 템플릿이 있다면 그 템플릿에 대해 설명을 해주고 반드시 이렇게 물어봐:\n" +
                "  → \"📄 해당 템플릿을 제공해드릴까요?\"\n" +
                "- 만약 적합한 템플릿이 없다면 다음 두 가지를 **모두** 수행해:\n" +
                "  1. 반드시 이렇게 말해: \"❌ 죄송합니다. 해당 상황에 적합한 문서는 현재 제공되지 않습니다.\"\n" +
                "  2. 반드시 그에 대한 **대체 법적 조치나 실질적인 대응 방법**을 구체적으로 안내해줘.\n" +
                "     - 예: 어떤 기관에 민원을 제기할 수 있는지, 어떤 기록을 남겨야 하는지, 어떤 상담을 받아야 하는지 등\n\n" +
                "📝 4. 템플릿을 추천했다면 반드시 문서 작성 여부를 물어봐.\n" +
                "- 질문 예: \"📄 해당 문서를 자동으로 작성해드릴까요?\"\n" +
                "- 사용자가 동의하면 반드시 아래 문장을 출력해:\n" +
                "  → \"✍️ 문서 작성을 위한 필수 정보를 먼저 확인하겠습니다. 질문에 답해주시면 이후 문서 작성 모드로 전환할게요.\"\n" +
                "- 문서 작성을 위해 필요한 정보 중, 이미 대화 중에 파악된 내용이 있다면 해당 내용을 다시 묻지 말고 다음과 같은 형식으로 직접 단정형으로 말할 것:\n" +
                "  → 예:\n" +
                "    - \"🔎 작성자명은 홍길동입니다. 다르다면 수정해 주세요.\"\n" +
                "    - \"🔎 계약 체결일은 2023년 3월 14일입니다. 날짜가 다르다면 말씀해 주세요.\"\n" +
                "    - \"🔎 상대방은 김철수입니다. 다른 사람이면 수정해 주세요.\"\n" +
                "- 모든 질문을 완료한 후에는 반드시 다음 문장을 출력해:\n" +
                "  → \"✅ 필요한 정보를 모두 확인했습니다. 이제 문서 작성 모드로 전환합니다. 작성된 내용을 안내드릴게요.\"\n\n" +
                "필요한 정보를 모두 확인 했으면 문서 생성을 위한 주요 정보들을(질의응답과 사용자와 한 채팅을 기반으로) **문장 형태로 간결하게 요약해서 출력해줘**\n" +
                "  반드시 아래 구분자로 감싸서 출력할 것:\n\n" +
                "  시작: `---문서요약시작---`\n" +
                "  끝:   `---문서요약끝---`\n" +
                "예시 출력:\n" +
                "---문서요약시작---\n" +
                "작성자: 홍길동\n" +
                "상대방: 김철수\n" +
                "계약 체결일: 2023년 3월 14일\n" +
                "요청 내용: 계약 해지 요청\n" +
                "- 이 줄은 이렇게 형식을 똑같이 쓰는게 아니라 위의 내용 외에 상담으로 알게 된 내용들(문서 작성을 위해 필요한 내용 출력)을 간단하게 몇 줄로 나열해줘\n" +
                "---문서요약끝---\n\n" +
                "🚪 5. 사용자가 종료 의사를 표현하면 상담을 종료해.\n" +
                "- 키워드 예: \"그만할게요\", \"상담 끝\", \"종료할래요\"\n" +
                "- 반드시 이 문장을 출력해:\n" +
                "  → \"✅ 상담을 종료하겠습니다. 도움이 되었길 바랍니다.\"\n\n" +
                "🧾 6. 다음 두 경우에 반드시 JSON 블록을 출력해:\n" +
                "- ① 문서 작성 모드 진입 시\n" +
                "- ② 상담 종료 시\n" +
                "- 아래 JSON 형식으로 출력하며, **설명 없이 순수 코드 블록만** 포함할 것:\n" +
                "```json\n" +
                "{\n" +
                "  \"summary\": \"대화 내용 요약(나중에 정확히 어떤 대화를 했는지 알 수 있을 정도로)\",\n" +
                "  \"issue\": \"대화에서 말한 법적 이슈를 분류한 키워드\",\n" +
                "  \"template\": \"추천된 문서 템플릿명 또는 null\"\n" +
                "}\n" +
                "```";
    }
}