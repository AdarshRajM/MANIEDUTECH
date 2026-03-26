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

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          UserRepository userRepository, RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder, ActivityService activityService,
                          StudentRepository studentRepository, StudentService studentService,
                          OtpService otpService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityService = activityService;
        this.studentRepository = studentRepository;
        this.studentService = studentService;
        this.otpService = otpService;
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
            activityService.logActivity(username, "LOGIN", "User logged in");
            String token = jwtUtil.generateToken(authentication);
            String role = userOpt.get().getRole().getName();
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
}
