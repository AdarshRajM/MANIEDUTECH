package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {
    private final CouponRepository couponRepository;

    public ChatbotController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping
    public ResponseEntity<?> chat(@RequestParam String q) {
        String lower = q.toLowerCase();
        if (lower.contains("offer") || lower.contains("discount") || lower.contains("coupon")) {
            List<String> offers = couponRepository.findAll().stream()
                    .filter(c -> c.getActive())
                    .map(c -> c.getCode() + " (" + c.getDiscountPercent() + "% off on " + c.getCategory() + ")")
                    .collect(Collectors.toList());
            return ResponseEntity.ok("Current offers: " + String.join(" | ", offers) + ". Use /offers for details.");
        }
        if (lower.contains("course") || lower.contains("test")) {
            return ResponseEntity.ok("You can view all courses at /courses and add to wishlist via /wishlist endpoint. For payment, use /products and /offers apply.");
        }
        return ResponseEntity.ok("Go to /dashboard for your personal portal. To manage offers use /offers if you are Principal/Faculty.");
    }
}
