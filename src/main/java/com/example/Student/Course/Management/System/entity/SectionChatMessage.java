package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "section_chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String section;
    private String sender;
    private String role;
    private String message;
    private LocalDateTime timestamp;
}
