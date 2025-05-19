package com.lawmate.lawmate.DTO;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MypageDto {
    private String name;
    private String email;
    private String consultationHistory;
    private String documentHistory;
}
