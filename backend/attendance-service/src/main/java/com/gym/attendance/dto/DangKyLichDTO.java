package com.gym.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DangKyLichDTO {
    private Integer madk;
    private Integer malich;
    private Integer mahv;
    private LocalDate ngayDangKy;
    private String trangthai;
}
