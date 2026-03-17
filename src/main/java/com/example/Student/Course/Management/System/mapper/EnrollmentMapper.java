package com.example.Student.Course.Management.System.mapper;


import com.example.Student.Course.Management.System.entity.Course;
import com.example.Student.Course.Management.System.entity.Enrollment;
import com.example.Student.Course.Management.System.entity.Student;

public class EnrollmentMapper {

    // ⭐ THIS METHOD WAS MISSING (Main Fix)
    public static Enrollment toEntity(Student student, Course course) {

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        return enrollment;
    }
}
