package com.sudimango.MyStudyPal.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sudimango.MyStudyPal.dto.request.quiz.quiz.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.request.quiz.quiz.UpdateQuizRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.CreateQuizResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.QuizDetailsResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.QuizResponse;
import com.sudimango.MyStudyPal.service.study.quiz.QuizService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Create a new quiz for a study set
     * 
     * @apiNote {@code POST /api/quiz/{studySetId}}
     * 
     * @param studySetId - id of study set
     * @param request - request body
     * 
     * @return
     * {@code HTTP 201 CreateQuizResponse} - Quiz created successfully
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see CreateQuizRequest CreateQuizRequest class for request body structure
     * @see CreateQuizResponse CreateQuizResponse class for response body structure
     */
    @PostMapping("/{studySetId}")
    public ResponseEntity<?> createQuiz(@PathVariable String studySetId,
                                        @Valid @RequestBody CreateQuizRequest request) throws JsonProcessingException {
        CreateQuizResponse response = quizService.createQuiz(request, studySetId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all quizzes for a study set
     * 
     * @apiNote {@code GET /api/quiz/get-all/{studySetId}}
     * 
     * @param studySetId - id of study set
     * 
     * @return
     * {@code HTTP 200 List<QuizResponse>} - list of quizzes
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see QuizResponse QuizResponse class for response body structure
     */
    @GetMapping("/get-all/{studySetId}")
    public ResponseEntity<?> getQuizzes(@PathVariable String studySetId) {
        List<QuizResponse> responses = quizService.getQuizzesForStudySet(studySetId);
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }

    /**
     * Get the details of one quiz
     * 
     * @apiNote {@code GET /api/quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @return
     * {@code HTTP 200 QuizDetailsResponse} - quiz details
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see QuizDetailsResponse QuizDetailsResponse class for response body structure
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getOneQuizDetails(@PathVariable String quizId) {
        QuizDetailsResponse response = quizService.getOneQuizDetails(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Edit a quiz
     * 
     * @apiNote {@code PATCH /api/quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param request - request body
     * 
     * @return
     * {@code HTTP 200 QuizResponse} - quiz details
     * {@code HTTP 422} - Validation errors with request body
     * 
     * @see UpdateQuizRequest UpdateQuizRequest class for request body structure
     * @see QuizResponse QuizResponse class for response body structure
     */
    @PatchMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable String quizId, 
                                        @Valid @RequestBody UpdateQuizRequest request) {
        QuizResponse response = quizService.updateQuiz(quizId, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Delete a quiz
     * 
     * @apiNote {@code DELETE /api/quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @return
     * {@code HTTP 204} - Quiz deleted successfully
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}