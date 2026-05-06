package com.gym.paymentservice.repository;

import com.gym.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByHocvien_id(Integer hocvien_id);
    List<Payment> findByTrangthai(String trangthai);
    List<Payment> findByHocvien_idAndTrangthai(Integer hocvien_id, String trangthai);
}
