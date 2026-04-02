package com.example.Student.Course.Management.System.controller;

import com.example.Student.Course.Management.System.entity.*;
import com.example.Student.Course.Management.System.repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/sections")
public class SectionController {

    private final SectionMaterialRepository materialRepository;
    private final SectionChatRepository chatRepository;
    private final LiveClassRepository liveClassRepository;
    private final SectionAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ActivityRepository activityRepository;
    private final com.example.Student.Course.Management.System.service.ActivityService activityService;
    private final Set<String> lockedExamUsers = ConcurrentHashMap.newKeySet();

    public SectionController(SectionMaterialRepository materialRepository,
                             SectionChatRepository chatRepository,
                             LiveClassRepository liveClassRepository,
                             SectionAssignmentRepository assignmentRepository,
                             UserRepository userRepository,
                             StudentRepository studentRepository,
                             ActivityRepository activityRepository,
                             com.example.Student.Course.Management.System.service.ActivityService activityService) {
        this.materialRepository = materialRepository;
        this.chatRepository = chatRepository;
        this.liveClassRepository = liveClassRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.activityRepository = activityRepository;
        this.activityService = activityService;
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

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/materials/{id}/watch")
    public String trackVideoWatch(@PathVariable Long id, Authentication authentication) {
        Optional<SectionMaterial> materialOpt = materialRepository.findById(id);
        if (materialOpt.isEmpty()) {
            throw new RuntimeException("Material not found");
        }
        SectionMaterial material = materialOpt.get();
        if (!"VIDEO".equalsIgnoreCase(material.getMaterialType())) {
            throw new RuntimeException("Material is not a video");
        }
        String username = authentication.getName();
        activityService.logActivity(username, "VIDEO_WATCH", "MaterialId=" + id + ";Title=" + material.getTitle());
        return "Watch recorded";
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @GetMapping("/materials/{id}/viewers")
    public List<String> getVideoViewers(@PathVariable Long id) {
        List<Activity> watchers = activityRepository.findByAction("VIDEO_WATCH");
        return watchers.stream()
                .filter(a -> a.getDetails().contains("MaterialId=" + id))
                .map(Activity::getUsername)
                .distinct()
                .toList();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/activity/monitor")
    public String monitorAssessmentActivity(@RequestBody Map<String, String> payload, Authentication authentication) {
        String username = authentication.getName();
        if (lockedExamUsers.contains(username)) {
            return "locked";
        }

        String event = payload.getOrDefault("event", "UNKNOWN");
        String details = payload.getOrDefault("details", "");
        activityService.logActivity(username, "MONITOR_" + event.toUpperCase(), details);

        if (event.equalsIgnoreCase("window_switch")) {
            int count = 1;
            try {
                if (details.contains("count=")) {
                    count = Integer.parseInt(details.split("count=")[1]);
                }
            } catch (Exception ignored) {}
            if (count >= 3) {
                lockedExamUsers.add(username);
            }
        }

        if (event.equalsIgnoreCase("fullscreen_exit") || event.equalsIgnoreCase("escape_pressed") || event.equalsIgnoreCase("app_switch_try")) {
            lockedExamUsers.add(username);
        }

        return lockedExamUsers.contains(username) ? "locked" : "ok";
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/exam/lock-status")
    public Map<String, Object> getExamLockStatus(Authentication authentication) {
        String username = authentication.getName();
        boolean locked = lockedExamUsers.contains(username);
        return Map.of("locked", locked, "reason", locked ? "policy_violation" : "none");
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/exam/lock")
    public Map<String, String> lockExam(@RequestBody Map<String, String> payload, Authentication authentication) {
        String username = authentication.getName();
        String reason = payload.getOrDefault("reason", "manual_lock");
        lockedExamUsers.add(username);
        activityService.logActivity(username, "EXAM_LOCKED", reason);
        return Map.of("status", "locked", "reason", reason);
    }

    @PreAuthorize("hasRole('FACULTY') or hasRole('PRINCIPAL')")
    @PostMapping("/exam/unlock")
    public String unlockExam(@RequestBody Map<String, String> payload) {
        String user = payload.get("username");
        lockedExamUsers.remove(user);
        return "unlocked";
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

    @PreAuthorize("hasRole('PRINCIPAL') or hasRole('FACULTY')")
    @GetMapping("/students/online")
    public List<String> getOnlineStudents() {
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(20);
        return userRepository.findByRole_NameAndLastActiveAfter("STUDENT", threshold)
                .stream()
                .map(User::getUsername)
                .toList();
    }
}
