package com.gym.member.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "goi_tap")
public class GoiTap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer magoi;

    @Column(nullable = false)
    private String tengoi;

    @Column(columnDefinition = "TEXT")
    private String mota;

    @Column(nullable = false)
    private BigDecimal giatien;

    @Column(nullable = false)
    private Integer thoiHan;

    @Column(nullable = false)
    private Integer buoi;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
