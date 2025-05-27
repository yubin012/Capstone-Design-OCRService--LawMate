package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.GptInfo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GptInfoRepository extends JpaRepository<GptInfo, Long> {
    Optional<GptInfo> findByConsultation_Id(ConsultationRecord consultationId);
}
