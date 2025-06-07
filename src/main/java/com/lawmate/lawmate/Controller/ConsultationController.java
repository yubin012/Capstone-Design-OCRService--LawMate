package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.DTO.ConsultationStartRequestDto;
import com.lawmate.lawmate.DTO.ChatRequestDto;
import com.lawmate.lawmate.DTO.ChatResponseDto;
import com.lawmate.lawmate.DTO.ConsultationEndRequestDto;
import com.lawmate.lawmate.DTO.MessageDto;
import com.lawmate.lawmate.Service.ConsultationService;
import com.lawmate.lawmate.Service.ChatBotService;
import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;
//import com.lawmate.lawmate.Service.SummaryDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ✅ [1] ConsultationController.java - 챗봇 API의 진입점
@RestController
@RequestMapping("/consult")
@RequiredArgsConstructor
@Tag(name = "2. 챗봇상담 API", description = "첫 질문 + 요약 및 이슈 정리한 내용을 DB 에 저장")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final ChatBotService chatBotService;
    private final JwtTokenProvider jwtTokenProvider;
    // private final SummaryDocumentService summaryDocumentService;

    // 🔹 첫 질문 처리: 세션 생성 + 첫 질문 DB 저장 + GPT 응답 반환
    @PostMapping("/startChat")
    @Operation(summary = "상담 시작", description = "JWT에서 사용자 ID를 추출하여 상담 세션 생성+DB에 첫 질문 저장 ")
    public ResponseEntity<ChatResponseDto> startConsultation(
            @RequestBody ConsultationStartRequestDto request,
            HttpServletRequest httpRequest) {

        // 1. Authorization 헤더에서 토큰 추출 후 userId 가져오기
        String token = httpRequest.getHeader("Authorization").replace("Bearer ", "");
        Long userId = Long.parseLong(jwtTokenProvider.getUserId(token));

        // 2. DB에 상담 세션과 첫 질문 저장(userId를 서비스로 넘김)
        Long consultationId = consultationService.startConsultation(userId, request);

        // 3. GPT 응답 생성
        List<MessageDto> messages = List.of(new MessageDto("user", request.getStartment()));
        String gptReply = chatBotService.processChat(new ChatRequestDto(consultationId, messages)).getMessage();

        // 3. 응답 DTO 생성 - 🔹 ChatResponseDto에 consultationId 포함
        ChatResponseDto response = new ChatResponseDto(gptReply, consultationId);

        // 4. 응답 반환
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    @Operation(summary = "상담 중 대화 이어가기", description = """
            사용자의 입력 메시지를 받아 이전 대화 기록과 함께 GPT에게 전달하여 응답을 생성합니다.

            ✅ 주요 처리 흐름:
            1. 백: GPT 호출 전 system 메시지로 역할 및 규칙 프롬프트를 추가함.

            2. 프론트 :사용자 메시지 리스트를 함께 전달하여 GPT가 문맥을 유지하도록 한다.

            3. 사용자는 상담 중, 종료 여부, 문서 작성 여부만 자연어로 말하면 됨.
            (예: "그만할래요", "문서 작성해줘" 등)

            4. 위의 요청에 따라 GPT의 응답이 특정 채팅 종료 키워드를 출력하며 후속 처리를 자동으로 수행합니다:
                  GPT 응답 내용에 따라 백엔드에서 DB 저장 로직이 자동 수행.
              - '✅ 필요한 정보를 모두 확인했습니다. 이제 문서 작성 모드로 전환합니다.' 가 출력되면 "/json/{consultationId} 로 API 자동 호출 필요

            띠라서 프론트는 POST /chat으로 매채팅마다 메시지 리스트만 보내면 됨. 그러다 gpt 에서 특정 채팅 종료 키워드 출력 시 페이지 전환 구현 필요
            """)
    public ResponseEntity<ChatResponseDto> continueChat(@RequestBody ChatRequestDto request) {
        // 1. GPT 응답 메시지 생성
        String gptMessage = chatBotService.processChat(request).getMessage();

        // 2. 응답에 consultationId 포함해서 DTO 생성
        ChatResponseDto response = new ChatResponseDto(gptMessage, request.getConsultationId());

        // 3. 반환
        return ResponseEntity.ok(response);
    }

    /*
     * // 자동 호출용 트리거
     * 
     * @PostMapping("/StartDocument/{consultationId}")
     * 
     * @Operation(summary = "상담 종료+ 자동 문서 생성 시작 ", description =
     * "챗봇 그냥 종료시 호출 x, 문서 자동 생성이 필요한 종료인 경우에만 상담 id 를 통해 호출하면 됨.")
     * public ResponseEntity<Void> endConsultation(
     * 
     * @PathVariable Long consultationId,
     * 
     * @RequestBody ConsultationEndRequestDto request) {
     * 
     * // 2. 자동 문서 생성 트리거
     * // summaryDocumentService.generateFromChat(consultationId); // 🔹 요기가 핵심
     * 
     * return ResponseEntity.ok().build();
     * }
     */
}
