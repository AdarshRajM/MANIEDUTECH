package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Activity;
import com.example.Student.Course.Management.System.entity.MongoActivity;
import com.example.Student.Course.Management.System.repository.ActivityRepository;
import com.example.Student.Course.Management.System.repository.MongoActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final MongoActivityRepository mongoActivityRepository;

    public ActivityService(ActivityRepository activityRepository, MongoActivityRepository mongoActivityRepository) {
        this.activityRepository = activityRepository;
        this.mongoActivityRepository = mongoActivityRepository;
    }

    public void logActivity(String username, String action, String details) {
        Activity activity = new Activity();
        activity.setUsername(username);
        activity.setAction(action);
        activity.setDetails(details);
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);

        try {
            MongoActivity mongoActivity = new MongoActivity();
            mongoActivity.setUsername(username);
            mongoActivity.setAction(action);
            mongoActivity.setDetails(details);
            mongoActivity.setTimestamp(LocalDateTime.now());
            mongoActivityRepository.save(mongoActivity);
        } catch (Exception ex) {
            // If Mongo is not configured, skip without stopping the app
        }
    }
}