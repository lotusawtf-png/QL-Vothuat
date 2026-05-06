package com.gym.member.repository;

import com.gym.member.model.DiemDanhLop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiemDanhLopRepository extends JpaRepository<DiemDanhLop, Integer> {
    
    /**
     * Find attendance records for a specific member
     */
    List<DiemDanhLop> findByHvId(Integer hvId);
    
    /**
     * Find attendance records for a specific schedule
     */
    List<DiemDanhLop> findByLichHocId(Integer lichHocId);
    
    /**
     * Find attendance for a member in a schedule
     */
    List<DiemDanhLop> findByHvIdAndLichHocId(Integer hvId, Integer lichHocId);
    
    /**
     * Find attendance records on a specific date
     */
    List<DiemDanhLop> findByNgayHoc(LocalDate ngayHoc);
    
    /**
     * Count attended sessions for a member
     */
    long countByHvIdAndTrangThai(Integer hvId, DiemDanhLop.TrangThaiDiemDanh trangThai);
}
