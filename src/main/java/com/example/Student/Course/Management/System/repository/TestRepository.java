package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByCourseId(Long courseId);
    Page<Test> findByCourseId(Long courseId, Pageable pageable);
}
