package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String section;
    private String facultyUsername;
}
