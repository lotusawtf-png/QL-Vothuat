package com.gym.trainer.controller;

import com.gym.trainer.dto.LichHocDTO;
import com.gym.trainer.dto.ApprovalActionDTO;
import com.gym.trainer.model.LichHoc;
import com.gym.trainer.model.LichHocDangKy;
import com.gym.trainer.service.LichHocService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LichHocController {

    private final LichHocService lichHocService;

    @GetMapping
    public ResponseEntity<List<LichHocDTO>> getAllSchedules() {
        return ResponseEntity.ok(lichHocService.getAllLichHoc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichHocDTO> getScheduleById(@PathVariable Integer id) {
        return ResponseEntity.ok(lichHocService.getLichHocById(id));
    }

    @PostMapping
    public ResponseEntity<LichHocDTO> createSchedule(@RequestBody LichHocDTO dto) {
        LichHocDTO createdSchedule = lichHocService.createLichHoc(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichHocDTO> updateSchedule(@PathVariable Integer id, @RequestBody LichHocDTO dto) {
        return ResponseEntity.ok(lichHocService.updateLichHoc(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer id) {
        lichHocService.deleteLichHoc(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trainer/{mahlv}")
    public ResponseEntity<List<LichHocDTO>> getSchedulesByTrainer(@PathVariable Integer mahlv) {
        return ResponseEntity.ok(lichHocService.getLichHocByTrainer(mahlv));
    }

    @GetMapping("/date/{ngayHoc}")
    public ResponseEntity<List<LichHocDTO>> getSchedulesByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayHoc) {
        return ResponseEntity.ok(lichHocService.getLichHocByDate(ngayHoc));
    }

    // ============ APPROVAL WORKFLOW ENDPOINTS ============

    /**
     * Trainer registers for a schedule
     * POST /schedules/{lichHocId}/register/{hlvId}
     */
    @PostMapping("/{lichHocId}/register/{hlvId}")
    public ResponseEntity<Map<String, String>> registerTrainerForSchedule(
            @PathVariable Integer lichHocId,
            @PathVariable Integer hlvId) {
        String message = lichHocService.registerTrainerForSchedule(lichHocId, hlvId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", message));
    }

    /**
     * Get pending registrations (for manager/admin)
     * GET /schedules/pending/registrations
     */
    @GetMapping("/pending/registrations")
    public ResponseEntity<List<LichHocDangKy>> getPendingRegistrations() {
        return ResponseEntity.ok(lichHocService.getPendingRegistrations());
    }

    /**
     * Get pending registrations for a specific schedule
     * GET /schedules/{lichHocId}/pending/registrations
     */
    @GetMapping("/{lichHocId}/pending/registrations")
    public ResponseEntity<List<LichHocDangKy>> getPendingRegistrationsForSchedule(@PathVariable Integer lichHocId) {
        return ResponseEntity.ok(lichHocService.getPendingRegistrationsForSchedule(lichHocId));
    }

    /**
     * Get trainer's registrations
     * GET /schedules/trainer/{hlvId}/registrations
     */
    @GetMapping("/trainer/{hlvId}/registrations")
    public ResponseEntity<List<LichHocDangKy>> getTrainerRegistrations(@PathVariable Integer hlvId) {
        return ResponseEntity.ok(lichHocService.getTrainerRegistrations(hlvId));
    }

    /**
     * Approve registration (for manager/admin)
     * POST /schedules/registrations/{registrationId}/approve
     */
    @PostMapping("/registrations/{registrationId}/approve")
    public ResponseEntity<Map<String, String>> approveRegistration(@PathVariable Integer registrationId) {
        String message = lichHocService.approveScheduleRegistration(registrationId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Reject registration (for manager/admin)
     * POST /schedules/registrations/{registrationId}/reject
     */
    @PostMapping("/registrations/{registrationId}/reject")
    public ResponseEntity<Map<String, String>> rejectRegistration(
            @PathVariable Integer registrationId,
            @RequestBody Map<String, String> request) {
        String lyDoTuChoi = request.getOrDefault("lyDoTuChoi", "");
        String message = lichHocService.rejectScheduleRegistration(registrationId, lyDoTuChoi);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Approve schedule (for manager/admin)
     * POST /schedules/{lichHocId}/approve
     */
    @PostMapping("/{lichHocId}/approve")
    public ResponseEntity<Map<String, String>> approveSchedule(@PathVariable Integer lichHocId) {
        String message = lichHocService.approveSchedule(lichHocId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Reject schedule (for manager/admin)
     * POST /schedules/{lichHocId}/reject
     */
    @PostMapping("/{lichHocId}/reject")
    public ResponseEntity<Map<String, String>> rejectSchedule(
            @PathVariable Integer lichHocId,
            @RequestBody Map<String, String> request) {
        String lyDoTuChoi = request.getOrDefault("lyDoTuChoi", "");
        String message = lichHocService.rejectSchedule(lichHocId, lyDoTuChoi);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Get pending schedules (for manager/admin approval)
     * GET /schedules/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<LichHoc>> getPendingSchedules() {
        return ResponseEntity.ok(lichHocService.getPendingSchedules());
    }
}
