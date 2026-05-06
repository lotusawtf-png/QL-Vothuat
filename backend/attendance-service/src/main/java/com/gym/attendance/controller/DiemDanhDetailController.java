package com.gym.attendance.controller;

import com.gym.attendance.dto.DiemDanhDetailDTO;
import com.gym.attendance.service.DiemDanhDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DiemDanhDetailController {

    private final DiemDanhDetailService diemDanhDetailService;

    @GetMapping
    public ResponseEntity<List<DiemDanhDetailDTO>> getAllAttendance() {
        return ResponseEntity.ok(diemDanhDetailService.getAllDiemDanh());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiemDanhDetailDTO> getAttendanceById(@PathVariable Integer id) {
        return ResponseEntity.ok(diemDanhDetailService.getDiemDanhById(id));
    }

    @PostMapping
    public ResponseEntity<DiemDanhDetailDTO> createAttendance(@RequestBody DiemDanhDetailDTO dto) {
        DiemDanhDetailDTO createdAttendance = diemDanhDetailService.createDiemDanh(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAttendance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiemDanhDetailDTO> updateAttendance(@PathVariable Integer id, @RequestBody DiemDanhDetailDTO dto) {
        return ResponseEntity.ok(diemDanhDetailService.updateDiemDanh(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Integer id) {
        diemDanhDetailService.deleteDiemDanh(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/member/{mahv}")
    public ResponseEntity<List<DiemDanhDetailDTO>> getAttendanceByMember(@PathVariable Integer mahv) {
        return ResponseEntity.ok(diemDanhDetailService.getDiemDanhByMahv(mahv));
    }

    @GetMapping("/date/{ngayDiemDanh}")
    public ResponseEntity<List<DiemDanhDetailDTO>> getAttendanceByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayDiemDanh) {
        return ResponseEntity.ok(diemDanhDetailService.getDiemDanhByDate(ngayDiemDanh));
    }
}
