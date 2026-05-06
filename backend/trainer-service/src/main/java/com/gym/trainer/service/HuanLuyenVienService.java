package com.gym.trainer.service;

import com.gym.trainer.dto.HuanLuyenVienDTO;
import com.gym.trainer.model.HuanLuyenVien;
import com.gym.trainer.repository.HuanLuyenVienRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HuanLuyenVienService {

    private final HuanLuyenVienRepository huanLuyenVienRepository;
    private final ModelMapper modelMapper;

    public List<HuanLuyenVienDTO> getAllTrainers() {
        return huanLuyenVienRepository.findAll().stream()
                .map(hlv -> modelMapper.map(hlv, HuanLuyenVienDTO.class))
                .collect(Collectors.toList());
    }

    public HuanLuyenVienDTO getTrainerById(Integer id) {
        HuanLuyenVien huanLuyenVien = huanLuyenVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Huấn luyện viên không tìm thấy"));
        return modelMapper.map(huanLuyenVien, HuanLuyenVienDTO.class);
    }

    public HuanLuyenVienDTO createTrainer(HuanLuyenVienDTO dto) {
        HuanLuyenVien huanLuyenVien = modelMapper.map(dto, HuanLuyenVien.class);
        HuanLuyenVien savedTrainer = huanLuyenVienRepository.save(huanLuyenVien);
        return modelMapper.map(savedTrainer, HuanLuyenVienDTO.class);
    }

    public HuanLuyenVienDTO updateTrainer(Integer id, HuanLuyenVienDTO dto) {
        HuanLuyenVien huanLuyenVien = huanLuyenVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Huấn luyện viên không tìm thấy"));
        modelMapper.map(dto, huanLuyenVien);
        HuanLuyenVien updatedTrainer = huanLuyenVienRepository.save(huanLuyenVien);
        return modelMapper.map(updatedTrainer, HuanLuyenVienDTO.class);
    }

    public void deleteTrainer(Integer id) {
        huanLuyenVienRepository.deleteById(id);
    }

    public List<HuanLuyenVienDTO> getTrainersBySpecialty(String chuyenmon) {
        return huanLuyenVienRepository.findByChuyenmon(chuyenmon).stream()
                .map(hlv -> modelMapper.map(hlv, HuanLuyenVienDTO.class))
                .collect(Collectors.toList());
    }
}
