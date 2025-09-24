package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

// JWT 응답 
@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String email;
}
