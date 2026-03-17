package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Marks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MarksRepository extends JpaRepository<Marks, Long> {

    @Query("SELECT m FROM Marks m WHERE m.student.registrationNumber = :studentId")
    Page<Marks> findByStudentId(@Param("studentId") String studentId, Pageable pageable);

    @Query("SELECT m FROM Marks m WHERE m.course.id = :courseId")
    Page<Marks> findByCourseId(@Param("courseId") String courseId, Pageable pageable);
}