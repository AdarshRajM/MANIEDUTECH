package com.example.Student.Course.Management.System.dto;





import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {

    private Long id;
    private String name;
    private String registrationNumber;
    private String section;
    private String rollNumber;
    private Long courseId;
    private String courseName;
}
