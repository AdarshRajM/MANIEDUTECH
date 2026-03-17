package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.dto.StudentDTO;
import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.entity.Student;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;

    public StudentService(StudentRepository studentRepo,
                          CourseRepository courseRepo) {
        this.studentRepo = studentRepo;
        this.courseRepo = courseRepo;
    }

    // SAVE STUDENT (POST)
    public StudentDTO saveStudent(String name, String registrationNumber, String section, String rollNumber, Long courseId) {

        // Step 1: Find course from DB
        Course course = null;
        if (courseId != null) {
            course = courseRepo.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
        }

        // Step 2: Create student object
        Student student = new Student();
        student.setName(name);
        student.setRegistrationNumber(registrationNumber);
        student.setSection(section);
        student.setRollNumber(rollNumber);
        student.setCourse(course);

        // Step 3: Save in database
        Student saved = studentRepo.save(student);

        // Step 4: Convert Entity → DTO (FINAL FIX)
        return new StudentDTO(
                saved.getId(),
                saved.getName(),
                saved.getRegistrationNumber(),
                saved.getSection(),
                saved.getRollNumber(),
                saved.getCourse() != null ? saved.getCourse().getId() : null,
                saved.getCourse() != null ? saved.getCourse().getCourseName() : null
        );
    }

    // GET ALL STUDENTS
    public List<StudentDTO> getAllStudents() {
        return studentRepo.findAll()
                .stream()
                .map(student -> new StudentDTO(
                        student.getId(),
                        student.getName(),
                        student.getRegistrationNumber(),
                        student.getSection(),
                        student.getRollNumber(),
                        (student.getCourse() != null ? student.getCourse().getId() : null),
                        (student.getCourse() != null ? student.getCourse().getCourseName() : null)
                ))
                .toList();
    }

    // GET STUDENTS WITH PAGINATION
    public Page<StudentDTO> getStudents(Pageable pageable) {
        return studentRepo.findAll(pageable)
                .map(student -> new StudentDTO(
                        student.getId(),
                        student.getName(),
                        student.getRegistrationNumber(),
                        student.getSection(),
                        student.getRollNumber(),
                        (student.getCourse() != null ? student.getCourse().getId() : null),
                        (student.getCourse() != null ? student.getCourse().getCourseName() : null)
                ));
    }

    // SEARCH STUDENTS
    public Page<StudentDTO> searchStudents(String query, Pageable pageable) {
        return studentRepo.searchStudents(query, pageable)
                .map(student -> new StudentDTO(
                        student.getId(),
                        student.getName(),
                        student.getRegistrationNumber(),
                        student.getSection(),
                        student.getRollNumber(),
                        (student.getCourse() != null ? student.getCourse().getId() : null),
                        (student.getCourse() != null ? student.getCourse().getCourseName() : null)
                ));
    }

    // GET STUDENT BY REGISTRATION NUMBER
    public Optional<StudentDTO> getStudentByRegistrationNumber(String registrationNumber) {
        return studentRepo.findByRegistrationNumber(registrationNumber)
                .map(student -> new StudentDTO(
                        student.getId(),
                        student.getName(),
                        student.getRegistrationNumber(),
                        student.getSection(),
                        student.getRollNumber(),
                        (student.getCourse() != null ? student.getCourse().getId() : null),
                        (student.getCourse() != null ? student.getCourse().getCourseName() : null)
                ));
    }

    // UPDATE STUDENT
    public StudentDTO updateStudent(Long id, String name, String registrationNumber, String section, String rollNumber, Long courseId) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = null;
        if (courseId != null) {
            course = courseRepo.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
        }

        student.setName(name);
        student.setRegistrationNumber(registrationNumber);
        student.setSection(section);
        student.setRollNumber(rollNumber);
        student.setCourse(course);

        Student saved = studentRepo.save(student);

        return new StudentDTO(
                saved.getId(),
                saved.getName(),
                saved.getRegistrationNumber(),
                saved.getSection(),
                saved.getRollNumber(),
                (saved.getCourse() != null ? saved.getCourse().getId() : null),
                (saved.getCourse() != null ? saved.getCourse().getCourseName() : null)
        );
    }
}
