package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Test;
import com.example.Student.Course.Management.System.service.TestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tests")
public class TestController {

    private final TestService service;

    public TestController(TestService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping
    public ResponseEntity<Test> addTest(@Valid @RequestBody Test test) {
        return ResponseEntity.ok(service.saveTest(test));
    }

    @GetMapping
    public ResponseEntity<List<Test>> getAllTests() {
        return ResponseEntity.ok(service.getAllTests());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Test>> getTestsPaged(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getTestsPaged(pageable));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Test>> getTestsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getTestsByCourse(courseId));
    }
}
