package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 상담 기록 및 id 조회 
public interface ConsultationRepository extends JpaRepository<ConsultationRecord, Long> {
    List<ConsultationRecord> findByUserUserId(Long userId);
}
