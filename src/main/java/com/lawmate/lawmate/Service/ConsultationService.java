package com.lawmate.lawmate.Service;

import com.lawmate.lawmate.DTO.ConsultationStartRequestDto;
import com.lawmate.lawmate.DTO.ConsultationEndRequestDto;

public interface ConsultationService {
    Long startConsultation(Long userId, ConsultationStartRequestDto request);

}