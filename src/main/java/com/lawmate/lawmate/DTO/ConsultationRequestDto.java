package com.lawmate.lawmate.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter // 단순 요청용DTO - POST /consultation에서 Body로 넘어옴
public class ConsultationRequestDto {
    private Long userId;
    private String issueDescription;
}
