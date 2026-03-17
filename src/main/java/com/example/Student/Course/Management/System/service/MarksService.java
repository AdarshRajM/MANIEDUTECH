package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.entity.Marks;
import com.example.Student.Course.Management.System.entity.Student;
import com.example.Student.Course.Management.System.entity.User;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import com.example.Student.Course.Management.System.repository.MarksRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import com.example.Student.Course.Management.System.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public MarksService(MarksRepository marksRepository, StudentRepository studentRepository,
                        CourseRepository courseRepository, UserRepository userRepository) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Marks addMarks(Long studentId, Long courseId, Double marks, String grade) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User faculty = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Marks marksEntity = new Marks();
        marksEntity.setStudent(student);
        marksEntity.setCourse(course);
        marksEntity.setMarks(marks);
        marksEntity.setGrade(grade);
        marksEntity.setFaculty(faculty);

        return marksRepository.save(marksEntity);
    }

    public Page<Marks> getMarksByStudent(String studentId, Pageable pageable) {
        return marksRepository.findByStudentId(studentId, pageable);
    }

    public Page<Marks> getMarksByCourse(Long courseId, Pageable pageable) {
        return marksRepository.findByCourseId(String.valueOf(courseId), pageable);
    }

    public Page<Marks> getAllMarks(Pageable pageable) {
        return marksRepository.findAll(pageable);
    }
}