package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.WishlistItem;
import com.example.Student.Course.Management.System.repository.WishlistItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {
    private final WishlistItemRepository wishlistItemRepository;

    public WishlistController(WishlistItemRepository wishlistItemRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<WishlistItem> addToWishlist(@RequestBody WishlistItem item) {
        return ResponseEntity.ok(wishlistItemRepository.save(item));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{username}")
    public ResponseEntity<List<WishlistItem>> getWishlist(@PathVariable String username) {
        return ResponseEntity.ok(wishlistItemRepository.findByUsername(username));
    }
}
