package com.gym.attendance.controller;

import com.gym.attendance.dto.DangKyLichDTO;
import com.gym.attendance.service.DangKyLichService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DangKyLichController {

    private final DangKyLichService dangKyLichService;

    @GetMapping
    public ResponseEntity<List<DangKyLichDTO>> getAllRegistrations() {
        return ResponseEntity.ok(dangKyLichService.getAllDangKyLich());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DangKyLichDTO> getRegistrationById(@PathVariable Integer id) {
        return ResponseEntity.ok(dangKyLichService.getDangKyLichById(id));
    }

    @PostMapping
    public ResponseEntity<DangKyLichDTO> createRegistration(@RequestBody DangKyLichDTO dto) {
        DangKyLichDTO createdRegistration = dangKyLichService.createDangKyLich(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRegistration);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DangKyLichDTO> updateRegistration(@PathVariable Integer id, @RequestBody DangKyLichDTO dto) {
        return ResponseEntity.ok(dangKyLichService.updateDangKyLich(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Integer id) {
        dangKyLichService.deleteDangKyLich(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/member/{mahv}")
    public ResponseEntity<List<DangKyLichDTO>> getRegistrationsByMember(@PathVariable Integer mahv) {
        return ResponseEntity.ok(dangKyLichService.getDangKyLichByMahv(mahv));
    }
}
