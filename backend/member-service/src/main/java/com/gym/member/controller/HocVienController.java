package com.gym.member.controller;

import com.gym.member.dto.HocVienDTO;
import com.gym.member.service.HocVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class HocVienController {

    private final HocVienService hocVienService;

    @GetMapping
    public ResponseEntity<List<HocVienDTO>> getAllMembers() {
        return ResponseEntity.ok(hocVienService.getAllHocVien());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HocVienDTO> getMemberById(@PathVariable Integer id) {
        return ResponseEntity.ok(hocVienService.getHocVienById(id));
    }

    @PostMapping
    public ResponseEntity<HocVienDTO> createMember(@RequestBody HocVienDTO dto) {
        HocVienDTO createdMember = hocVienService.createHocVien(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HocVienDTO> updateMember(@PathVariable Integer id, @RequestBody HocVienDTO dto) {
        return ResponseEntity.ok(hocVienService.updateHocVien(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Integer id) {
        hocVienService.deleteHocVien(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{trangthai}")
    public ResponseEntity<List<HocVienDTO>> getMembersByStatus(@PathVariable String trangthai) {
        return ResponseEntity.ok(hocVienService.getHocVienByTrangthai(trangthai));
    }
}
