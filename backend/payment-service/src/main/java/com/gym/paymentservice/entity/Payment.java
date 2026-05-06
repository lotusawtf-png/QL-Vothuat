package com.gym.paymentservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mapaid;

    @Column(nullable = false)
    private Integer hocvien_id;

    @Column(nullable = false, length = 100)
    private String hocvien_ten;

    @Column(nullable = false)
    private Integer goi_id;

    @Column(nullable = false, length = 100)
    private String goi_ten;

    @Column(nullable = false)
    private BigDecimal sotien;

    @Column(nullable = false, length = 50)
    private String phuongthuc;

    @Column(nullable = false, length = 50)
    private String trangthai;

    @Column(nullable = false)
    private LocalDate ngay;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
