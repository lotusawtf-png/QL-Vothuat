package com.gym.attendance.service;

import com.gym.attendance.dto.PaymentDTO;
import com.gym.attendance.model.Payment;
import com.gym.attendance.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thanh toán không tìm thấy"));
        return modelMapper.map(payment, PaymentDTO.class);
    }

    public PaymentDTO createPayment(PaymentDTO dto) {
        Payment payment = modelMapper.map(dto, Payment.class);
        Payment savedPayment = paymentRepository.save(payment);
        return modelMapper.map(savedPayment, PaymentDTO.class);
    }

    public PaymentDTO updatePayment(Integer id, PaymentDTO dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thanh toán không tìm thấy"));
        modelMapper.map(dto, payment);
        Payment updatedPayment = paymentRepository.save(payment);
        return modelMapper.map(updatedPayment, PaymentDTO.class);
    }

    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }

    public List<PaymentDTO> getPaymentsByMahv(Integer mahv) {
        return paymentRepository.findByMahv(mahv).stream()
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .collect(Collectors.toList());
    }
}
