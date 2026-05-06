package com.gym.trainer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "huan_luyen_vien")
public class HuanLuyenVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mahlv;

    @Column(nullable = false)
    private String hoten;

    @Column(nullable = false, unique = true)
    private String email;

    private String sdt;

    @Column(nullable = false)
    private String matkhau;

    private String chuyenmon;

    private Integer kinhnghiem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiHLV trangthai;

    private String avatar;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        trangthai = TrangThaiHLV.HOAT_DONG;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiHLV {
        HOAT_DONG("hoạt động"),
        TAM_DUNG("tạm dừng"),
        NGHI_HUU("nghỉ hưu");

        private final String value;

        TrangThaiHLV(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
