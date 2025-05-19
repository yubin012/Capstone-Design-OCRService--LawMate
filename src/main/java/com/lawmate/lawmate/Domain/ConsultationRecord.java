package com.lawmate.lawmate.Domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    private String issueDescription;

    @Lob
    private String aiResponse;

    private String status;

    private LocalDateTime consultationDate;

    @PrePersist
    protected void onCreate() {
        this.consultationDate = LocalDateTime.now();
        this.status = "진행중";
    }
}
