package com.gym.attendance.repository;

import com.gym.attendance.model.DangKyLich;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DangKyLichRepository extends JpaRepository<DangKyLich, Integer> {
    List<DangKyLich> findByMalich(Integer malich);
    List<DangKyLich> findByMahv(Integer mahv);
    List<DangKyLich> findByTrangthai(DangKyLich.TrangThaiDangKy trangthai);
}
