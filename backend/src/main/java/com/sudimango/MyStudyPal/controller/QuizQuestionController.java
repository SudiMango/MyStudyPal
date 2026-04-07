package com.sudimango.MyStudyPal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.QuizQuestionDto;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.CreateQuizQuestionManuallyRequest;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.CreateQuizQuestionWithAIRequest;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.QuizQuestionResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.TakeQuizResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.UpdateQuizQuestionManuallyRequest;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.UpdateQuizQuestionWithAIRequest;
import com.sudimango.MyStudyPal.service.study.quiz.QuizQuestionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/quiz-question")
public class QuizQuestionController {

    @Autowired
    private QuizQuestionService questionService;

    /**
     * Create a new quiz question for a quiz manually
     * 
     * @apiNote {@code POST /quiz-question/manual/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param createQuizQuestionManuallyRequest - request body
     * 
     * @see CreateQuizQuestionManuallyRequest CreateQuizQuestionManuallyRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 201} - Quiz question created successfully
     * 
     * @throws
     * {@code HTTP 404} - Quiz not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/manual/{quizId}")
    public ResponseEntity<QuizQuestionResponse> createQuizQuestionManually(@PathVariable String quizId,
            @Valid @RequestBody QuizQuestionDto.CreateQuizQuestionManuallyRequest createQuizQuestionManuallyRequest) {
        QuizQuestionResponse response = questionService.createQuestionManually(quizId,
                createQuizQuestionManuallyRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Create a new quiz question for a quiz with AI
     * 
     * @apiNote {@code POST /quiz-question/ai/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param createQuizQuestionWithAIRequest - request body
     * 
     * @see CreateQuizQuestionWithAIRequest CreateQuizQuestionWithAIRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 201} - Quiz question created successfully
     * 
     * @throws
     * {@code HTTP 404} - Quiz not found
     * {@code HTTP 422} - Validation errors with request body
     * {@code HTTP 503} - Error with AI
     */
    @PostMapping("/ai/{quizId}")
    public ResponseEntity<QuizQuestionResponse> createQuizQuestionWithAI(@PathVariable String quizId,
            @Valid @RequestBody QuizQuestionDto.CreateQuizQuestionWithAIRequest createQuizQuestionWithAIRequest) {
        QuizQuestionResponse response = questionService.createQuestionWithAI(quizId, createQuizQuestionWithAIRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a quiz question for a quiz manually
     * 
     * @apiNote {@code PATCH /quiz-question/manual/{questionId}}
     * 
     * @param questionId - id of question
     * @param updateQuizQuestionManuallyRequest - request body
     * 
     * @see UpdateQuizQuestionManuallyRequest UpdateQuizQuestionManuallyRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 200} - Quiz question updated successfully
     * 
     * @throws
     * {@code HTTP 404} - Question not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PatchMapping("/manual/{questionId}")
    public ResponseEntity<QuizQuestionResponse> updateQuizQuestionWithAI(@PathVariable String questionId,
            @Valid @RequestBody QuizQuestionDto.UpdateQuizQuestionManuallyRequest updateQuizQuestionManuallyRequest) {
        QuizQuestionResponse response = questionService.updateQuestionManually(questionId,
                updateQuizQuestionManuallyRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a quiz question for a quiz with AI
     * 
     * @apiNote {@code PATCH /quiz-question/ai/{questionId}}
     * 
     * @param questionId - id of question
     * @param updateQuizQuestionWithAIRequest - request body
     * 
     * @see UpdateQuizQuestionWithAIRequest UpdateQuizQuestionWithAIRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 200} - Quiz question updated successfully
     * 
     * @throws
     * {@code HTTP 404} - Question not found
     * {@code HTTP 422} - Validation errors with request body
     * {@code HTTP 503} - Error with AI
     */
    @PatchMapping("/ai/{questionId}")
    public ResponseEntity<QuizQuestionResponse> updateQuizQuestionWithAI(@PathVariable String questionId,
            @Valid @RequestBody QuizQuestionDto.UpdateQuizQuestionWithAIRequest updateQuizQuestionWithAIRequest) {
        QuizQuestionResponse response = questionService.updateQuestionWithAI(questionId,
                updateQuizQuestionWithAIRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get the name and questions of a quiz without its answers for a quiz
     * 
     * @apiNote {@code GET /quiz-question/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @see TakeQuizResponse TakeQuizResponse class for response body structure
     * 
     * @return
     * {@code TakeQuizResponse HTTP 200} - Quiz name and questions
     * 
     * @throws
     * {@code HTTP 404} - Quiz not found
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<TakeQuizResponse> getQuizQuestionsForQuiz(@PathVariable String quizId) {
        TakeQuizResponse response = questionService.getQuizQuestionsForQuiz(quizId);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a quiz question from a quiz
     * 
     * @apiNote {@code DEL /quiz-question/{questionId}}
     * 
     * @param questionId - id of question
     * 
     * @return
     * {@code HTTP 200} - Quiz question deleted successfully
     * 
     * @throws
     * {@code HTTP 404} - Question not found
     */
    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> updateQuizQuestionWithAI(@PathVariable String questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}