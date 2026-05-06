package com.gym.attendance.service;

import com.gym.attendance.dto.DiemDanhDetailDTO;
import com.gym.attendance.model.DiemDanhDetail;
import com.gym.attendance.repository.DiemDanhDetailRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiemDanhDetailService {

    private final DiemDanhDetailRepository diemDanhDetailRepository;
    private final ModelMapper modelMapper;

    public List<DiemDanhDetailDTO> getAllDiemDanh() {
        return diemDanhDetailRepository.findAll().stream()
                .map(d -> modelMapper.map(d, DiemDanhDetailDTO.class))
                .collect(Collectors.toList());
    }

    public DiemDanhDetailDTO getDiemDanhById(Integer id) {
        DiemDanhDetail diemDanh = diemDanhDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Điểm danh không tìm thấy"));
        return modelMapper.map(diemDanh, DiemDanhDetailDTO.class);
    }

    public DiemDanhDetailDTO createDiemDanh(DiemDanhDetailDTO dto) {
        DiemDanhDetail diemDanh = modelMapper.map(dto, DiemDanhDetail.class);
        DiemDanhDetail savedDiemDanh = diemDanhDetailRepository.save(diemDanh);
        return modelMapper.map(savedDiemDanh, DiemDanhDetailDTO.class);
    }

    public DiemDanhDetailDTO updateDiemDanh(Integer id, DiemDanhDetailDTO dto) {
        DiemDanhDetail diemDanh = diemDanhDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Điểm danh không tìm thấy"));
        modelMapper.map(dto, diemDanh);
        DiemDanhDetail updatedDiemDanh = diemDanhDetailRepository.save(diemDanh);
        return modelMapper.map(updatedDiemDanh, DiemDanhDetailDTO.class);
    }

    public void deleteDiemDanh(Integer id) {
        diemDanhDetailRepository.deleteById(id);
    }

    public List<DiemDanhDetailDTO> getDiemDanhByMahv(Integer mahv) {
        return diemDanhDetailRepository.findByMahv(mahv).stream()
                .map(d -> modelMapper.map(d, DiemDanhDetailDTO.class))
                .collect(Collectors.toList());
    }

    public List<DiemDanhDetailDTO> getDiemDanhByDate(LocalDate ngayDiemDanh) {
        return diemDanhDetailRepository.findByNgayDiemDanh(ngayDiemDanh).stream()
                .map(d -> modelMapper.map(d, DiemDanhDetailDTO.class))
                .collect(Collectors.toList());
    }
}
