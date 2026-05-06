package com.gym.trainer.service;

import com.gym.trainer.dto.LichHocDTO;
import com.gym.trainer.model.LichHoc;
import com.gym.trainer.model.LichHocDangKy;
import com.gym.trainer.repository.LichHocRepository;
import com.gym.trainer.repository.LichHocDangKyRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LichHocService {

    private final LichHocRepository lichHocRepository;
    private final LichHocDangKyRepository lichHocDangKyRepository;
    private final ModelMapper modelMapper;

    public List<LichHocDTO> getAllLichHoc() {
        return lichHocRepository.findAll().stream()
                .map(lh -> modelMapper.map(lh, LichHocDTO.class))
                .collect(Collectors.toList());
    }

    public LichHocDTO getLichHocById(Integer id) {
        LichHoc lichHoc = lichHocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch học không tìm thấy"));
        return modelMapper.map(lichHoc, LichHocDTO.class);
    }

    public LichHocDTO createLichHoc(LichHocDTO dto) {
        LichHoc lichHoc = modelMapper.map(dto, LichHoc.class);
        LichHoc savedLichHoc = lichHocRepository.save(lichHoc);
        return modelMapper.map(savedLichHoc, LichHocDTO.class);
    }

    public LichHocDTO updateLichHoc(Integer id, LichHocDTO dto) {
        LichHoc lichHoc = lichHocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch học không tìm thấy"));
        modelMapper.map(dto, lichHoc);
        LichHoc updatedLichHoc = lichHocRepository.save(lichHoc);
        return modelMapper.map(updatedLichHoc, LichHocDTO.class);
    }

    public void deleteLichHoc(Integer id) {
        lichHocRepository.deleteById(id);
    }

    public List<LichHocDTO> getLichHocByTrainer(Integer mahlv) {
        return lichHocRepository.findByMahlv(mahlv).stream()
                .map(lh -> modelMapper.map(lh, LichHocDTO.class))
                .collect(Collectors.toList());
    }

    public List<LichHocDTO> getLichHocByDate(LocalDate ngayHoc) {
        return lichHocRepository.findByNgayHoc(ngayHoc).stream()
                .map(lh -> modelMapper.map(lh, LichHocDTO.class))
                .collect(Collectors.toList());
    }

    // ============ APPROVAL WORKFLOW METHODS ============

    /**
     * Trainer registers for a schedule
     */
    public String registerTrainerForSchedule(Integer lichHocId, Integer hlvId) {
        LichHoc lichHoc = lichHocRepository.findById(lichHocId)
                .orElseThrow(() -> new RuntimeException("Lịch học không tìm thấy"));

        // Check if already registered
        if (lichHocDangKyRepository.findByLichHocIdAndHlvId(lichHocId, hlvId).isPresent()) {
            throw new RuntimeException("HLV đã đăng ký lịch này rồi");
        }

        // Create registration record
        LichHocDangKy dangKy = LichHocDangKy.builder()
                .lichHocId(lichHocId)
                .hlvId(hlvId)
                .trangThai(LichHocDangKy.TrangThaiDangKy.CHO_DUYET)
                .build();

        lichHocDangKyRepository.save(dangKy);
        return "Đã gửi đơn đăng ký lịch dạy. Chờ manager/admin duyệt.";
    }

    /**
     * Get pending registrations (for manager/admin approval)
     */
    public List<LichHocDangKy> getPendingRegistrations() {
        return lichHocDangKyRepository.findByTrangThai(LichHocDangKy.TrangThaiDangKy.CHO_DUYET);
    }

    /**
     * Get pending registrations for a specific schedule
     */
    public List<LichHocDangKy> getPendingRegistrationsForSchedule(Integer lichHocId) {
        return lichHocDangKyRepository.findByLichHocIdAndTrangThai(
                lichHocId, 
                LichHocDangKy.TrangThaiDangKy.CHO_DUYET
        );
    }

    /**
     * Get trainer's registered schedules by status
     */
    public List<LichHocDangKy> getTrainerRegistrations(Integer hlvId) {
        return lichHocDangKyRepository.findByHlvId(hlvId);
    }

    /**
     * Approve schedule registration
     */
    public String approveScheduleRegistration(Integer registrationId) {
        LichHocDangKy dangKy = lichHocDangKyRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Đơn đăng ký không tìm thấy"));

        if (!dangKy.getTrangThai().equals(LichHocDangKy.TrangThaiDangKy.CHO_DUYET)) {
            throw new RuntimeException("Đơn đăng ký không ở trạng thái chờ duyệt");
        }

        dangKy.setTrangThai(LichHocDangKy.TrangThaiDangKy.DA_DUYET);
        lichHocDangKyRepository.save(dangKy);

        // Update schedule approval status if all registrations for this schedule are approved
        checkAndUpdateScheduleApproval(dangKy.getLichHocId());

        return "Đã phê duyệt lịch dạy cho HLV";
    }

    /**
     * Reject schedule registration
     */
    public String rejectScheduleRegistration(Integer registrationId, String lyDoTuChoi) {
        LichHocDangKy dangKy = lichHocDangKyRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Đơn đăng ký không tìm thấy"));

        if (!dangKy.getTrangThai().equals(LichHocDangKy.TrangThaiDangKy.CHO_DUYET)) {
            throw new RuntimeException("Đơn đăng ký không ở trạng thái chờ duyệt");
        }

        dangKy.setTrangThai(LichHocDangKy.TrangThaiDangKy.TU_CHOI);
        dangKy.setLyDoTuChoi(lyDoTuChoi);
        lichHocDangKyRepository.save(dangKy);

        return "Đã từ chối đơn đăng ký lịch dạy";
    }

    /**
     * Approve schedule by manager/admin
     */
    public String approveSchedule(Integer lichHocId) {
        LichHoc lichHoc = lichHocRepository.findById(lichHocId)
                .orElseThrow(() -> new RuntimeException("Lịch học không tìm thấy"));

        if (!lichHoc.getTrangThaiDuyet().equals(LichHoc.TrangThaiDuyet.CHO_DUYET)) {
            throw new RuntimeException("Lịch học không ở trạng thái chờ duyệt");
        }

        lichHoc.setTrangThaiDuyet(LichHoc.TrangThaiDuyet.DA_DUYET);
        lichHoc.setLyDoTuChoi(null);
        lichHocRepository.save(lichHoc);

        return "Đã phê duyệt lịch học";
    }

    /**
     * Reject schedule by manager/admin
     */
    public String rejectSchedule(Integer lichHocId, String lyDoTuChoi) {
        LichHoc lichHoc = lichHocRepository.findById(lichHocId)
                .orElseThrow(() -> new RuntimeException("Lịch học không tìm thấy"));

        if (!lichHoc.getTrangThaiDuyet().equals(LichHoc.TrangThaiDuyet.CHO_DUYET)) {
            throw new RuntimeException("Lịch học không ở trạng thái chờ duyệt");
        }

        lichHoc.setTrangThaiDuyet(LichHoc.TrangThaiDuyet.TU_CHOI);
        lichHoc.setLyDoTuChoi(lyDoTuChoi);
        lichHocRepository.save(lichHoc);

        return "Đã từ chối phê duyệt lịch học";
    }

    /**
     * Get pending schedules (for manager/admin approval)
     */
    public List<LichHoc> getPendingSchedules() {
        return lichHocRepository.findAll().stream()
                .filter(lh -> lh.getTrangThaiDuyet().equals(LichHoc.TrangThaiDuyet.CHO_DUYET))
                .collect(Collectors.toList());
    }

    /**
     * Check and update schedule approval status
     */
    private void checkAndUpdateScheduleApproval(Integer lichHocId) {
        List<LichHocDangKy> pendingRegistrations = getPendingRegistrationsForSchedule(lichHocId);
        
        // If no more pending registrations, auto-approve the schedule
        if (pendingRegistrations.isEmpty()) {
            LichHoc lichHoc = lichHocRepository.findById(lichHocId).orElse(null);
            if (lichHoc != null && lichHoc.getTrangThaiDuyet().equals(LichHoc.TrangThaiDuyet.CHO_DUYET)) {
                lichHoc.setTrangThaiDuyet(LichHoc.TrangThaiDuyet.DA_DUYET);
                lichHocRepository.save(lichHoc);
            }
        }
    }
}
