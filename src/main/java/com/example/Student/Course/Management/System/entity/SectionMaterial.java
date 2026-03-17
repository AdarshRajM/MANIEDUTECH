package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String section;
    private String materialType; // VIDEO, NOTE, TEST
    private String contentUrl;
    private String extraData;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private User faculty;
}
