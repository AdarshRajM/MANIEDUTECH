package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.entity.Result;
import com.example.Student.Course.Management.System.entity.Test;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import com.example.Student.Course.Management.System.repository.ResultRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final CourseRepository courseRepository;
    private final ResultRepository resultRepository;

    public RecommendationService(CourseRepository courseRepository, ResultRepository resultRepository) {
        this.courseRepository = courseRepository;
        this.resultRepository = resultRepository;
    }

    public Map<String, Object> getRecommendationsForStudent(Long studentId) {
        Map<String, Object> recommendations = new HashMap<>();

        // 1. Fetch Student Results
        List<Result> studentResults = resultRepository.findByStudentId(studentId);
        
        // 2. Analyze weak topics (tests where marks are below 50%)
        List<Test> weakTests = new ArrayList<>();
        List<Course> enrolledCourses = new ArrayList<>();
        
        for (Result r : studentResults) {
            enrolledCourses.add(r.getTest().getCourse());
            double percent = ((double) r.getMarksObtained() / r.getTest().getTotalMarks()) * 100;
            if (percent < 50.0) {
                weakTests.add(r.getTest());
            }
        }

        recommendations.put("focusAreas", weakTests.stream()
                .map(t -> t.getTitle() + " (Needs Revision)")
                .collect(Collectors.toList()));

        // 3. Recommend New Courses (courses they are NOT enrolled in yet)
        List<Course> allCourses = courseRepository.findAll();
        List<Course> suggestedCourses = allCourses.stream()
                .filter(c -> !enrolledCourses.contains(c))
                .limit(3) // Recommend top 3 new courses
                .collect(Collectors.toList());

        recommendations.put("suggestedCourses", suggestedCourses);
        recommendations.put("aiMessage", weakTests.isEmpty() ? 
            "Excellent performance! Try exploring these new advanced courses." : 
            "We noticed some weak areas. Revision of highlighted topics is highly recommended.");

        return recommendations;
    }
}
