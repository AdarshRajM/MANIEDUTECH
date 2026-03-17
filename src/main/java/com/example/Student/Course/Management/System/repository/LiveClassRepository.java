package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.LiveClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LiveClassRepository extends JpaRepository<LiveClassSession, Long> {
    List<LiveClassSession> findBySection(String section);
}
