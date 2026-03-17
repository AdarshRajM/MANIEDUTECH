package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
