package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.dto.StudentDTO;
import com.example.Student.Course.Management.System.service.ActivityService;
import com.example.Student.Course.Management.System.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final ActivityService activityService;

    public StudentController(StudentService studentService, ActivityService activityService) {
        this.studentService = studentService;
        this.activityService = activityService;
    }

    // ✅ POST API (Accept JSON)
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping
    public StudentDTO saveStudent(@RequestBody StudentDTO dto) {
        StudentDTO saved = studentService.saveStudent(dto.getName(), dto.getRegistrationNumber(), dto.getSection(), dto.getRollNumber(), dto.getCourseId());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            String username = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
            activityService.logActivity(username, "ADD_STUDENT", "Added student: " + dto.getName());
        }
        return saved;
    }

    // ✅ GET API
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents();
    }

    // GET STUDENTS WITH PAGINATION
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/paged")
    public Page<StudentDTO> getStudents(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentService.getStudents(pageable);
    }

    // SEARCH STUDENTS
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/search")
    public Page<StudentDTO> searchStudents(@RequestParam String query,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentService.searchStudents(query, pageable);
    }

    // GET STUDENT BY REGISTRATION NUMBER
    @GetMapping("/registration/{registrationNumber}")
    public Optional<StudentDTO> getStudentByRegistrationNumber(@PathVariable String registrationNumber) {
        return studentService.getStudentByRegistrationNumber(registrationNumber);
    }

    // UPDATE STUDENT
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PutMapping("/{id}")
    public StudentDTO updateStudent(@PathVariable Long id, @RequestBody StudentDTO dto) {
        return studentService.updateStudent(id, dto.getName(), dto.getRegistrationNumber(), dto.getSection(), dto.getRollNumber(), dto.getCourseId());
    }
}








//import com.example.Student.Course.Management.System.dto.StudentDTO;
//import com.example.Student.Course.Management.System.service.StudentService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/students")
//public class StudentController {
//
//    private final StudentService service;
//
//
//    public StudentController(StudentService service) {
//        this.service = service;
//    }
//
//
//    @PostMapping
//    public ResponseEntity<StudentDTO> addStudent(
//            @RequestParam String name,
//            @RequestParam Long courseId) {
//
//        StudentDTO savedStudent = service.saveStudent(name, courseId);
//        return ResponseEntity.ok(savedStudent);
//    }
//
//
//    @GetMapping
//    public ResponseEntity<List<StudentDTO>> getStudents() {
//        List<StudentDTO> students = service.getAllStudents();
//        return ResponseEntity.ok(students);
//    }
//}
