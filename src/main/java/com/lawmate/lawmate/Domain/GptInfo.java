package com.lawmate.lawmate.Domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * GPT를 통해 상담 중 생성된 문서 작성용 요약 정보를 저장하는 클래스.
 * 추후 사용자 맞춤 문서를 자동 생성하는 데 사용됨.
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "GptInfo")
public class GptInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ 변수명은 'consultation'으로 변경 (JPA 관례 + 가독성)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id")
    private ConsultationRecord consultation;

    @ManyToOne(fetch = FetchType.LAZY)
    private LegalTemplate template;

    @Lob
    private String summaryText;// GPT가 생성한 요약 내용 (문서 생성을 위한 정보)

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
