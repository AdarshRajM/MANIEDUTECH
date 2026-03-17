package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Enrollment;
import com.example.Student.Course.Management.System.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(Student student);
}

