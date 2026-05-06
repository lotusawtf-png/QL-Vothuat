package com.gym.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HocVienDTO {
    private Integer mahv;
    private String hoten;
    private LocalDate ngaysinh;
    private String email;
    private String sdt;
    private Integer magoi;
    private String tiendo;
    private LocalDate ngaydangky;
    private String trangthai;
    private String avatar;
}
