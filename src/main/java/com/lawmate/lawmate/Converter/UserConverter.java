package com.lawmate.lawmate.Converter;

import com.lawmate.lawmate.Domain.User;
import com.lawmate.lawmate.DTO.UserRequestDto;
import org.springframework.stereotype.Component;

// DTO 객체를 엔티티 객체로 변환하는 역할을함.
// 클라이언트가 보낸 회원가입 요청 데이터(UserRequestDto) 를 DB 에 저장하기 위해
// User 엔티티 객체로 변환해야함.

// 이 클래스는 서비스에서 호출되어 사용됨..
// 서비스에서의 로직 
// 사용자 요청 -> 컨버터를 통해 dto 를  엔티티로 변환 -> repository 를 사용해 db 에 접근 후 저장
@Component
public class UserConverter {
    public User toEntity(UserRequestDto dto) {
        User user = new User();
        // dto 필드 값을 하나하나 User 엔티티 필드에 복사한다.
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        return user;
    }
}
