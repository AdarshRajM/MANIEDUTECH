package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}