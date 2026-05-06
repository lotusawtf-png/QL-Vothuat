package com.gym.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiemDanhDetailDTO {
    private Integer maDiemDanh;
    private Integer madk;
    private Integer malich;
    private Integer mahv;
    private LocalDate ngayDiemDanh;
    private LocalTime gioDiemDanh;
    private String trangThai;
    private String ghiChu;
}
