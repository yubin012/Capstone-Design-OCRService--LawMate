package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationSummaryDto {
    private Long consultationId;
    private String title;
    private String status;
    private LocalDateTime consultedAt;
}
