package com.sudimango.MyStudyPal.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.request.quiz.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.request.quiz.UpdateQuizRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.CreateQuizResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.QuizResponse;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.service.quiz.QuizService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Create a new quiz with questions inside a specific study set
     * @apiNote {@code POST /api/quiz/create/{studySetId}}
     */
    @PostMapping("/create/{studySetId}")
    public ResponseEntity<?> createQuiz(@PathVariable String studySetId,
                                        @Valid @RequestBody CreateQuizRequest request,
                                        @AuthenticationPrincipal User user) {
        try {
            CreateQuizResponse response = quizService.createQuiz(request, studySetId, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all quizzes for the logged in user
     * @apiNote {@code GET /api/quiz/get-all}
     */
    @GetMapping("/get-all/{studySetId}")
    public ResponseEntity<?> getQuizzes(@PathVariable String studySetId) {
        try {
            List<QuizResponse> responses = quizService.getQuizzesForStudySet(studySetId);
            return ResponseEntity.status(HttpStatus.OK).body(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get a specific quiz by ID
     * @apiNote {@code GET /api/quiz/{quizId}}
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getOneQuiz(@PathVariable String quizId) {
        try {
            QuizResponse response = quizService.getOneQuiz(quizId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update quiz metadata
     * @apiNote {@code PATCH /api/quiz/{quizId}}
     */
    @PatchMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable String quizId, 
                                        @Valid @RequestBody UpdateQuizRequest request) {
        try {
            quizService.updateQuiz(quizId, request);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Delete a quiz and its questions
     * @apiNote {@code DELETE /api/quiz/{quizId}}
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String quizId) {
        try {
            quizService.deleteQuiz(quizId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}