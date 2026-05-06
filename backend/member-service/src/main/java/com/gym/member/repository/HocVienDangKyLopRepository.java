package com.gym.member.repository;

import com.gym.member.model.HocVienDangKyLop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HocVienDangKyLopRepository extends JpaRepository<HocVienDangKyLop, Integer> {
    
    /**
     * Find all enrollments for a specific member
     */
    List<HocVienDangKyLop> findByHvId(Integer hvId);
    
    /**
     * Find enrollments for a specific member and package
     */
    List<HocVienDangKyLop> findByHvIdAndGoiId(Integer hvId, Integer goiId);
    
    /**
     * Find enrollment by member and schedule
     */
    Optional<HocVienDangKyLop> findByHvIdAndLichHocId(Integer hvId, Integer lichHocId);
    
    /**
     * Find all enrollments for a specific schedule
     */
    List<HocVienDangKyLop> findByLichHocId(Integer lichHocId);
    
    /**
     * Find active enrollments for a member
     */
    List<HocVienDangKyLop> findByHvIdAndTrangThai(Integer hvId, HocVienDangKyLop.TrangThaiDangKyLop trangThai);
}
