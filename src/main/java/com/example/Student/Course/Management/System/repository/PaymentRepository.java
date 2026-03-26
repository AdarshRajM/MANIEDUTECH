package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    Page<Payment> findByStudentId(Long studentId, Pageable pageable);
    List<Payment> findByStatus(String status);
}
