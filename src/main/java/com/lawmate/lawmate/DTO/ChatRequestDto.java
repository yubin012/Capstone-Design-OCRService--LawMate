package com.lawmate.lawmate.DTO;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDto {
    private Long consultationId; // 상담 Id
    private List<MessageDto> messages; // ⬅️ GPT에게 전달할 전체 대화 히스토리
}
