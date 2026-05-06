package com.gym.trainer.model;

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
@Table(name = "lich_hoc")
public class LichHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer malich;

    @Column(nullable = false)
    private Integer mahlv;

    @Column(nullable = false)
    private String tenBuoi;

    @Column(columnDefinition = "TEXT")
    private String moTa;

    @Column(nullable = false)
    private LocalDate ngayHoc;

    @Column(nullable = false)
    private LocalTime gioBatDau;

    @Column(nullable = false)
    private LocalTime gioKetThuc;

    @Column(nullable = false)
    private Integer soLuongToiDa;

    @Column(nullable = false)
    private Integer soLuongHienTai;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiLich trangthai;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDuyet trangThaiDuyet;

    @Column(columnDefinition = "JSON")
    private String danhSachHlvDangKy;

    @Column(length = 500)
    private String lyDoTuChoi;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        trangthai = TrangThaiLich.SAP_DIEN_RA;
        trangThaiDuyet = TrangThaiDuyet.CHO_DUYET;
        soLuongHienTai = 0;
        danhSachHlvDangKy = "[]";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiLich {
        SAP_DIEN_RA("sap_dien_ra"),
        DA_DIEN_RA("da_dien_ra"),
        HUY("huy");

        private final String value;

        TrangThaiLich(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum TrangThaiDuyet {
        CHO_DUYET("chờ duyệt"),
        DA_DUYET("đã duyệt"),
        TU_CHOI("từ chối");

        private final String value;

        TrangThaiDuyet(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
