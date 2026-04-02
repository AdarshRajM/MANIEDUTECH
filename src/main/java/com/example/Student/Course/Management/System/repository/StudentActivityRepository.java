package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.StudentActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentActivityRepository extends MongoRepository<StudentActivity, String> {
    List<StudentActivity> findByUsername(String username);
}
