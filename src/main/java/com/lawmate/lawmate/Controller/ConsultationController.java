package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;
import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Service.MypageService;
import com.lawmate.lawmate.Service.ConsultationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // ✅ 이 줄 추가해야 에러 해결됨

@RestController
@RequiredArgsConstructor
@RequestMapping("/consult")
@Tag(name = "2. 상담 API ", description = "상담 등록 및 조회")
public class ConsultationController {
    private final ConsultationService consultationService;

    @PostMapping
    @Operation(summary = "상담 등록")
    public ResponseEntity<Long> createConsultation(@RequestBody ConsultationRequestDto dto) {
        Long consultationId = consultationService.createConsultation(dto);
        return ResponseEntity.ok(consultationId);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "사용자별 상담 목록 조회")
    public ResponseEntity<List<ConsultationSummaryDto>> getUserConsultations(@PathVariable Long userId) {
        return ResponseEntity.ok(consultationService.getConsultationsByUser(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "상담 상세 조회")
    public ResponseEntity<ConsultationDetailDto> getConsultationDetail(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationDetail(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상담 삭제")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.ok().build();
    }
}
