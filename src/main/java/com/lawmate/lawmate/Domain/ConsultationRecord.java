package com.lawmate.lawmate.Domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.lawmate.lawmate.Domain.LegalTemplate;

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
    private Long consultationId;

    // 한명의 사용자에게 많은 상담 기록이 연결되어있다는 뜻
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Lob // 긴 문자열에 사용 - 사용자의 첫 질문 저장
    private String startment;

    private String issue;

    @Lob
    private String summary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private LegalTemplate template;

    private LocalDateTime consultationDate;

    @PrePersist
    protected void onCreate() {
        this.consultationDate = LocalDateTime.now();
    }
}
