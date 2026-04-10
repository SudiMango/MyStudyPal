package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.QuizQuestionDto.CreateQuizQuestionRequest;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.QuizQuestionResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.TakeQuizResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.UpdateQuizQuestionRequest;
import com.sudimango.MyStudyPal.service.study.quiz.QuizQuestionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/quiz-question")
public class QuizQuestionController {

    @Autowired
    private QuizQuestionService questionService;

    /**
     * Create a new quiz question for a quiz
     * 
     * @apiNote {@code POST /quiz-question/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param createQuizQuestionRequest - request body
     * 
     * @see CreateQuizQuestionRequest CreateQuizQuestionRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 201} - Quiz question created successfully
     * 
     * @throws
     * {@code HTTP 404} - Quiz not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/{quizId}")
    public ResponseEntity<QuizQuestionResponse> createQuizQuestion(@PathVariable String quizId,
            @Valid @RequestBody CreateQuizQuestionRequest createQuizQuestionRequest) {
        QuizQuestionResponse response = questionService.createQuestion(quizId, createQuizQuestionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a quiz question for a quiz
     * 
     * @apiNote {@code PATCH /quiz-question/{questionId}}
     * 
     * @param questionId - id of question
     * @param updateQuizQuestionRequest - request body
     * 
     * @see UpdateQuizQuestionRequest UpdateQuizQuestionRequest class for request body structure
     * @see QuizQuestionResponse QuizQuestionResponse class for response body structure
     * 
     * @return
     * {@code QuizQuestionResponse HTTP 200} - Quiz question updated successfully
     * 
     * @throws
     * {@code HTTP 404} - Question not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PatchMapping("/{questionId}")
    public ResponseEntity<QuizQuestionResponse> updateQuizQuestion(@PathVariable String questionId,
            @Valid @RequestBody UpdateQuizQuestionRequest updateQuizQuestionRequest) {
        QuizQuestionResponse response = questionService.updateQuestion(questionId, updateQuizQuestionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all the quiz questions for a quiz
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
    public ResponseEntity<List<QuizQuestionResponse>> getQuizQuestionsForQuiz(@PathVariable String quizId) {
        List<QuizQuestionResponse> response = questionService.getQuizQuestionsForQuiz(quizId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get the name and questions of a quiz without its answers for a quiz
     * 
     * @apiNote {@code GET /quiz-question/exam/{quizId}}
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
    @GetMapping("/exam/{quizId}")
    public ResponseEntity<TakeQuizResponse> getQuizQuestionsForTakingQuiz(@PathVariable String quizId) {
        TakeQuizResponse response = questionService.getQuizQuestionsForTakingQuiz(quizId);
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
    public ResponseEntity<?> deleteQuizQuestion(@PathVariable String questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}