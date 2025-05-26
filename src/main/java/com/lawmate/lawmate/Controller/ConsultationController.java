package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.DTO.ConsultationStartRequestDto;
import com.lawmate.lawmate.DTO.ChatRequestDto;
import com.lawmate.lawmate.DTO.ChatResponseDto;
import com.lawmate.lawmate.DTO.ConsultationEndRequestDto;
import com.lawmate.lawmate.DTO.MessageDto;
import com.lawmate.lawmate.Service.ConsultationService;
import com.lawmate.lawmate.Service.ChatBotService;
import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;

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

    // 🔹 첫 질문 처리: 세션 생성 + 첫 질문 DB 저장 + GPT 응답 반환
    @PostMapping("/startChat")
    @Operation(summary = "상담 시작", description = "JWT에서 사용자 ID를 추출하여 상담 세션 생성")
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
    @Operation(summary = "상담 중 대화 이어가기", description = "이전 메시지들을 바탕으로 GPT가 답변 생성")
    public ResponseEntity<ChatResponseDto> continueChat(@RequestBody ChatRequestDto request) {
        // 1. GPT 응답 메시지 생성
        String gptMessage = chatBotService.processChat(request).getMessage();

        // 2. 응답에 consultationId 포함해서 DTO 생성
        ChatResponseDto response = new ChatResponseDto(gptMessage, request.getConsultationId());

        // 3. 반환
        return ResponseEntity.ok(response);
    }

    // 🔹 상담 종료: 요약/이슈/템플릿 저장
    @PostMapping("/end/{consultationId}")
    @Operation(summary = "상담 종료", description = "summary / issue / template 저장")
    public ResponseEntity<Void> endConsultation(@PathVariable Long consultationId,
            @RequestBody ConsultationEndRequestDto request) {
        consultationService.endConsultation(consultationId, request);
        return ResponseEntity.ok().build();
    }
}
