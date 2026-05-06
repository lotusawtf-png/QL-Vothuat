package com.gym.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Integer mapaid;
    private Integer mahv;
    private Integer magoi;
    private BigDecimal amount;
    private String accountName;
    private String accountNumber;
    private String bank;
    private String qrText;
    private String status;
}
