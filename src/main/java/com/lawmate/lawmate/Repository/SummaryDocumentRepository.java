package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.SummaryDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//생성된 문서 저장소
public interface SummaryDocumentRepository extends JpaRepository<SummaryDocument, Long> {
    List<SummaryDocument> findByConsultation_Id(Long consultationId);
}