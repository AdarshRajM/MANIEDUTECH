package com.example.Student.Course.Management.System.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "activity_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MongoActivity {

    @Id
    private String id;
    private String username;
    private String action;
    private String details;
    private LocalDateTime timestamp;
}
