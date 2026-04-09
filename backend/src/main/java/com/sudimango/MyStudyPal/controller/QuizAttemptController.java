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

import com.sudimango.MyStudyPal.dto.QuizAttemptDto;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.CreateQuizAttemptRequest;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.CreateQuizAttemptResponse;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.QuizAttemptAnswerResponse;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.QuizAttemptResponse;
import com.sudimango.MyStudyPal.service.study.quiz.QuizAttemptService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/quiz-attempt")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService attemptService;

    /**
     * Create a new attempt for a quiz
     * 
     * @apiNote {@code POST /quiz-attempt/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param createQuizAttemptRequest - request body
     * 
     * @see CreateQuizAttemptRequest CreateQuizAttemptRequest class for request body structure
     * @see CreateQuizAttemptResponse CreateQuizAttemptResponse class for response body structure
     * 
     * @return
     * {@code CreateQuizAttemptResponse HTTP 201} - Quiz attempt created successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - Quiz not found
     * {@code HTTP 422} - Validation errors with request body
     * {@code HTTP 503} - Error with AI
     */
    @PostMapping("/{quizId}")
    public ResponseEntity<CreateQuizAttemptResponse> submitAttempt(@PathVariable String quizId,
            @Valid @RequestBody QuizAttemptDto.CreateQuizAttemptRequest createQuizAttemptRequest) {
        CreateQuizAttemptResponse response = attemptService.submitAttempt(quizId, createQuizAttemptRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all quiz attempts for one quiz
     * 
     * @apiNote {@code GET /quiz-attempt/quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @see QuizAttemptResponse QuizAttemptResponse class for response body structure
     * 
     * @return
     * {@code List<QuizAttemptResponse> HTTP 200} - all quiz attempts
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - quiz not found
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizAttemptResponse>> getAllAttemptsForQuiz(@PathVariable String quizId) {
        List<QuizAttemptResponse> response = attemptService.getAllAttemptsForQuiz(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Get details of one attempt for a quiz
     * 
     * @apiNote {@code GET /quiz-attempt/attempt/{attemptId}}
     * 
     * @param attemptId - id of attempt
     * 
     * @see QuizAttemptResponse QuizAttemptResponse class for response body structure
     * 
     * @return
     * {@code QuizAttemptResponse HTTP 200} - details of quiz attempt
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - attempt not found
     */
    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<QuizAttemptResponse> getOneAttempt(@PathVariable String attemptId) {
        QuizAttemptResponse response = attemptService.getOneAttempt(attemptId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
    * Get all answers for one quiz attempt
    * 
    * @apiNote {@code GET /quiz-attempt/attempt/{attemptId}}
    * 
    * @param attemptId - id of attempt
    * 
    * @see QuizAttemptAnswerResponse QuizAttemptAnswerResponse class for response body structure
    * 
    * @return
    * {@code List<QuizAttemptAnswerResponse> HTTP 200} - details of quiz attempt
    * 
    * @throws
    * {@code HTTP 403} - Current user doesn't own this resource
    * {@code HTTP 404} - attempt not found
    */
    @GetMapping("/answers/{attemptId}")
    public ResponseEntity<List<QuizAttemptAnswerResponse>> getAttemptAnswers(@PathVariable String attemptId) {
        List<QuizAttemptAnswerResponse> response = attemptService.getAttemptAnswers(attemptId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}