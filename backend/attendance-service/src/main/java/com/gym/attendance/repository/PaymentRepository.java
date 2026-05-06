package com.gym.attendance.repository;

import com.gym.attendance.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByMahv(Integer mahv);
    List<Payment> findByStatus(Payment.TrangThaiThanhToan status);
}
