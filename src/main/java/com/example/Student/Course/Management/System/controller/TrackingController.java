package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.StudentActivity;
import com.example.Student.Course.Management.System.repository.StudentActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    @Autowired
    private StudentActivityRepository activityRepository;

    @PostMapping
    public ResponseEntity<String> trackActivity(@RequestBody StudentActivity activity) {
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);
        return ResponseEntity.ok("Activity logged successfully to MongoDB");
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<StudentActivity>> getUserActivity(@PathVariable String username) {
        List<StudentActivity> activities = activityRepository.findByUsername(username);
        return ResponseEntity.ok(activities);
    }
}
