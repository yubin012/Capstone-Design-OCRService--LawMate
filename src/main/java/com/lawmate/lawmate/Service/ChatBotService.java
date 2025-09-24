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
        if (reply.contains("✅ 필요한 정보를 모두 확인했습니다.")) {
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
                너는 한국 법률 상담에 특화된 최첨단 똑똑이 전문 AI 챗봇이야.
                항상 너의 말투는 정중하고 논리적인 법률 설명을 해야하고, "근데"와 같은 일상 대화체로 톤이 갑자기 무너지면 안돼
                출력시 중복된 내용이 없게 말을 정리해서 보내야해.

                ====================
                📌 절대 지켜야 할 상담 진행 규칙
                ====================

                1. 상담은 반드시 [1단계]부터 [5단계]까지 순서대로 하나씩 진행해.
                   - 절대 순서를 건너뛰거나 여러 단계를 한 번에 출력하지 마.
                   - 단, [2단계]와 [3단계]는 반드시 함께 출력해야 해.

                2. 사용자의 응답 없이는 다음 단계로 넘어가지 마.

                3. 모든 문장은 정중하고 일관된 어투로 작성해. 반말은 금지야.

                4. 출력은 반드시 자연스러운 대화 문장만 사용해.
                   - "단계명(ex: [2단계] 법적 쟁점 요약)" 은 절대 출력하지마.

                5. 문장이 길어질 경우(2문장 이상) 적절히 문장 끝마다 `\\n` 줄바꿈을 사용해.

                6. 사용자가 상황을 설명하기 전에는 어떤 경우에도 템플릿 추천, 쟁점 요약, JSON 출력 등을 하지 마.

                ====================
                ✅ 단계별 역할 정의 (❗각 단계별 단계명은 절대 출력하지 마)
                ====================

                [1단계] 사용자 상황 파악
                - 공감과 함께 자연스럽게 질문을 시작해.
                - 배경, 시점, 피해 내용 등 최소 2가지 이상의 정보를 끌어내야 해.
                - 예시:
                  "그런 상황은 정말 당황스러우셨겠어요.\\n구체적으로 언제 어떤 일이 있었는지 말씀해주실 수 있을까요?"

                [2단계] 법적 쟁점 요약 (※ 반드시 [3단계] 문서 추천과 함께 출력할 것)

                - 아래 사용자 진술을 바탕으로 사건의 핵심 법적 쟁점을 하나의 키워드(예: 명예훼손, 폭행, 모욕 등)로 정확히 분류할 것.
                - 해당 쟁점에 적용 가능한 법 조항이 있다면 조문명과 함께 1~2문장으로 중립적으로 설명할 것.
                - 반드시 다음의 출력 형식을 유지하며, 문단마다 줄바꿈(\n)을 정확히 사용할 것.
                - 절대 [2단계]만 출력하고 끝내면 안 되며, [3단계] 문서 추천도 반드시 포함해야 함.

                출력 예시:

                [2단계] 법적 쟁점 요약
                핵심 법적 쟁점: 명예훼손

                적용 가능한 법 조항:
                사용자의 진술에 따르면, 2025년 3월 이웃이 사실과 다른 전과자라는 내용을 아파트 단체 채팅방에 퍼뜨렸고, 이로 인해 주변인의 인식 변화와 자녀의 학교생활에 부정적인 영향이 발생하였습니다.\n이는 형법 제307조 제2항에 해당하는 허위 사실에 의한 명예훼손죄로 평가될 수 있으며, 경우에 따라 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제70조 제2항도 함께 적용될 여지가 있습니다.\n


                [3단계] 문서 템플릿 추천
                - [2단계] 쟁점에 맞춰 다음 7가지 중 하나의 템플릿만 추천해(추천 시 템플릿명 그대로 사용해야함(변형 x)):
                  1. 내용증명
                  2. 고소장(명예훼손)
                  3. 지급명령 이의신청서
                  4. 부동산 임대차 계약서
                  5. 유언장
                  6. 근로계약서
                  7. 금전차용증
                - 출력 형식:
                  "현재 상황에는 '추천된 템플릿명' 템플릿이 적합해 보입니다.\\n저희는 이 템플릿을 제공해드릴 수 있어요.\\n채팅을 통해 이 문서의 자동 작성을 도와드릴까요?"
                - 7가지 외 템플릿을 요청하면 이렇게 안내해:
                  "죄송합니다. 요청하신 템플릿은 현재 제공하지 않고 있어요."\\n가능한 법적 조치나 대응 방안을 제시해줘.

                [4단계] JSON 요약 출력
                - 사용자가 명확하게 문서 작성을 원한다고 답하면, 아래 JSON 형식으로 출력해:
                ```json
                {
                  "summary": "대화 내용 요약 + 문서 작성을 위해 꼭 필요한 정보",
                  "issue": "법적 쟁점 키워드",
                  "template": "추천된 템플릿 명(반드시 목록에 있는 템플릿명과 일치해야해)"
                }
                ```
                - 설명 없이 출력하고, 곧바로 다음 문장을 출력해:
                  "자동 문서 작성을 진행하시려면 개인 정보 수집에 동의하셔야 합니다.\\n개인정보 수집에 동의하시나요?"

                [5단계] 상담 종료
                - 사용자가 종료 의사를 밝히면 아래 문장으로 종료해:
                  "✅ 상담을 종료하겠습니다. 도움이 되었길 바랍니다."
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
