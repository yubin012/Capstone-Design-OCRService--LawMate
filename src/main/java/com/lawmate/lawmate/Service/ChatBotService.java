package com.lawmate.lawmate.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawmate.lawmate.DTO.ChatRequestDto;
import com.lawmate.lawmate.DTO.ChatResponseDto;
import com.lawmate.lawmate.DTO.MessageDto;
import com.lawmate.lawmate.DTO.OpenAiRequest;
import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.GptInfo;
import com.lawmate.lawmate.Repository.ConsultationRepository;
import com.lawmate.lawmate.Repository.GptInfoRepository;
import com.lawmate.lawmate.Template.TemplatePromptProvider;
import com.lawmate.lawmate.Template.TemplateType;
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

    private final ConsultationRepository consultationRepository;
    private final GptInfoRepository gptInfoRepository;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public ChatResponseDto processChat(ChatRequestDto request) {
        List<MessageDto> allMessages = new ArrayList<>();

        // 템플릿이 이미 추천된 상태라면 해당 템플릿의 질문 전용 프롬프트 사용, 없으면 기본 프롬프트 사용
        String systemPrompt = getSystemPromptByTemplate(request.getConsultationId());
        allMessages.add(new MessageDto("system", systemPrompt));

        // 사용자가 보낸 대화 메시지들을 이어 붙임
        allMessages.addAll(request.getMessages());

        OpenAiRequest openAiRequest = OpenAiRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(allMessages)
                .build();

        String reply = callOpenAiApi(openAiRequest);

        // JSON 블록이 포함되어 있다면 상담 정보와 요약 정보 저장
        if (reply.contains("\"summary\":") && reply.contains("\"issue\":") && reply.contains("\"template\":")) {
            extractAndSaveConsultationInfo(reply, request.getConsultationId());
        }

        // 분기별 프롬포트 이후 시 요약 텍스트 저장
        if (reply.contains("모든 단계를 완료했습니다.")) {
            saveDocumentSummary(reply, request.getConsultationId());
        }

        return ChatResponseDto.builder().message(reply).build();
    }

    private String getSystemPromptByTemplate(Long consultationId) {
        ConsultationRecord record = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("상담 ID 없음"));

        String templateName = record.getTemplateName(); // 이제 templateName 문자열만 사용

        if (templateName == null || templateName.isBlank()) {
            log.warn("⚠️ 템플릿 이름 없음 → 기본 프롬프트 사용");
            return getDefaultPrompt();
        }

        try {
            TemplateType type = TemplateType.fromName(templateName); // enum 매핑 시도
            return TemplatePromptProvider.getPrompt(type);
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ TemplateType enum 매핑 실패: {}", templateName);
            return getDefaultPrompt();
        }
    }

    private String getDefaultPrompt() {
        return """
                    너는 한국 법률 상담에 특화된 전문 AI 챗봇이야.
                    ====================
                    📌 절대 지켜야 할 상담 진행 규칙
                    ====================

                    1. 상담은 반드시 [1단계]부터 [5단계]까지 순서대로 진행해. 절대 순서 건너뛰지 마.
                    2. 사용자의 응답 없이는 다음 단계로 넘어가지 마.
                    3. 질문은 반드시 정중하고 자연스러운 문장으로 작성해.
                    4. 질문은 반드시 한 번에 하나씩만. 동시에 여러 개 묻지 마.
                    5. 출력은 대화형 문장만 사용해. 마크다운, 표, 코드블록 절대 사용하지 마 (예외: JSON 출력 단계만 허용).
                    ====================
                    ✅ 단계 정의
                    ====================

                    [1단계] 사용자 상황 파악
                    - 지금 사용자가 어떤 상황에 처했는지 공감과 함께 자연스럽게 질문해.
                    - 법적 문제의 배경, 발생 시점, 피해 내용 등을 물어봐야 해.
                    - 반드시 사용자로부터 최소 1개 이상의 정보 응답을 받도록 유도해.
                    - 질문 예시:
                      - "그런 상황은 정말 당황스러우셨겠어요.\n 구체적으로 언제 어떤 일이 있었는지 말씀해주실 수 있을까요?"

                    [2단계] 법적 쟁점 요약
                    - 사용자의 상황을 법적으로 요약해. 관련 법 조항이나 쟁점을 1~2줄로 정리해줘.
                    - 예: "정보통신망법 제70조에 따른 명예훼손죄가 적용될 수 있습니다.\n"
                    - 예: "부당해고 여부는 해고 사유와 절차의 정당성에 따라 판단됩니다.\n"

                    그리고 출력을 끝내지말고 3단계와 같이 출력해야해.


                    [3단계] 문서 템플릿 추천
                    - 2단계에서 분석한 법적 쟁점에 적합한 템플릿을 아래 중 하나만 추천해야 해. 적절하지 않으면 null로 처리하고 다른 조치를 제안해.
                    템플릿 목록:
                      1. 내용증명
                      2. 고소장(명예훼손)
                      3. 지급명령 이의신청서
                      4. 부동산 임대차 계약서
                      5. 유언장
                      6. 근로계약서
                      7. 금전차용증

                    - 추천 문구 예(반드시 위 이름과 똑같이 출력해야함):
                      -예시:  "현재 상황에는 '고소장(명예훼손)' 템플릿이 적합해 보입니다.\n 저희는 이 템플릿을 제공해드릴 수 있어요.\n 이 문서를 자동으로 작성해드릴까요?"

                    [4단계] JSON 요약 출력
                    - 사용자가 문서 작성에 동의하면 아래 형식으로 JSON을 출력해. 절대 설명 붙이지 마.
                    - 출력 예시:
                      ```json
                      {
                        "summary": 대화 내용 요약 + 문서 작성을 위해 꼭 알아야할 정보 포함,
                        "issue": 대화에서 말한 법적 이슈를 분류한 키워드,
                        "template": 추천된 문서 템플릿명(템플릿 목록 명에 있는 것과 일치해야함) 또는 null
                      }
                      ```
                    - 이어서 "자동 문서 작성을 진행하시려면 개인 정보 수집에 동의하셔야합니다.\n 개인정보 수집에 동의하시나요?"라고 반드시 질문해.

                    [5단계] 상담 종료
                    - 사용자가 "그만할래요", "상담 종료할게요"라고 말하면 아래 문장을 출력:
                      - "✅ 상담을 종료하겠습니다. 도움이 되었길 바랍니다."
                """;
    }

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

    private void extractAndSaveConsultationInfo(String reply, Long consultationId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Pattern pattern = Pattern.compile("```json\\s*(\\{.*?})\\s*```|\\{.*?}", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(reply);

            if (matcher.find()) {
                String jsonBlock = matcher.group(1) != null ? matcher.group(1) : matcher.group();
                JsonNode json = mapper.readTree(jsonBlock);

                // ✅ 요약용 JSON일 경우만 처리
                if (json.has("summary") && json.has("issue") && json.has("template")) {
                    String summary = json.get("summary").asText();
                    String issue = json.get("issue").asText();
                    String templateName = json.get("template").asText();

                    ConsultationRecord record = consultationRepository.findById(consultationId)
                            .orElseThrow(() -> new IllegalArgumentException("상담 ID 없음"));

                    record.setConsultation_summary(summary);
                    record.setIssue(issue);
                    record.setTemplateName(templateName);
                    log.info("✅ 템플릿 이름 저장 완료: {}", templateName);

                    log.info("✅ 상담 요약 저장 완료: {}, {}, {}", summary, issue, templateName);
                    consultationRepository.save(record);
                } else {
                    log.info("ℹ️ summary 키가 없는 JSON입니다. 문서 필드로 판단되어 무시됩니다.");
                }
            }
        } catch (Exception e) {
            log.error("❌ 상담 요약 저장 실패", e);
        }
    }

    private void saveDocumentSummary(String reply, Long consultationId) {
        try {
            ConsultationRecord consultation = consultationRepository.findById(consultationId)
                    .orElseThrow(() -> new IllegalArgumentException("상담 ID 없음"));

            // GPT 응답에서 JSON 블록 추출
            Pattern jsonPattern = Pattern.compile("```json\\s*(\\{.*?})\\s*```", Pattern.DOTALL);
            Matcher matcher = jsonPattern.matcher(reply);

            String jsonBlock;
            if (matcher.find()) {
                jsonBlock = matcher.group(1).trim();
            } else {
                // 백틱 없이 그냥 JSON이 바로 올 수도 있음
                int start = reply.indexOf("{");
                int end = reply.lastIndexOf("}");
                if (start != -1 && end != -1 && end > start) {
                    jsonBlock = reply.substring(start, end + 1).trim();
                } else {
                    log.warn("✖ JSON 블록이 포함되지 않은 응답입니다.");
                    return;
                }
            }

            GptInfo answer = GptInfo.builder()
                    .consultation(consultation)
                    .document_summary(jsonBlock) // JSON 문자열 그대로 저장
                    .build();

            gptInfoRepository.save(answer);
            log.info("✅ 문서 JSON 요약 저장 완료:\n{}", jsonBlock);

        } catch (Exception e) {
            log.error("❌ 문서 요약 저장 중 오류", e);
        }
    }

    public String callOpenAiForTemplate(String prompt) {
        OpenAiRequest request = OpenAiRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(new MessageDto("user", prompt)))
                .build();

        return callOpenAiApi(request);
    }
}
