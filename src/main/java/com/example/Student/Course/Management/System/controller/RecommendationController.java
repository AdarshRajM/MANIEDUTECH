package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Map<String, Object>> getRecommendations(@PathVariable Long studentId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForStudent(studentId));
    }
}
