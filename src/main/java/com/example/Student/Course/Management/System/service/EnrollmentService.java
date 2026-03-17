package com.example.Student.Course.Management.System.service;





import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.entity.Enrollment;
import com.example.Student.Course.Management.System.entity.Student;
import com.example.Student.Course.Management.System.mapper.EnrollmentMapper;
import com.example.Student.Course.Management.System.repository.CourseRepository;
import com.example.Student.Course.Management.System.repository.EnrollmentRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enrollStudent(Long studentId, Long courseId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = EnrollmentMapper.toEntity(student, course);

        // ⭐ save() will work only if JpaRepository is extended
        return enrollmentRepository.save(enrollment);
    }
}



//import com.example.Student.Course.Management.System.entity.Course;
//import com.example.Student.Course.Management.System.entity.Enrollment;
//import com.example.Student.Course.Management.System.entity.Student;
//import com.example.Student.Course.Management.System.mapper.EnrollmentMapper;
//import com.example.Student.Course.Management.System.repository.CourseRepository;
//import com.example.Student.Course.Management.System.repository.EnrollmentRepository;
//import com.example.Student.Course.Management.System.repository.StudentRepository;
//
//import org.springframework.stereotype.Service;
//
//@Service
//public class EnrollmentService {
//
//    private final EnrollmentRepository enrollmentRepository;
//    private final StudentRepository studentRepository;
//    private final CourseRepository courseRepository;
//
//    public EnrollmentService(EnrollmentRepository enrollmentRepository,
//                             StudentRepository studentRepository,
//                             CourseRepository courseRepository) {
//        this.enrollmentRepository = enrollmentRepository;
//        this.studentRepository = studentRepository;
//        this.courseRepository = courseRepository;
//    }
//
//    // Enroll student into course
//    public Enrollment enrollStudent(Long studentId, Long courseId) {
//
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        Course course = courseRepository.findById(courseId)
//                .orElseThrow(() -> new RuntimeException("Course not found"));
//
//        Enrollment enrollment = EnrollmentMapper.toEntity(student, course);
//
//        return enrollmentRepository.save(enrollment);
//    }
//}

















//import com.example.Student.Course.Management.System.entity.Course;
//import com.example.Student.Course.Management.System.entity.Enrollment;
//import com.example.Student.Course.Management.System.entity.Student;
//import com.example.Student.Course.Management.System.repository.CourseRepository;
//import com.example.Student.Course.Management.System.repository.EnrollmentRepository;
//import com.example.Student.Course.Management.System.repository.StudentRepository;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EnrollmentService {
//
//    private final EnrollmentRepository enrollmentRepo;
//    private final StudentRepository studentRepo;
//    private final CourseRepository courseRepo;
//
//    public EnrollmentService(EnrollmentRepository enrollmentRepo,
//                             StudentRepository studentRepo,
//                             CourseRepository courseRepo) {
//        this.enrollmentRepo = enrollmentRepo;
//        this.studentRepo = studentRepo;
//        this.courseRepo = courseRepo;
//    }
//
//    public Enrollment enroll(Long studentId, Long courseId) {
//
//        Student student = studentRepo.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        Course course = courseRepo.findById(courseId)
//                .orElseThrow(() -> new RuntimeException("Course not found"));
//
//        Enrollment enrollment = new Enrollment();
//        enrollment.setStudent(student);
//        enrollment.setCourse(course);
//
//        return enrollmentRepo.save(enrollment);
//    }
//}
