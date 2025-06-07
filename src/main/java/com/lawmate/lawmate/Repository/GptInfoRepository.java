package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import com.lawmate.lawmate.Domain.GptInfo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.util.List;

// GPT 대화 내용 저장 및 조회
public interface GptInfoRepository extends JpaRepository<GptInfo, Long> {

    List<GptInfo> findAllByConsultation_Id(Long consultationId);

    Optional<GptInfo> findByConsultation_Id(ConsultationRecord consultationId);
}
