package com.gym.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HuanLuyenVienDTO {
    private Integer mahlv;
    private String hoten;
    private String email;
    private String sdt;
    private String chuyenmon;
    private Integer kinhnghiem;
    private String trangthai;
    private String avatar;
}
