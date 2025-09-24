package com.lawmate.lawmate.Domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor

// GPT 대화 기반으로 생성된 실제 문서 결과
public class SummaryDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ConsultationRecord consultation;

    @Lob
    private String content;

    private LocalDateTime createdAt;
}
