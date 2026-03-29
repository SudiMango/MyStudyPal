package com.sudimango.MyStudyPal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.QuizQuestionDto;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.service.study.quiz.QuizQuestionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz-question")
public class QuizQuestionController {

    @Autowired
    private QuizQuestionService questionService;

    /**
     * Create a new quiz question for a quiz manually
     * 
     * @apiNote {@code POST /api/quiz-question/manual/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param request - request body
     * 
     * @return
     * {@code HTTP 201 QuizQuestion} - Quiz question created successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see CreateQuizQuestionManuallyRequest CreateQuizQuestionManuallyRequest class for request body structure
     * @see QuizQuestion QuizQuestion class for response body structure
     */
    @PostMapping("/manual/{quizId}")
    public ResponseEntity<?> createQuizQuestionManually(@PathVariable String quizId, @Valid @RequestBody QuizQuestionDto.CreateQuizQuestionManuallyRequest request) {
        QuizQuestion response = questionService.createQuestionManually(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Create a new quiz question for a quiz with AI
     * 
     * @apiNote {@code POST /api/quiz-question/ai/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param request - request body
     * 
     * @return
     * {@code HTTP 201 QuizQuestion} - Quiz question created successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see CreateQuizQuestionWithAIRequest CreateQuizQuestionWithAIRequest class for request body structure
     * @see QuizQuestion QuizQuestion class for response body structure
     */
    @PostMapping("/ai/{quizId}")
    public ResponseEntity<?> createQuizQuestionWithAI(@PathVariable String quizId, @Valid @RequestBody QuizQuestionDto.CreateQuizQuestionWithAIRequest request) {
        QuizQuestion response = questionService.createQuestionWithAI(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a quiz question for a quiz manually
     * 
     * @apiNote {@code PATCH /api/quiz-question/manual/{questionId}}
     * 
     * @param questionId - id of question
     * @param request - request body
     * 
     * @return
     * {@code HTTP 200 QuizQuestion} - Quiz question updated successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see UpdateQuizQuestionManuallyRequest UpdateQuizQuestionManuallyRequest class for request body structure
     * @see QuizQuestion QuizQuestion class for response body structure
     */
    @PatchMapping("/manual/{questionId}")
    public ResponseEntity<?> updateQuizQuestionWithAI(@PathVariable String questionId, @Valid @RequestBody QuizQuestionDto.UpdateQuizQuestionManuallyRequest request) {
        QuizQuestion response = questionService.updateQuestionManually(questionId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a quiz question for a quiz with AI
     * 
     * @apiNote {@code PATCH /api/quiz-question/ai/{questionId}}
     * 
     * @param questionId - id of question
     * @param request - request body
     * 
     * @return
     * {@code HTTP 200 QuizQuestion} - Quiz question updated successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see UpdateQuizQuestionWithAIRequest CreateQuizQuestionManuallyRequest class for request body structure
     * @see QuizQuestion QuizQuestion class for response body structure
     */
    @PatchMapping("/ai/{questionId}")
    public ResponseEntity<?> updateQuizQuestionWithAI(@PathVariable String questionId, @Valid @RequestBody QuizQuestionDto.UpdateQuizQuestionWithAIRequest request) {
        QuizQuestion response = questionService.updateQuestionWithAI(questionId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Delete a quiz question from a quiz
     * 
     * @apiNote {@code DELETE /api/quiz-question/{questionId}}
     * 
     * @param questionId - id of question
     * 
     * @return
     * {@code HTTP 200} - Quiz question deleted successfully
     */
    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> updateQuizQuestionWithAI(@PathVariable String questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}