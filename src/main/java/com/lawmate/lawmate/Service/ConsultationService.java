package com.lawmate.lawmate.Service;

import com.lawmate.lawmate.DTO.*;
import com.lawmate.lawmate.Domain.*;
import com.lawmate.lawmate.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;

    public Long createConsultation(ConsultationRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        ConsultationRecord consultation = ConsultationRecord.builder()
                .user(user)
                .issueDescription(dto.getIssueDescription())
                .aiResponse("AI 응답 예시")
                .build();

        consultationRepository.save(consultation);
        return consultation.getConsultationId();
    }

    public List<ConsultationSummaryDto> getConsultationsByUser(Long userId) {
        return consultationRepository.findByUserUserId(userId).stream()
                .map(c -> new ConsultationSummaryDto(
                        c.getConsultationId(),
                        shorten(c.getIssueDescription()),
                        c.getStatus(),
                        c.getConsultationDate()))
                .collect(Collectors.toList());
    }

    public ConsultationDetailDto getConsultationDetail(Long id) {
        ConsultationRecord c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상담이 존재하지 않습니다"));

        return new ConsultationDetailDto(
                c.getConsultationId(),
                c.getIssueDescription(),
                c.getAiResponse(),
                c.getStatus(),
                c.getConsultationDate());
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    private String shorten(String content) {
        return content.length() > 30 ? content.substring(0, 30) + "..." : content;
    }
}
