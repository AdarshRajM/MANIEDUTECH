package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Coupon;
import com.example.Student.Course.Management.System.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/offers")
public class OfferController {
    private final CouponRepository couponRepository;

    public OfferController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @PreAuthorize("hasRole('PRINCIPAL') or hasRole('FACULTY')")
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        coupon.setActive(true);
        if (coupon.getExpiryDate() == null) {
            coupon.setExpiryDate(LocalDate.now().plusMonths(1));
        }
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> allOffers() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @GetMapping("/apply/{code}")
    public ResponseEntity<?> applyCoupon(@PathVariable String code) {
        return couponRepository.findByCode(code)
                .map(c -> {
                    if (!c.getActive() || c.getExpiryDate().isBefore(LocalDate.now())) {
                        return ResponseEntity.badRequest().body("Coupon expired or inactive");
                    }
                    return ResponseEntity.ok(c);
                })
                .orElse(ResponseEntity.badRequest().body("Coupon not found"));
    }
}
