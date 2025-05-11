package com.lawmate.lawmate.Service;

import com.lawmate.lawmate.Converter.UserConverter;
import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Domain.User;
import com.lawmate.lawmate.Repository.UserRepository;
import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// 회원가입: 유저 저장 + 비밀번호 암호화
// 로그인 : 이메일 /비번 확인 후 토큰 발급
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserConverter userConverter;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder, UserConverter userConverter) {
        this.userConverter = userConverter;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public void signup(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("이미 가입된 메일입니다");
        }
        User user = userConverter.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(user.getEmail());
        return new LoginResponseDto(token, user.getEmail());
    }
}
