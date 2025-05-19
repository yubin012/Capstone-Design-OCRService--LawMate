package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.ConsultationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<ConsultationRecord, Long> {
    List<ConsultationRecord> findByUserUserId(Long userId);
}
