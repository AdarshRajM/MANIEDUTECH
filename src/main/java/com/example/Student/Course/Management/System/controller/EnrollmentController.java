package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Enrollment;
import com.example.Student.Course.Management.System.entity.Student;
import com.example.Student.Course.Management.System.repository.EnrollmentRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import com.example.Student.Course.Management.System.service.EnrollmentService;
import com.example.Student.Course.Management.System.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    public EnrollmentController(EnrollmentService enrollmentService,
                                EnrollmentRepository enrollmentRepository,
                                StudentRepository studentRepository) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping
    public ResponseEntity<ApiResponse<Enrollment>> enroll(@RequestParam Long studentId,
                                                          @RequestParam Long courseId) {
        Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(new ApiResponse<>("Student enrolled successfully", enrollment, true));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(@RequestParam String registrationNumber) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(enrollmentRepository.findByStudent(student));
    }
}
