package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class CourseServiceTest {

    private CourseRepository courseRepository;
    private CourseService courseService;

    @BeforeEach
    void setup() {
        courseRepository = Mockito.mock(CourseRepository.class);
        courseService = new CourseService(courseRepository);
    }

    @Test
    void searchCoursesShouldReturnAllWhenQueryEmpty() {
        when(courseRepository.findAll()).thenReturn(List.of(
                new Course(1L, "React Bootcamp", "Frontend course", 199.0),
                new Course(2L, "Java Core", "Backend course", 149.0)
        ));

        List<Course> result = courseService.searchCourses("");
        assertEquals(2, result.size());
    }

    @Test
    void searchCoursesShouldUseCustomRepositorySearch() {
        when(courseRepository.findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(anyString(), anyString()))
                .thenReturn(List.of(new Course(1L, "React Bootcamp", "Frontend course", 199.0)));

        List<Course> result = courseService.searchCourses("React");
        assertEquals(1, result.size());
        assertTrue(result.get(0).getCourseName().contains("React"));
    }
}
