package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationEndRequestDto {
    private String issue; // 전체 대화 요약
    private String summary; // GPT가 추출한 법적 이슈
    private Long templateId; // 여러 개 중 사용자가 선택한 템플릿
}