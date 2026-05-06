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
@Table(name = "lich_hoc_dang_ky")
public class LichHocDangKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer lichHocId;

    @Column(nullable = false)
    private Integer hlvId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiDangKy trangThai;

    @Column(length = 500)
    private String lyDoTuChoi;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        trangThai = TrangThaiDangKy.CHO_DUYET;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiDangKy {
        CHO_DUYET("chờ duyệt"),
        DA_DUYET("đã duyệt"),
        TU_CHOI("từ chối"),
        HUY("hủy");

        private final String value;

        TrangThaiDangKy(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
