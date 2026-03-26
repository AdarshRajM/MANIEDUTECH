package com.example.Student.Course.Management.System;

import com.example.Student.Course.Management.System.entity.Role;
import com.example.Student.Course.Management.System.entity.User;
import com.example.Student.Course.Management.System.repository.RoleRepository;
import com.example.Student.Course.Management.System.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class StudentCourseManagementSystemApplication implements CommandLineRunner {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(StudentCourseManagementSystemApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (roleRepository.findByName("STUDENT").isEmpty()) {
			roleRepository.save(new Role(null, "STUDENT"));
		}
		if (roleRepository.findByName("FACULTY").isEmpty()) {
			roleRepository.save(new Role(null, "FACULTY"));
		}
		if (roleRepository.findByName("PRINCIPAL").isEmpty()) {
			roleRepository.save(new Role(null, "PRINCIPAL"));
		}

		Optional<Role> principalRole = roleRepository.findByName("PRINCIPAL");
		if (principalRole.isPresent() && userRepository.findByUsername("Adarsh Raj").isEmpty()) {
			User principal = new User();
			principal.setUsername("Adarsh Raj");
			principal.setPassword(passwordEncoder.encode("Mani789"));
			principal.setRole(principalRole.get());
			userRepository.save(principal);
		}
	}

}
