package com.gym.member.service;

import com.gym.member.dto.HocVienDTO;
import com.gym.member.model.HocVien;
import com.gym.member.repository.HocVienRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HocVienService {

    private final HocVienRepository hocVienRepository;
    private final ModelMapper modelMapper;

    public List<HocVienDTO> getAllHocVien() {
        return hocVienRepository.findAll().stream()
                .map(hv -> modelMapper.map(hv, HocVienDTO.class))
                .collect(Collectors.toList());
    }

    public HocVienDTO getHocVienById(Integer id) {
        HocVien hocVien = hocVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Học viên không tìm thấy"));
        return modelMapper.map(hocVien, HocVienDTO.class);
    }

    public HocVienDTO createHocVien(HocVienDTO dto) {
        HocVien hocVien = modelMapper.map(dto, HocVien.class);
        HocVien savedHocVien = hocVienRepository.save(hocVien);
        return modelMapper.map(savedHocVien, HocVienDTO.class);
    }

    public HocVienDTO updateHocVien(Integer id, HocVienDTO dto) {
        HocVien hocVien = hocVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Học viên không tìm thấy"));
        modelMapper.map(dto, hocVien);
        HocVien updatedHocVien = hocVienRepository.save(hocVien);
        return modelMapper.map(updatedHocVien, HocVienDTO.class);
    }

    public void deleteHocVien(Integer id) {
        hocVienRepository.deleteById(id);
    }

    public List<HocVienDTO> getHocVienByTrangthai(String trangthai) {
        HocVien.TrangThaiHocVien status = HocVien.TrangThaiHocVien.valueOf(trangthai.toUpperCase().replace(" ", "_"));
        return hocVienRepository.findByTrangthai(status).stream()
                .map(hv -> modelMapper.map(hv, HocVienDTO.class))
                .collect(Collectors.toList());
    }
}
