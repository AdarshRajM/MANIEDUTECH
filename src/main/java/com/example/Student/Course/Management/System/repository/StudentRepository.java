package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRegistrationNumber(String registrationNumber);

    Page<Student> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Student> findBySection(String section, Pageable pageable);

    Page<Student> findByRollNumber(String rollNumber, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.name LIKE %:query% OR s.registrationNumber LIKE %:query% OR s.section LIKE %:query% OR s.rollNumber LIKE %:query%")
    Page<Student> searchStudents(@Param("query") String query, Pageable pageable);
}
