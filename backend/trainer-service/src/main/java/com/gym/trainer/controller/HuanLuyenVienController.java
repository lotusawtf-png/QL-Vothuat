package com.gym.trainer.controller;

import com.gym.trainer.dto.HuanLuyenVienDTO;
import com.gym.trainer.service.HuanLuyenVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class HuanLuyenVienController {

    private final HuanLuyenVienService huanLuyenVienService;

    @GetMapping
    public ResponseEntity<List<HuanLuyenVienDTO>> getAllTrainers() {
        return ResponseEntity.ok(huanLuyenVienService.getAllTrainers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HuanLuyenVienDTO> getTrainerById(@PathVariable Integer id) {
        return ResponseEntity.ok(huanLuyenVienService.getTrainerById(id));
    }

    @PostMapping
    public ResponseEntity<HuanLuyenVienDTO> createTrainer(@RequestBody HuanLuyenVienDTO dto) {
        HuanLuyenVienDTO createdTrainer = huanLuyenVienService.createTrainer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrainer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HuanLuyenVienDTO> updateTrainer(@PathVariable Integer id, @RequestBody HuanLuyenVienDTO dto) {
        return ResponseEntity.ok(huanLuyenVienService.updateTrainer(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable Integer id) {
        huanLuyenVienService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/specialty/{chuyenmon}")
    public ResponseEntity<List<HuanLuyenVienDTO>> getTrainersBySpecialty(@PathVariable String chuyenmon) {
        return ResponseEntity.ok(huanLuyenVienService.getTrainersBySpecialty(chuyenmon));
    }
}
