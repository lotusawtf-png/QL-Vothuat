package com.gym.member.repository;

import com.gym.member.model.HocVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HocVienRepository extends JpaRepository<HocVien, Integer> {
    Optional<HocVien> findByEmail(String email);
    List<HocVien> findByTrangthai(HocVien.TrangThaiHocVien trangthai);
    List<HocVien> findByMagoi(Integer magoi);
}
