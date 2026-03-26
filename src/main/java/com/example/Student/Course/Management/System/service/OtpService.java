package com.example.Student.Course.Management.System.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class OtpService {
    // Stores OTP with an identifier (username, email, etc.)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String identifier) {
        String otp = String.format("%06d", random.nextInt(999999));
        otpStorage.put(identifier, otp);
        System.out.println("=================================================");
        System.out.println("MOCK OTP for " + identifier + " is: " + otp);
        System.out.println("=================================================");
        return otp;
    }

    public boolean validateOtp(String identifier, String otp) {
        String storedOtp = otpStorage.get(identifier);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(identifier); // consume OTP
            return true;
        }
        return false;
    }
}
