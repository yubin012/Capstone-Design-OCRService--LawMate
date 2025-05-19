package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;
import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Service.MypageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(name = "3. 마이페이지 API ", description = "상담 및 문서 기록 조회")
public class UserController {
    private final JwtTokenProvider jwtTokenProvider;
    private final MypageService mypageService;

    @GetMapping("/me")
    @Operation(summary = "마이페이지 조회", description = "현재 로그인한 사용자의 마이페이지 정보를 반환합니다.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MypageDto> getUserDetails(HttpServletRequest request) {
        Long userId = extractUserId(request);
        MypageDto mypage = mypageService.getMypage(userId);
        return ResponseEntity.ok(mypage);
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = extractToken(request);
        return Long.parseLong(jwtTokenProvider.getUserId(token)); // email이 아니라면 getUserId로 바꾸는게 더 좋음
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization header is missing or invalid");
        }
        return authHeader.substring(7);
    }
}