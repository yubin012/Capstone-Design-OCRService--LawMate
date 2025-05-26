package com.lawmate.lawmate.Service;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.LegalTemplate;
import com.lawmate.lawmate.Domain.User;
import com.lawmate.lawmate.DTO.ConsultationStartRequestDto;
import com.lawmate.lawmate.DTO.ConsultationEndRequestDto;
import com.lawmate.lawmate.Repository.ConsultationRepository;
import com.lawmate.lawmate.Repository.UserRepository;
import com.lawmate.lawmate.Repository.TemplateRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;

    @Override
    public Long startConsultation(Long userId, ConsultationStartRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        ConsultationRecord record = ConsultationRecord.builder()
                .user(user)
                .startment(request.getStartment())
                .build();

        return consultationRepository.save(record).getConsultationId();
    }

    @Override
    public void endConsultation(Long consultationId, ConsultationEndRequestDto request) {
        ConsultationRecord record = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("상담 기록을 찾을 수 없습니다"));

        record.setIssue(request.getIssue());
        record.setSummary(request.getSummary());

        if (request.getTemplateId() != null) {
            LegalTemplate template = templateRepository.findById(request.getTemplateId())
                    .orElseThrow(() -> new IllegalArgumentException("템플릿을 찾을 수 없습니다"));
            record.setTemplate(template);
        }

        consultationRepository.save(record);
    }
}
