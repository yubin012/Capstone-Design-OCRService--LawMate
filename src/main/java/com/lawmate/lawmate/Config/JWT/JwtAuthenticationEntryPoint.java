package com.lawmate.lawmate.Config.JWT;

// 인증 실패 시 401 Unauthorized 응답
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
// Security에서 인증되지 않은 요청이 들어왔을 때
// 자동으로 작동해서 클라이언트에게 HTTP 401 Unauthorized를 보내주는 역할을 함.
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "인증이 필요합니다.");
    }
}