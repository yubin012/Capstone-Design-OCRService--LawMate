package com.lawmate.lawmate.Service;

import org.springframework.stereotype.Service;

import com.lawmate.lawmate.DTO.MypageDto;
import com.lawmate.lawmate.Domain.Mypage;
import com.lawmate.lawmate.Domain.User;
import com.lawmate.lawmate.Repository.MypageRepository;
import com.lawmate.lawmate.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MypageService {

        private final UserRepository userRepository;
        private final MypageRepository mypageRepository;

        public MypageDto getMypage(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

                Mypage mypage = mypageRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("마이페이지 정보가 없습니다."));

                return MypageDto.builder()
                                .name(user.getName())
                                .email(user.getEmail())
                                .consultationHistory(mypage.getConsultationHistory())
                                .documentHistory(mypage.getDocumentHistory())
                                .build();
        }
}
