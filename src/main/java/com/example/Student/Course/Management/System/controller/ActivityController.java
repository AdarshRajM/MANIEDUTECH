package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Activity;
import com.example.Student.Course.Management.System.repository.ActivityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityRepository activityRepository;

    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @PreAuthorize("hasRole('PRINCIPAL') or hasRole('FACULTY')")
    @GetMapping
    public ResponseEntity<List<Activity>> getActivities() {
        return ResponseEntity.ok(activityRepository.findAll());
    }
}
