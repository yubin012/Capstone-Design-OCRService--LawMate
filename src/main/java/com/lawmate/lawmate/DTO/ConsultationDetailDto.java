package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ConsultationDetailDto {
    private Long consultationId;
    private String issueDescription;
    private String aiResponse;
    private String status;
    private LocalDateTime consultedAt;
}
