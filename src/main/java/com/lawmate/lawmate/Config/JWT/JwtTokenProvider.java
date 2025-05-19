package com.lawmate.lawmate.Config.JWT;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT 토큰을 생성하고 해석하며 유효성 검증을 담당하는 클래스
 * - 토큰에 사용자 식별 정보를 담고
 * - 서명을 통해 위조 여부를 검증함
 */
@Slf4j
@Component
public class JwtTokenProvider {

    // 서명용 비밀 키 (서버만 알고 있어야 함)
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 토큰 유효 시간: 1시간 (3600000ms)
    private static final long EXPIRATION_TIME = 3600000;

    /**
     * JWT 생성
     * 
     * @param userId 사용자 고유 ID (DB의 PK 등)
     * @return 생성된 JWT 문자열
     */
    public String createToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // 사용자 ID를 sub(subject)에 저장
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료 시간
                .signWith(SECRET_KEY) // 비밀키로 서명
                .compact();
    }

    /**
     * 토큰 유효성 검사 (서명 위조 여부, 만료 여부 등)
     * 
     * @param token 클라이언트로부터 받은 JWT
     * @return 유효한 경우 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token); // 내부적으로 서명 검증 + 만료일 확인

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * JWT에서 사용자 ID(sub) 추출
     * 
     * @param token JWT 토큰
     * @return userId (String)
     */
    public String getUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.info("Extracted userId from token: {}", claims.getSubject());
            return claims.getSubject();
        } catch (Exception e) {
            log.error("Failed to extract userId: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid token");
        }
    }
}
