package com.example.Student.Course.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private Double discountPercent;
    private String category; // COURSE, PRODUCT, ALL
    private Boolean active;
    private LocalDate expiryDate;
}
