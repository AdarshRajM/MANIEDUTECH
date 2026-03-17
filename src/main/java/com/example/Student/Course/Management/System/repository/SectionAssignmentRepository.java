package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.SectionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionAssignmentRepository extends JpaRepository<SectionAssignment, Long> {
    List<SectionAssignment> findBySection(String section);
}
