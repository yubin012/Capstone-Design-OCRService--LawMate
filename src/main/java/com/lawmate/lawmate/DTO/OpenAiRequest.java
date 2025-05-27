package com.lawmate.lawmate.DTO;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenAiRequest { // GPT가 요구하는 요청 형식

  /*
   * {
   * "model": "gpt-3.5-turbo",
   * "messages": [
   * {"role": "system", "content": "너는 법률 상담 AI야..."},
   * {"role": "user", "content": "해고당했어요"}
   * ]
   * }
   */
  private String model;
  private List<MessageDto> messages;
}
