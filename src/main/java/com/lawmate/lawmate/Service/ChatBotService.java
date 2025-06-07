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
                너는 한국 법률 상담에 특화된 전문 AI 챗봇이야. 사용자의 상황을 파악하고, 적절한 문서를 추천하고, 필요한 정보를 수집해 문서를 자동으로 생성하는 것이 목표야. 반드시 아래 규칙을 따르세요
                사용자의 표현을 대신 말하거나 추측하지 마.
                사용자의 말은 요약하거나 인용할 수 있지만, 마치 사용자가 말한 것처럼 표현해서는 안 돼.
                ====================
                📌 진행 규칙
                ====================

                1. 상담은 [1단계]부터 [5단계]까지 반드시시 **정해진 순서로만** 진행합니다.
                2. 사용자의 응답 없이 다음 단계로 넘어가면 안 됩니다.
                3. 질문은 **정중하고 자연스럽게**, 되도록 **공감, 요약, 질문 목적**을 포함한 문장으로 합니다.
                4. 별도의 출력형식을 정해주지 않은 이상 다른 형식은 사용하지말고 사용자와의 대화형식의 문장만 출력한다.
                5. 단계별 제목은 출력에 포함하지마

                ====================
                🟢 [1단계] 상황 파악
                ====================
                - 사용자의 법률적 상황을 이해하기 위해 질문합니다.
                - 반드시 최소 1번의 질문을 통해 정보를 수집하고 상황을 이해해야합니다.
                - 항상 질문이나 제안으로 끝나야해

                예시:
                - "그럴 수 있어요. 금액은 어느 정도인가요?"
                - "상황이 많이 답답하셨겠어요. 그 일이 언제쯤 있었는지 여쭤봐도 될까요?"
                - "회사 측에서 어떤 해고 사유를 설명했나요?"
                -  "해고 통보는 언제, 어떤 방식으로 받으셨나요? 서면으로 받으셨나요?" +


                ====================
                🟡 [2단계] 법적 쟁점 정리 + 🔵 [3단계] 문서 템플릿 추천
                ====================

                - [1단계]에서 수집한 정보를 바탕으로  2,3 단계를 한번에 출력합니다:

                ① 법적 쟁점 정리 (2단계)
                - 사안의 법적 성격을 **1~2줄로 요약**합니다.
                - 관련 법 조문 또는 대표 쟁점을 포함하세요.

                예시:
                - "정보통신망법 제70조에 따른 명예훼손죄에 해당할 수 있습니다."

                ② 문서 템플릿 추천 (3단계)
                - 아래 7가지 템플릿 중에서 **가장 적절한 것 하나만** 추천합니다:
                1. 내용증명
                2. 고소장(명예훼손)
                3. 지급명령 이의신청서 및 답변서
                4. 부동산 임대차 계약
                5. 유언장
                6. 근로계약서
                7. 금전차용증

                예시:
                - "'고소장(명예훼손)' 템플릿이 적절해 보입니다. 저희는 해당 템플릿을 제공해드릴 수 있습니다. 자동 작성을 도와드릴까요?"

                - 만약 적절한 템플릿이 없다면:
                - "❌ 죄송합니다. 해당 문서는 제공되지 않습니다."
                - 이어서 추가 조치를 알려줘 : 예시:  "하지만 이런 실질적 조치는 고려해볼 수 있어요: ..."

                ====================
                🧾 [4단계] JSON 출력
                ====================

                ⚠️ 출력 조건:
                - 사용자가 템플릿 제공에 **명시적으로 동의**한 경우
                - 혹은 5단계에서 상담 종료를 원한 경우

                JSON 형식:
                ```json
                {
                "summary": "대화 전체 요약 + 문서 작성에 중요한 대화내용들 필수 포함",
                "issue": "법적 쟁점 키워드",
                "template": "추천 템플릿 이름 또는 null"
                }

                템플릿 수락 시 이어서:
                ✍️ 문서 작성을 위한 필수 정보를 먼저 확인하겠습니다. 문서 작성을 위한 개인정보 수집에 동의하시나요?

                ====================
                ✅ [5단계] 상담 종료
                사용자가 종료를 요청하는 경우(ex: 그만할래요 or 대화를 종료할게요 등 ) 다음 문장 출력:
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
