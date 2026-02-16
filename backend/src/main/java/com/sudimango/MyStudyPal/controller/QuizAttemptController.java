package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.request.quiz.attempt.SubmitAttemptRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.attempt.SubmitAttemptResponse;
import com.sudimango.MyStudyPal.service.quiz.attempt.QuizAttemptService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz-attempt")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService attemptService;

    /**
     * Submit a completed quiz attempt for grading
     * * @apiNote {@code POST /api/quiz-attempt/submit/{quizId}}
     * * @param quizId - the id of the quiz being taken
     * @param request - the answers and metadata for the attempt
     * @return
     * {@code HTTP 201} - Attempt graded and saved successfully {AttemptResponse}
     * {@code HTTP 400} - Validation errors {errors: []}
     * {@code HTTP 500} - Internal error {error: ""}
     */
    @PostMapping("/submit/{quizId}")
    public ResponseEntity<?> submitAttempt(@PathVariable String quizId, 
                                           @Valid @RequestBody SubmitAttemptRequest request) {
        try {
            SubmitAttemptResponse response = attemptService.submitAttempt(quizId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all attempts for a particular quiz
     * * @apiNote {@code GET /api/quiz-attempt/quiz/{quizId}}
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<?> getAttemptsForQuiz(@PathVariable String quizId) {
        try {
            List<SubmitAttemptResponse> responses = attemptService.getAttemptsByQuiz(quizId);
            return ResponseEntity.status(HttpStatus.OK).body(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get the details of a specific attempt (including specific answer feedback)
     * * @apiNote {@code GET /api/quiz-attempt/{attemptId}}
     */
    @GetMapping("/{attemptId}")
    public ResponseEntity<?> getOneAttempt(@PathVariable String attemptId) {
        try {
            SubmitAttemptResponse response = attemptService.getOneAttempt(attemptId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}