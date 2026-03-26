package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Result;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    Page<Result> findByStudentId(Long studentId, Pageable pageable);
    List<Result> findByTestId(Long testId);
}
