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
@Table(name = "hoc_vien")
public class HocVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mahv;

    @Column(nullable = false)
    private String hoten;

    private LocalDate ngaysinh;

    @Column(nullable = false, unique = true)
    private String email;

    private String sdt;

    @Column(nullable = false)
    private String matkhau;

    private Integer magoi;

    private String tiendo;

    @Column(nullable = false)
    private LocalDate ngaydangky;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiHocVien trangthai;

    private String avatar;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        ngaydangky = LocalDate.now();
        trangthai = TrangThaiHocVien.DANG_TAP;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiHocVien {
        DANG_TAP("đang tập"),
        TAM_DUNG("tạm dừng"),
        HET_HAN("hết hạn");

        private final String value;

        TrangThaiHocVien(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
