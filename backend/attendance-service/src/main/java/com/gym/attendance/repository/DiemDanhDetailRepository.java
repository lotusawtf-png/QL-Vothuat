package com.gym.attendance.repository;

import com.gym.attendance.model.DiemDanhDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiemDanhDetailRepository extends JpaRepository<DiemDanhDetail, Integer> {
    List<DiemDanhDetail> findByMalich(Integer malich);
    List<DiemDanhDetail> findByMahv(Integer mahv);
    List<DiemDanhDetail> findByNgayDiemDanh(LocalDate ngayDiemDanh);
}
