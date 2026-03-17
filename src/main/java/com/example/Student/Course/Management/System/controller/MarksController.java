package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Marks;
import com.example.Student.Course.Management.System.service.MarksService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping
    public Marks addMarks(@RequestParam Long studentId, @RequestParam Long courseId,
                          @RequestParam Double marks, @RequestParam String grade) {
        return marksService.addMarks(studentId, courseId, marks, grade);
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/student/{studentId}")
    public Page<Marks> getMarksByStudent(@PathVariable String studentId,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ROLE_STUDENT"))) {
            String username = authentication.getName();
            if (!username.equals(studentId)) {
                throw new RuntimeException("Access denied");
            }
        }
        Pageable pageable = PageRequest.of(page, size);
        return marksService.getMarksByStudent(studentId, pageable);
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/course/{courseId}")
    public Page<Marks> getMarksByCourse(@PathVariable Long courseId,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return marksService.getMarksByCourse(courseId, pageable);
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping
    public Page<Marks> getAllMarks(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return marksService.getAllMarks(pageable);
    }
}