package com.gym.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberClassEnrollmentDTO {
    private Integer id;
    private Integer hvId;
    private Integer goiId;
    private Integer lichHocId;
    private Integer soBuoiDaSuDung;
    private Integer soBuoiConLai;
    private String trangThai;
}
