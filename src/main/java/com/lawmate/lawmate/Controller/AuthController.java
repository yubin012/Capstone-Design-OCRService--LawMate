package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Service.AuthService;
import com.lawmate.lawmate.Service.MypageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // 이 클래스는 REST API 컨트롤러로 등록되며, 응답은 기본적으로 JSON 형식임.
@RequiredArgsConstructor // AuthService 필드에 대해 생성자를 자동 생성하여 DI 적용.
@RequestMapping("/auth")
@Tag(name = "1. 인증 API", description = "로그인/회원가입 관련 API")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserRequestDto dto) {
        authService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    @Operation(summary = "유저 로그인", description = "유저 로그인시 JWT 토큰을 반환합니다.", security = @SecurityRequirement(name = "")) // 인증
                                                                                                                       // 요구
                                                                                                                       // 함!)
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

}
