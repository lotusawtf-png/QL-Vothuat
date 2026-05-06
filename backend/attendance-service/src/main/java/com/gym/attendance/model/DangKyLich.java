package com.gym.attendance.model;

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
@Table(name = "dang_ky_lich")
public class DangKyLich {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer madk;

    @Column(nullable = false)
    private Integer malich;

    @Column(nullable = false)
    private Integer mahv;

    @Column(nullable = false)
    private LocalDate ngayDangKy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDangKy trangthai;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        ngayDangKy = LocalDate.now();
        trangthai = TrangThaiDangKy.CHO_DUYET;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiDangKy {
        CHO_DUYET("cho_duyet"),
        DA_DUYET("da_duyet"),
        TU_CHOI("tu_choi");

        private final String value;

        TrangThaiDangKy(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
