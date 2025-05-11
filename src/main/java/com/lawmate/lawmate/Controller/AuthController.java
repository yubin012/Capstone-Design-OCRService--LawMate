package com.lawmate.lawmate.Controller;

import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserRequestDto dto) {
        authService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

}
