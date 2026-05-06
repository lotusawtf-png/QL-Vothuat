package com.gym.member.service;

import com.gym.member.dto.MemberClassEnrollmentDTO;
import com.gym.member.model.HocVienDangKyLop;
import com.gym.member.model.GoiTap;
import com.gym.member.model.DiemDanhLop;
import com.gym.member.repository.HocVienDangKyLopRepository;
import com.gym.member.repository.DiemDanhLopRepository;
import com.gym.member.repository.GoiTapRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassEnrollmentService {

    private final HocVienDangKyLopRepository hocVienDangKyLopRepository;
    private final DiemDanhLopRepository diemDanhLopRepository;
    private final GoiTapRepository goiTapRepository;
    private final ModelMapper modelMapper;

    /**
     * Member enrolls in a class
     * Checks if member has sessions remaining from their package
     */
    public MemberClassEnrollmentDTO enrollMemberInClass(Integer hvId, Integer goiId, Integer lichHocId) {
        // Check if already enrolled
        if (hocVienDangKyLopRepository.findByHvIdAndLichHocId(hvId, lichHocId).isPresent()) {
            throw new RuntimeException("Học viên đã đăng ký lớp này rồi");
        }

        // Get package info to check session limit
        GoiTap goiTap = goiTapRepository.findById(goiId)
                .orElseThrow(() -> new RuntimeException("Gói tập không tìm thấy"));

        // Get current session usage for this member and package
        int sessionsUsed = 0;
        int sessionsRemaining = goiTap.getBuoi();

        // Check if member already has enrollments in this package
        List<HocVienDangKyLop> existingEnrollments = hocVienDangKyLopRepository.findByHvIdAndGoiId(hvId, goiId);
        if (!existingEnrollments.isEmpty()) {
            // Calculate total sessions used across all classes in this package
            sessionsUsed = existingEnrollments.stream()
                    .mapToInt(HocVienDangKyLop::getSoBuoiDaSuDung)
                    .sum();
            
            // Count attended sessions
            long attendedSessions = diemDanhLopRepository.countByHvIdAndTrangThai(
                    hvId, 
                    DiemDanhLop.TrangThaiDiemDanh.CO_MAT
            );
            
            sessionsRemaining = goiTap.getBuoi() - (int) attendedSessions;
        }

        if (sessionsRemaining <= 0) {
            throw new RuntimeException("Hết số buổi cho phép trong gói tập này");
        }

        // Create enrollment record
        HocVienDangKyLop enrollment = HocVienDangKyLop.builder()
                .hvId(hvId)
                .goiId(goiId)
                .lichHocId(lichHocId)
                .soBuoiDaSuDung(0)
                .soBuoiConLai(sessionsRemaining)
                .trangThai(HocVienDangKyLop.TrangThaiDangKyLop.DANG_HOC)
                .build();

        HocVienDangKyLop savedEnrollment = hocVienDangKyLopRepository.save(enrollment);
        return modelMapper.map(savedEnrollment, MemberClassEnrollmentDTO.class);
    }

    /**
     * Get remaining sessions for member in a package
     */
    public int getSessionsRemaining(Integer hvId, Integer goiId) {
        GoiTap goiTap = goiTapRepository.findById(goiId)
                .orElseThrow(() -> new RuntimeException("Gói tập không tìm thấy"));

        // Count attended sessions across all classes in this package
        long attendedSessions = diemDanhLopRepository.countByHvIdAndTrangThai(
                hvId,
                DiemDanhLop.TrangThaiDiemDanh.CO_MAT
        );

        int sessionsRemaining = goiTap.getBuoi() - (int) attendedSessions;
        return Math.max(0, sessionsRemaining);
    }

    /**
     * Get all enrollments for a member
     */
    public List<MemberClassEnrollmentDTO> getMemberEnrollments(Integer hvId) {
        return hocVienDangKyLopRepository.findByHvId(hvId).stream()
                .map(enrollment -> modelMapper.map(enrollment, MemberClassEnrollmentDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Get active enrollments for a member (đang học)
     */
    public List<MemberClassEnrollmentDTO> getActiveEnrollments(Integer hvId) {
        return hocVienDangKyLopRepository
                .findByHvIdAndTrangThai(hvId, HocVienDangKyLop.TrangThaiDangKyLop.DANG_HOC).stream()
                .map(enrollment -> modelMapper.map(enrollment, MemberClassEnrollmentDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Get all members enrolled in a specific class
     */
    public List<MemberClassEnrollmentDTO> getClassEnrollments(Integer lichHocId) {
        return hocVienDangKyLopRepository.findByLichHocId(lichHocId).stream()
                .map(enrollment -> modelMapper.map(enrollment, MemberClassEnrollmentDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Unenroll member from a class
     */
    public String unenrollMemberFromClass(Integer enrollmentId) {
        HocVienDangKyLop enrollment = hocVienDangKyLopRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Đơn đăng ký không tìm thấy"));

        enrollment.setTrangThai(HocVienDangKyLop.TrangThaiDangKyLop.KET_THUC);
        hocVienDangKyLopRepository.save(enrollment);

        return "Đã hủy đăng ký lớp học";
    }

    /**
     * Mark attendance for a member in a class
     */
    public String markAttendance(Integer hvId, Integer lichHocId, LocalDate ngayHoc, String trangThai) {
        // Verify enrollment exists
        HocVienDangKyLop enrollment = hocVienDangKyLopRepository.findByHvIdAndLichHocId(hvId, lichHocId)
                .orElseThrow(() -> new RuntimeException("Học viên không đang học lớp này"));

        // Create or update attendance record
        DiemDanhLop diemDanh = DiemDanhLop.builder()
                .hvId(hvId)
                .lichHocId(lichHocId)
                .ngayHoc(ngayHoc)
                .trangThai(DiemDanhLop.TrangThaiDiemDanh.valueOf(trangThai.toUpperCase().replace(" ", "_")))
                .build();

        diemDanhLopRepository.save(diemDanh);

        // Update session usage if attended
        if (trangThai.equals("có mặt")) {
            enrollment.setSoBuoiDaSuDung(enrollment.getSoBuoiDaSuDung() + 1);
            hocVienDangKyLopRepository.save(enrollment);
        }

        return "Đã cập nhật điểm danh";
    }

    /**
     * Get attendance history for a member in a class
     */
    public List<DiemDanhLop> getClassAttendance(Integer hvId, Integer lichHocId) {
        return diemDanhLopRepository.findByHvIdAndLichHocId(hvId, lichHocId);
    }

    /**
     * Check if member can enroll in more classes
     */
    public boolean canEnrollMore(Integer hvId, Integer goiId) {
        int sessionsRemaining = getSessionsRemaining(hvId, goiId);
        return sessionsRemaining > 0;
    }

    /**
     * Get enrollment info for a member and class
     */
    public MemberClassEnrollmentDTO getEnrollmentInfo(Integer hvId, Integer lichHocId) {
        HocVienDangKyLop enrollment = hocVienDangKyLopRepository.findByHvIdAndLichHocId(hvId, lichHocId)
                .orElseThrow(() -> new RuntimeException("Không có đơn đăng ký cho lớp này"));

        return modelMapper.map(enrollment, MemberClassEnrollmentDTO.class);
    }
}
