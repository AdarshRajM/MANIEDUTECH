package com.example.Student.Course.Management.System.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "student_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentActivity {
    @Id
    private String id;
    
    private String username;
    private String event;
    private String details;
    private LocalDateTime timestamp;
}
