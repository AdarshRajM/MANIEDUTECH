package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.SectionMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionMaterialRepository extends JpaRepository<SectionMaterial, Long> {
    List<SectionMaterial> findBySection(String section);
}
