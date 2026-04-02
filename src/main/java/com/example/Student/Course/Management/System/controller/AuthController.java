package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.Role;
import com.example.Student.Course.Management.System.entity.Student;
import com.example.Student.Course.Management.System.entity.User;
import com.example.Student.Course.Management.System.repository.RoleRepository;
import com.example.Student.Course.Management.System.repository.StudentRepository;
import com.example.Student.Course.Management.System.repository.UserRepository;
import com.example.Student.Course.Management.System.service.ActivityService;
import com.example.Student.Course.Management.System.service.OtpService;
import com.example.Student.Course.Management.System.service.StudentService;
import com.example.Student.Course.Management.System.util.JwtUtil;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityService activityService;
    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final OtpService otpService;
    private final JavaMailSender mailSender;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          UserRepository userRepository, RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder, ActivityService activityService,
                          StudentRepository studentRepository, StudentService studentService,
                          OtpService otpService, JavaMailSender mailSender) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityService = activityService;
        this.studentRepository = studentRepository;
        this.studentService = studentService;
        this.otpService = otpService;
        this.mailSender = mailSender;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastActive(java.time.LocalDateTime.now());
            userRepository.save(user);
            activityService.logActivity(username, "LOGIN", "User logged in");
            String token = jwtUtil.generateToken(authentication);
            String role = user.getRole().getName();
            return Map.of("token", token, "role", role, "username", username);
        }

        throw new RuntimeException("Invalid credentials");
    }

    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        String role = userOpt.get().getRole().getName();
        return Map.of("username", username, "role", role);
    }

    @PostMapping("/signup/send-otp")
    public Map<String, String> sendSignupOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        otpService.generateOtp(username);
        return Map.of("message", "OTP generated successfully (check server console)");
    }

    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");
        String roleName = userData.get("role");
        String email = userData.get("email");
        String contactNumber = userData.get("contactNumber");
        String otp = userData.get("otp");

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (otp != null && !otp.trim().isEmpty()) {
            if (!otpService.validateOtp(username, otp)) {
                throw new RuntimeException("Invalid or expired OTP");
            }
        }

        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if (roleOpt.isEmpty()) {
            throw new RuntimeException("Invalid role");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(roleOpt.get());
        user.setEmail(email);
        user.setContactNumber(contactNumber);

        if (roleName.equals("STUDENT")) {
            studentService.saveStudent(username, username, "", "", null);
            Optional<Student> studentOpt = studentRepository.findByRegistrationNumber(username);
            if (studentOpt.isPresent()) {
                user.setStudent(studentOpt.get());
            }
        }

        userRepository.save(user);

        activityService.logActivity(user.getUsername(), "SIGNUP", "User registered");

        return Map.of("message", "User registered successfully");
    }

    @PostMapping("/forgot-password/send-otp")
    public Map<String, String> forgotPasswordSendOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        otpService.generateOtp(username);
        return Map.of("message", "OTP generated successfully (check server console)");
    }

    @PostMapping("/forgot-password/reset")
    public Map<String, String> forgotPasswordReset(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (!otpService.validateOtp(username, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        activityService.logActivity(user.getUsername(), "PASSWORD_RESET", "User reset password via OTP");

        return Map.of("message", "Password reset successfully");
    }

    @PostMapping("/verify/email/send-otp")
    public Map<String, String> sendEmailVerifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        otpService.generateOtp(username + "_email");
        return Map.of("message", "Email verification OTP generated (mocked in console)");
    }

    @PostMapping("/verify/email")
    public Map<String, String> verifyEmail(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");
        if (!otpService.validateOtp(username + "_email", otp)) {
            throw new RuntimeException("Invalid or expired email OTP");
        }
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmailVerified(true);
        userRepository.save(user);
        activityService.logActivity(username, "VERIFY_EMAIL", "User verified email");
        return Map.of("message", "Email verified");
    }

    @PostMapping("/verify/contact/send-otp")
    public Map<String, String> sendContactVerifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        otpService.generateOtp(username + "_contact");
        return Map.of("message", "Contact verification OTP generated (mocked in console)");
    }

    @PostMapping("/verify/contact")
    public Map<String, String> verifyContact(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");
        if (!otpService.validateOtp(username + "_contact", otp)) {
            throw new RuntimeException("Invalid or expired contact OTP");
        }
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.setContactVerified(true);
        userRepository.save(user);
        activityService.logActivity(username, "VERIFY_CONTACT", "User verified contact number");
        return Map.of("message", "Contact number verified");
    }

    @PostMapping("/contact")
    public Map<String, String> submitContact(@RequestBody Map<String, String> request) {
        String name = request.getOrDefault("name", "Anonymous");
        String email = request.get("email");
        String subject = request.getOrDefault("subject", "General Inquiry");
        String message = request.getOrDefault("message", "No details provided.");

        if (email == null || email.trim().isEmpty() || message.trim().isEmpty()) {
            throw new RuntimeException("Email and message are required");
        }

        activityService.logActivity(name, "CONTACT_FORM_SUBMITTED", "subject=" + subject + ", email=" + email);

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo("adarshrajmanii@gmail.com");
            mail.setSubject("[MANIEDUTECH Contact] " + subject);
            mail.setText("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);
            mailSender.send(mail);
            return Map.of("message", "Contact request submitted successfully");
        } catch (Exception e) {
            // Fallback: send may fail if mail config is missing; log and keep user flow working.
            System.out.println("Contact email send failed: " + e.getMessage());
            return Map.of("message", "Contact request captured; admin will follow up soon.");
        }
    }
}
