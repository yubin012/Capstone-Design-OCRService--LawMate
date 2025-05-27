package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @RequsetBody 로 JSON 을 받아올때는 
// Jackson 이라는 라이브러리가 setter로 매핑하기 때문에 builder 불필요
// Response 일땐 서비스 내부에서 값을 조립해서 보내는거니까 BUilder 가 유리함

// ❗ 요청(Request) → setter 기반
// ✅ 응답(Response) → builder 기반
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationStartRequestDto {
    private String startment;
}
