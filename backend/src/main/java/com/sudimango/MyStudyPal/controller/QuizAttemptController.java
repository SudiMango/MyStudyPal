package com.sudimango.MyStudyPal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto;
import com.sudimango.MyStudyPal.service.study.quiz.QuizAttemptService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz-attempt")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService attemptService;

    /**
     * Create a new attempt for a quiz
     * 
     * @apiNote {@code POST /api/quiz-attempt/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param request - request body
     * 
     * @return
     * {@code HTTP 201 CreateQuizAttemptResponse} - Quiz attempt created successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see CreateQuizAttemptRequest CreateQuizAttemptRequest class for request body structure
     * @see CreateQuizAttemptResponse CreateQuizAttemptResponse class for response body structure
     */
    @PostMapping("/{quizId}")
    public ResponseEntity<?> submitAttempt(@PathVariable String quizId, 
                                           @Valid @RequestBody QuizAttemptDto.CreateQuizAttemptRequest request) throws JsonProcessingException, JsonMappingException  {
        QuizAttemptDto.CreateQuizAttemptResponse response = attemptService.submitAttempt(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get details of one attempt for a quiz
     * 
     * @apiNote {@code GET /api/quiz-attempt/{attemptId}}
     * 
     * @param attemptId - id of attempt
     * 
     * @return
     * {@code HTTP 200 QuizAttemptDetails} - details of quiz attempt
     * 
     * @see QuizAttemptDetails QuizAttemptDetails class for response body structure
     */
    @GetMapping("/{attemptId}")
    public ResponseEntity<?> getOneAttempt(@PathVariable String attemptId) {
        QuizAttemptDto.QuizAttemptDetailsResponse response = attemptService.getOneAttempt(attemptId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}