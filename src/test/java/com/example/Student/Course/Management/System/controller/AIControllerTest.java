package com.example.Student.Course.Management.System.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AIControllerTest {

    @Test
    void solveDoubtShouldAnswerBinaryTreeQuestion() {
        AIController controller = new AIController();
        ResponseEntity<Map<String, String>> response = controller.solveDoubt(Map.of("question", "Explain binary tree"));

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("answer"));
        assertTrue(response.getBody().get("answer").toLowerCase().contains("binary tree"));
    }

    @Test
    void solveDoubtShouldReturnGenericIfUnknownQuestion() {
        AIController controller = new AIController();
        ResponseEntity<Map<String, String>> response = controller.solveDoubt(Map.of("question", "What is the meaning of life?"));

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("answer"));
        assertTrue(response.getBody().get("answer").length() > 5);
    }
}
