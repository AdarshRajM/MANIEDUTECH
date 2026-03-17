package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.*;
import com.example.Student.Course.Management.System.repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sections")
public class SectionController {

    private final SectionMaterialRepository materialRepository;
    private final SectionChatRepository chatRepository;
    private final LiveClassRepository liveClassRepository;
    private final SectionAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public SectionController(SectionMaterialRepository materialRepository,
                             SectionChatRepository chatRepository,
                             LiveClassRepository liveClassRepository,
                             SectionAssignmentRepository assignmentRepository,
                             UserRepository userRepository,
                             StudentRepository studentRepository) {
        this.materialRepository = materialRepository;
        this.chatRepository = chatRepository;
        this.liveClassRepository = liveClassRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping("/materials")
    public SectionMaterial uploadMaterial(@RequestBody SectionMaterial material) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        material.setFaculty(userRepository.findByUsername(auth.getName()).orElse(null));
        return materialRepository.save(material);
    }

    @GetMapping("/materials/section/{section}")
    public List<SectionMaterial> materialsForSection(@PathVariable String section, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");
        User user = userOpt.get();

        if (user.getRole().getName().equals("PRINCIPAL") || user.getRole().getName().equals("FACULTY")) {
            return materialRepository.findAll();
        }

        Student student = studentRepository.findByRegistrationNumber(username).orElse(null);
        if (student == null || !section.equalsIgnoreCase(student.getSection())) {
            throw new RuntimeException("Access denied");
        }
        return materialRepository.findBySection(section);
    }

    @GetMapping("/materials")
    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    public List<SectionMaterial> allMaterials() {
        return materialRepository.findAll();
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping("/chat")
    public SectionChatMessage sendChat(@RequestBody SectionChatMessage message, Authentication authentication) {
        message.setTimestamp(LocalDateTime.now());
        message.setSender(authentication.getName());
        message.setRole(authentication.getAuthorities().stream().findFirst().map(Object::toString).orElse("UNKNOWN"));
        return chatRepository.save(message);
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/chat/{section}")
    public List<SectionChatMessage> getSectionChat(@PathVariable String section, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");
        User user = userOpt.get();

        if (user.getRole().getName().equals("STUDENT")) {
            Student student = studentRepository.findByRegistrationNumber(username).orElseThrow(() -> new RuntimeException("Student not found"));
            if (!section.equalsIgnoreCase(student.getSection())) {
                throw new RuntimeException("Access denied");
            }
        }

        return chatRepository.findBySectionOrderByTimestampAsc(section);
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping("/live")
    public LiveClassSession createLiveClass(@RequestBody LiveClassSession session, Authentication auth) {
        session.setFacultyUsername(auth.getName());
        return liveClassRepository.save(session);
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/live/{section}")
    public List<LiveClassSession> getLiveClasses(@PathVariable String section, Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ROLE_STUDENT"))) {
            Student student = studentRepository.findByRegistrationNumber(authentication.getName()).orElseThrow(() -> new RuntimeException("Student not found"));
            if (!section.equalsIgnoreCase(student.getSection())) {
                throw new RuntimeException("Access denied");
            }
        }
        return liveClassRepository.findBySection(section);
    }

    @PreAuthorize("hasRole('PRINCIPAL')")
    @PostMapping("/assign")
    public SectionAssignment assignSection(@RequestBody SectionAssignment assignment) {
        return assignmentRepository.save(assignment);
    }

    @PreAuthorize("hasRole('PRINCIPAL') or hasRole('FACULTY')")
    @GetMapping("/assignments")
    public List<SectionAssignment> getAssignments() {
        return assignmentRepository.findAll();
    }
}
