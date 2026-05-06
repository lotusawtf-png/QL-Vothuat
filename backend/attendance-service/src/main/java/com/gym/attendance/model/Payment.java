package com.gym.attendance.model;

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
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mapaid;

    @Column(nullable = false)
    private Integer mahv;

    @Column(nullable = false)
    private Integer magoi;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String accountName;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String bank;

    @Column(columnDefinition = "LONGTEXT")
    private String qrText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrangThaiThanhToan status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = TrangThaiThanhToan.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TrangThaiThanhToan {
        PENDING("pending"),
        PAID("paid"),
        FAILED("failed");

        private final String value;

        TrangThaiThanhToan(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
