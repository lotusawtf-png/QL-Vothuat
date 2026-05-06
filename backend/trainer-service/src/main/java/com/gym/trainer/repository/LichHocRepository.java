package com.gym.trainer.repository;

import com.gym.trainer.model.LichHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LichHocRepository extends JpaRepository<LichHoc, Integer> {
    List<LichHoc> findByMahlv(Integer mahlv);
    List<LichHoc> findByNgayHoc(LocalDate ngayHoc);
    List<LichHoc> findByTrangthai(LichHoc.TrangThaiLich trangthai);
}
