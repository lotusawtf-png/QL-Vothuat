package com.gym.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoiTapDTO {
    private Integer magoi;
    private String tengoi;
    private String mota;
    private BigDecimal giatien;
    private Integer thoiHan;
}
