package com.gym.paymentservice.controller;

import com.gym.paymentservice.dto.PaymentDTO;
import com.gym.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return new ResponseEntity<>(paymentService.getAllPayments(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Integer id) {
        return new ResponseEntity<>(paymentService.getPaymentById(id), HttpStatus.OK);
    }

    @GetMapping("/member/{hocvien_id}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByMemberId(@PathVariable Integer hocvien_id) {
        return new ResponseEntity<>(paymentService.getPaymentsByMemberId(hocvien_id), HttpStatus.OK);
    }

    @GetMapping("/status/{trangthai}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStatus(@PathVariable String trangthai) {
        return new ResponseEntity<>(paymentService.getPaymentsByStatus(trangthai), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO) {
        return new ResponseEntity<>(paymentService.createPayment(paymentDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Integer id, @RequestBody PaymentDTO paymentDTO) {
        return new ResponseEntity<>(paymentService.updatePayment(id, paymentDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<PaymentDTO> confirmPayment(@PathVariable Integer id) {
        return new ResponseEntity<>(paymentService.confirmPayment(id), HttpStatus.OK);
    }
}
