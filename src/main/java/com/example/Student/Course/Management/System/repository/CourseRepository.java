package com.example.Student.Course.Management.System.repository;



import com.example.Student.Course.Management.System.entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String courseName, String description);
}
