package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Result;
import com.example.Student.Course.Management.System.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService service;

    public ResultController(ResultService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping
    public ResponseEntity<Result> addResult(@Valid @RequestBody Result result) {
        return ResponseEntity.ok(service.saveResult(result));
    }

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(service.getAllResults());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Result>> getResultsPaged(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getResultsPaged(pageable));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getResultsByStudent(studentId));
    }
}
