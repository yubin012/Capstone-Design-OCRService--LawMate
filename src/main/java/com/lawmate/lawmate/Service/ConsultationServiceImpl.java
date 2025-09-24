package com.lawmate.lawmate.Service;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.User;
import com.lawmate.lawmate.DTO.ConsultationStartRequestDto;
import com.lawmate.lawmate.DTO.ConsultationEndRequestDto;
import com.lawmate.lawmate.Repository.ConsultationRepository;
import com.lawmate.lawmate.Repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// 상담 기록 생성 및 종료 처리 
@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;

    @Override
    public Long startConsultation(Long userId, ConsultationStartRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        ConsultationRecord record = ConsultationRecord.builder()
                .user(user)
                .startment(request.getStartment())
                .build();

        return consultationRepository.save(record).getId();
    }

}
