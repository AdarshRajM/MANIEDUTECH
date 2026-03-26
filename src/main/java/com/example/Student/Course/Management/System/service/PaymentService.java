package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Payment;
import com.example.Student.Course.Management.System.repository.PaymentRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    @CacheEvict(value = {"payments", "student_payments"}, allEntries = true)
    public Payment processPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        // For simulation, assume all processed payments are SUCCESS unless explicitly marked FAILED
        if(payment.getStatus() == null || payment.getStatus().isBlank()) {
           payment.setStatus("SUCCESS");
        }
        return repository.save(payment);
    }

    @Cacheable(value = "payments")
    public List<Payment> getAllPayments() {
        return repository.findAll();
    }

    @Cacheable(value = "payments", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Payment> getPaymentsPaged(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "student_payments", key = "#studentId")
    public List<Payment> getPaymentsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }
}
