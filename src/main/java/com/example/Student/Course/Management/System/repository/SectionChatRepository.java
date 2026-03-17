package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.SectionChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionChatRepository extends JpaRepository<SectionChatMessage, Long> {
    List<SectionChatMessage> findBySectionOrderByTimestampAsc(String section);
}
