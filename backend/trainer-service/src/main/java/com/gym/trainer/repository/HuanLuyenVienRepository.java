package com.gym.trainer.repository;

import com.gym.trainer.model.HuanLuyenVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HuanLuyenVienRepository extends JpaRepository<HuanLuyenVien, Integer> {
    Optional<HuanLuyenVien> findByEmail(String email);
    List<HuanLuyenVien> findByTrangthai(HuanLuyenVien.TrangThaiHLV trangthai);
    List<HuanLuyenVien> findByChuyenmon(String chuyenmon);
}
