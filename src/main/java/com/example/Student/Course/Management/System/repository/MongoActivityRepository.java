package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.MongoActivity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MongoActivityRepository extends MongoRepository<MongoActivity, String> {
    List<MongoActivity> findByUsername(String username);
    List<MongoActivity> findByAction(String action);
}
