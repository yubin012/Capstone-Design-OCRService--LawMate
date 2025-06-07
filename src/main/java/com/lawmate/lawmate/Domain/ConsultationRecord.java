package com.lawmate.lawmate.Domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.lawmate.lawmate.Domain.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "consultation_record")
public class ConsultationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 한 명의 사용자에게 여러 상담 기록이 연결됨 (다대일)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    private String startment; // 상담 시작 시 사용자의 질문 내용

    private String issue; // 핵심 법적 쟁점 키워드 (예: 부당해고)

    @Lob
    private String consultation_summary; // 전체 상담 요약 내용

    private String templateName; // 템플릿 이름 (예: "내용증명", "고소장(명예훼손)")

    private LocalDateTime consultationDate;

    @PrePersist
    protected void onCreate() {
        this.consultationDate = LocalDateTime.now();
    }
}
