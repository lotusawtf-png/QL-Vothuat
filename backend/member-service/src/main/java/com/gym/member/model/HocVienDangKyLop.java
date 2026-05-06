package com.gym.member.model;

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
@Table(name = "hoc_vien_dang_ky_lop")
public class HocVienDangKyLop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer hvId;

    @Column(nullable = false)
    private Integer goiId;

    @Column(nullable = false)
    private Integer lichHocId;

    @Column(nullable = false)
    private Integer soBuoiDaSuDung;

    @Column(nullable = false)
    private Integer soBuoiConLai;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDangKyLop trangThai;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        trangThai = TrangThaiDangKyLop.DANG_HOC;
        if (soBuoiDaSuDung == null) {
            soBuoiDaSuDung = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiDangKyLop {
        DANG_HOC("đang học"),
        TAM_DUNG("tạm dừng"),
        KET_THUC("kết thúc");

        private final String value;

        TrangThaiDangKyLop(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
