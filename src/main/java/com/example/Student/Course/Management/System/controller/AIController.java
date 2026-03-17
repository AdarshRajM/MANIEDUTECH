package com.example.Student.Course.Management.System.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @PostMapping("/doubt")
    public ResponseEntity<Map<String, String>> solveDoubt(@RequestBody Map<String, String> payload) {
        String question = payload.getOrDefault("question", "");
        String answer;

        if (question.toLowerCase().contains("binary tree")) {
            answer = "Binary tree is a tree data structure where each node has at most 2 children: left and right. Use recursion for traversal. Use BFS for level order.";
        } else if (question.toLowerCase().contains("recursion")) {
            answer = "Recursion is a function calling itself with a base case. Example: factorial(n): return 1 if n<=1 else n*factorial(n-1).";
        } else if (question.toLowerCase().contains("stack") || question.toLowerCase().contains("heap")) {
            answer = "Use data structure analysis: stack is LIFO, heap is priority queue. For DSA, use custom priority queue or sorting. ";
        } else {
            answer = "Great question! Start by breaking down the problem into smaller functions. Focus on examples and edge-cases first.";
        }

        return ResponseEntity.ok(Map.of(
                "question", question,
                "answer", answer
        ));
    }
}
