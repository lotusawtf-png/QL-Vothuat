package com.gym.member.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "diem_danh_lop")
public class DiemDanhLop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer hvId;

    @Column(nullable = false)
    private Integer lichHocId;

    @Column(nullable = false)
    private LocalDate ngayHoc;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDiemDanh trangThai;

    @Column(length = 500)
    private String ghiChu;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (trangThai == null) {
            trangThai = TrangThaiDiemDanh.CO_MAT;
        }
    }

    public enum TrangThaiDiemDanh {
        CO_MAT("có mặt"),
        VANG("vắng"),
        VANG_KHONG_PHEP("vắng không phép"),
        XIN_PHEP("xin phép");

        private final String value;

        TrangThaiDiemDanh(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
