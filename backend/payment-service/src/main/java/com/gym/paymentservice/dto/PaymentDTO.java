package com.gym.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Integer mapaid;
    private Integer hocvien_id;
    private String hocvien_ten;
    private Integer goi_id;
    private String goi_ten;
    private BigDecimal sotien;
    private String phuongthuc;
    private String trangthai;
    private LocalDate ngay;
}
