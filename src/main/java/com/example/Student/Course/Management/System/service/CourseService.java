package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public Course saveCourse(Course course) {
        return repository.save(course);
    }

    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    public Page<Course> getCourses(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Course> searchCourses(String query) {
        if (query == null || query.isBlank()) {
            return repository.findAll();
        }
        return repository.findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }
}
