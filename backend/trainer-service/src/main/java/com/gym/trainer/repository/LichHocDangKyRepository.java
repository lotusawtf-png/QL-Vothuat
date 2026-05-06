package com.gym.trainer.repository;

import com.gym.trainer.model.LichHocDangKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LichHocDangKyRepository extends JpaRepository<LichHocDangKy, Integer> {
    
    /**
     * Find all registrations for a specific schedule
     */
    List<LichHocDangKy> findByLichHocId(Integer lichHocId);
    
    /**
     * Find all registrations for a specific trainer
     */
    List<LichHocDangKy> findByHlvId(Integer hlvId);
    
    /**
     * Find registration by schedule and trainer
     */
    Optional<LichHocDangKy> findByLichHocIdAndHlvId(Integer lichHocId, Integer hlvId);
    
    /**
     * Find pending registrations
     */
    List<LichHocDangKy> findByTrangThai(LichHocDangKy.TrangThaiDangKy trangThai);
    
    /**
     * Find pending registrations for a specific schedule
     */
    List<LichHocDangKy> findByLichHocIdAndTrangThai(Integer lichHocId, LichHocDangKy.TrangThaiDangKy trangThai);
}
