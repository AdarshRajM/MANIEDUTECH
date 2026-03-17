package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiveClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String section;
    private String facultyUsername;
    private LocalDateTime scheduledAt;
    private String meetingLink;
    private String description;
}
