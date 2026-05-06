package com.gym.attendance.service;

import com.gym.attendance.dto.DangKyLichDTO;
import com.gym.attendance.model.DangKyLich;
import com.gym.attendance.repository.DangKyLichRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DangKyLichService {

    private final DangKyLichRepository dangKyLichRepository;
    private final ModelMapper modelMapper;

    public List<DangKyLichDTO> getAllDangKyLich() {
        return dangKyLichRepository.findAll().stream()
                .map(dkl -> modelMapper.map(dkl, DangKyLichDTO.class))
                .collect(Collectors.toList());
    }

    public DangKyLichDTO getDangKyLichById(Integer id) {
        DangKyLich dangKyLich = dangKyLichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đăng ký lịch không tìm thấy"));
        return modelMapper.map(dangKyLich, DangKyLichDTO.class);
    }

    public DangKyLichDTO createDangKyLich(DangKyLichDTO dto) {
        DangKyLich dangKyLich = modelMapper.map(dto, DangKyLich.class);
        DangKyLich savedDangKyLich = dangKyLichRepository.save(dangKyLich);
        return modelMapper.map(savedDangKyLich, DangKyLichDTO.class);
    }

    public DangKyLichDTO updateDangKyLich(Integer id, DangKyLichDTO dto) {
        DangKyLich dangKyLich = dangKyLichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đăng ký lịch không tìm thấy"));
        modelMapper.map(dto, dangKyLich);
        DangKyLich updatedDangKyLich = dangKyLichRepository.save(dangKyLich);
        return modelMapper.map(updatedDangKyLich, DangKyLichDTO.class);
    }

    public void deleteDangKyLich(Integer id) {
        dangKyLichRepository.deleteById(id);
    }

    public List<DangKyLichDTO> getDangKyLichByMahv(Integer mahv) {
        return dangKyLichRepository.findByMahv(mahv).stream()
                .map(dkl -> modelMapper.map(dkl, DangKyLichDTO.class))
                .collect(Collectors.toList());
    }
}
