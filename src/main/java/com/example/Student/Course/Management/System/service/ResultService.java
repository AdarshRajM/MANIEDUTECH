package com.example.Student.Course.Management.System.service;

import com.example.Student.Course.Management.System.entity.Result;
import com.example.Student.Course.Management.System.repository.ResultRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository repository;

    public ResultService(ResultRepository repository) {
        this.repository = repository;
    }

    @CacheEvict(value = {"results", "student_results", "test_results"}, allEntries = true)
    public Result saveResult(Result result) {
        return repository.save(result);
    }

    @Cacheable(value = "results")
    public List<Result> getAllResults() {
        return repository.findAll();
    }

    @Cacheable(value = "results", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Result> getResultsPaged(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Cacheable(value = "student_results", key = "#studentId")
    public List<Result> getResultsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }

    @Cacheable(value = "test_results", key = "#testId")
    public List<Result> getResultsByTest(Long testId) {
        return repository.findByTestId(testId);
    }
}
