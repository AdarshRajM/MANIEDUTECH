package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByAction(String action);
    List<Activity> findByDetailsContaining(String fragment);
}
