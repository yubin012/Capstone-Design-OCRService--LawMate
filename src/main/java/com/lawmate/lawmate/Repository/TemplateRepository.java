package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.LegalTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TemplateRepository extends JpaRepository<LegalTemplate, Long> {
    // 🔍 templateName 컬럼 기반으로 템플릿 조회
    Optional<LegalTemplate> findByTemplateName(String templateName);
}
