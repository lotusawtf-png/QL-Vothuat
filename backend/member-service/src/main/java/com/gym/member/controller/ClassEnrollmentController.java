package com.gym.member.controller;

import com.gym.member.dto.MemberClassEnrollmentDTO;
import com.gym.member.dto.EnrollmentInfoDTO;
import com.gym.member.service.ClassEnrollmentService;
import com.gym.member.model.DiemDanhLop;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ClassEnrollmentController {

    private final ClassEnrollmentService classEnrollmentService;

    /**
     * Member enrolls in a class
     * POST /members/{hvId}/enroll/{goiId}/class/{lichHocId}
     */
    @PostMapping("/{hvId}/enroll/{goiId}/class/{lichHocId}")
    public ResponseEntity<Map<String, Object>> enrollMemberInClass(
            @PathVariable Integer hvId,
            @PathVariable Integer goiId,
            @PathVariable Integer lichHocId) {
        try {
            MemberClassEnrollmentDTO enrollment = classEnrollmentService.enrollMemberInClass(hvId, goiId, lichHocId);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Đã đăng ký lớp học thành công",
                    "data", enrollment
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Check sessions remaining for member in a package
     * GET /members/{hvId}/sessions-remaining/{goiId}
     */
    @GetMapping("/{hvId}/sessions-remaining/{goiId}")
    public ResponseEntity<Map<String, Object>> getSessionsRemaining(
            @PathVariable Integer hvId,
            @PathVariable Integer goiId) {
        int sessionsRemaining = classEnrollmentService.getSessionsRemaining(hvId, goiId);
        boolean canEnroll = classEnrollmentService.canEnrollMore(hvId, goiId);
        
        return ResponseEntity.ok(Map.of(
                "hvId", hvId,
                "goiId", goiId,
                "sessionsRemaining", sessionsRemaining,
                "canEnroll", canEnroll
        ));
    }

    /**
     * Get all member enrollments
     * GET /members/{hvId}/enrollments
     */
    @GetMapping("/{hvId}/enrollments")
    public ResponseEntity<List<MemberClassEnrollmentDTO>> getMemberEnrollments(@PathVariable Integer hvId) {
        return ResponseEntity.ok(classEnrollmentService.getMemberEnrollments(hvId));
    }

    /**
     * Get active enrollments for member
     * GET /members/{hvId}/enrollments/active
     */
    @GetMapping("/{hvId}/enrollments/active")
    public ResponseEntity<List<MemberClassEnrollmentDTO>> getActiveEnrollments(@PathVariable Integer hvId) {
        return ResponseEntity.ok(classEnrollmentService.getActiveEnrollments(hvId));
    }

    /**
     * Get all members enrolled in a class
     * GET /members/class/{lichHocId}/enrollments
     */
    @GetMapping("/class/{lichHocId}/enrollments")
    public ResponseEntity<List<MemberClassEnrollmentDTO>> getClassEnrollments(@PathVariable Integer lichHocId) {
        return ResponseEntity.ok(classEnrollmentService.getClassEnrollments(lichHocId));
    }

    /**
     * Unenroll member from a class
     * DELETE /members/enrollments/{enrollmentId}
     */
    @DeleteMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<Map<String, String>> unenrollMemberFromClass(@PathVariable Integer enrollmentId) {
        String message = classEnrollmentService.unenrollMemberFromClass(enrollmentId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Mark attendance for a member
     * POST /members/{hvId}/class/{lichHocId}/attendance
     */
    @PostMapping("/{hvId}/class/{lichHocId}/attendance")
    public ResponseEntity<Map<String, Object>> markAttendance(
            @PathVariable Integer hvId,
            @PathVariable Integer lichHocId,
            @RequestBody Map<String, String> request) {
        
        LocalDate ngayHoc = LocalDate.parse(request.get("ngayHoc"));
        String trangThai = request.getOrDefault("trangThai", "có mặt");
        
        try {
            String message = classEnrollmentService.markAttendance(hvId, lichHocId, ngayHoc, trangThai);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", message
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Get attendance history for member in a class
     * GET /members/{hvId}/class/{lichHocId}/attendance
     */
    @GetMapping("/{hvId}/class/{lichHocId}/attendance")
    public ResponseEntity<List<DiemDanhLop>> getClassAttendance(
            @PathVariable Integer hvId,
            @PathVariable Integer lichHocId) {
        return ResponseEntity.ok(classEnrollmentService.getClassAttendance(hvId, lichHocId));
    }

    /**
     * Get enrollment info including session details
     * GET /members/{hvId}/class/{lichHocId}/enrollment-info
     */
    @GetMapping("/{hvId}/class/{lichHocId}/enrollment-info")
    public ResponseEntity<MemberClassEnrollmentDTO> getEnrollmentInfo(
            @PathVariable Integer hvId,
            @PathVariable Integer lichHocId) {
        return ResponseEntity.ok(classEnrollmentService.getEnrollmentInfo(hvId, lichHocId));
    }
}
