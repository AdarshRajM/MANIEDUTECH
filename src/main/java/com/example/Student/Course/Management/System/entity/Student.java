package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String registrationNumber;

    private String section;

    private String rollNumber;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

}
