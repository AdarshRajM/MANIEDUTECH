package com.example.Student.Course.Management.System.repository;

import com.example.Student.Course.Management.System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByRole_NameAndLastActiveAfter(String roleName, LocalDateTime after);
}
