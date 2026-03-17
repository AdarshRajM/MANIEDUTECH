package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Activity;
import com.example.Student.Course.Management.System.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void logActivity(String username, String action, String details) {
        Activity activity = new Activity();
        activity.setUsername(username);
        activity.setAction(action);
        activity.setDetails(details);
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);
    }
}