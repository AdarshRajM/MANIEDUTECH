package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Test;
import com.example.Student.Course.Management.System.repository.TestRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    private final TestRepository repository;

    public TestService(TestRepository repository) {
        this.repository = repository;
    }

    @CacheEvict(value = "tests", allEntries = true)
    public Test saveTest(Test test) {
        return repository.save(test);
    }

    @Cacheable(value = "tests")
    public List<Test> getAllTests() {
        return repository.findAll();
    }

    @Cacheable(value = "tests", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Test> getTestsPaged(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Test> getTestsByCourse(Long courseId) {
        return repository.findByCourseId(courseId);
    }
}
