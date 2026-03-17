package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUsername(String username);
}
