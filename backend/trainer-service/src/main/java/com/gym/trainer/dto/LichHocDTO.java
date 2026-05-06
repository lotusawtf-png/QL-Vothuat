package com.gym.trainer.dto;

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
public class LichHocDTO {
    private Integer malich;
    private Integer mahlv;
    private String tenBuoi;
    private String moTa;
    private LocalDate ngayHoc;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private Integer soLuongToiDa;
    private Integer soLuongHienTai;
    private String trangthai;
}
