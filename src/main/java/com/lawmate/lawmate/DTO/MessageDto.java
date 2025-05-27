package com.lawmate.lawmate.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//GPT 요청용 
// 지금까지의 전체 대화 히스토리를 모두 포함해야 함
//  매 질문마다 프론트는 이전 메시지 + 새로운 질문을 포함한 전체 리스트를 /chat에 보내야 GPT가 맥락을 이해함
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private String role; // "user" 또는 "assistant"
    private String content; // 메세지 내용
}
