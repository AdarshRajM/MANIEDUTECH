package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Payment;
import com.example.Student.Course.Management.System.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('PRINCIPAL')")
    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(service.processPayment(payment));
    }

    @PreAuthorize("hasRole('PRINCIPAL') or hasRole('FACULTY')")
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(service.getAllPayments());
    }

    @PreAuthorize("hasRole('PRINCIPAL')")
    @GetMapping("/paged")
    public ResponseEntity<Page<Payment>> getPaymentsPaged(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getPaymentsPaged(pageable));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getPaymentsByStudent(studentId));
    }
}
