package com.gym.attendance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "diem_danh_detail")
public class DiemDanhDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDiemDanh;

    @Column(nullable = false)
    private Integer madk;

    @Column(nullable = false)
    private Integer malich;

    @Column(nullable = false)
    private Integer mahv;

    @Column(nullable = false)
    private LocalDate ngayDiemDanh;

    @Column(nullable = false)
    private LocalTime gioDiemDanh;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDiemDanh trangThai;

    @Column(columnDefinition = "TEXT")
    private String ghiChu;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        trangThai = TrangThaiDiemDanh.CO_MAT;
    }

    public enum TrangThaiDiemDanh {
        CO_MAT("có_mặt"),
        VANG_MAT("vắng_mặt"),
        MUON("muộn");

        private final String value;

        TrangThaiDiemDanh(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
