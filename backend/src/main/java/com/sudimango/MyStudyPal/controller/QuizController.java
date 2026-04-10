package com.sudimango.MyStudyPal.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.QuizDto;
import com.sudimango.MyStudyPal.dto.QuizDto.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.QuizDto.CreateQuizResponse;
import com.sudimango.MyStudyPal.dto.QuizDto.QuizResponse;
import com.sudimango.MyStudyPal.dto.QuizDto.UpdateQuizRequest;
import com.sudimango.MyStudyPal.service.study.quiz.QuizService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Create a new quiz for a study set
     * 
     * @apiNote {@code POST /quiz/{studySetId}}
     * 
     * @param studySetId - id of study set
     * @param createQuizRequest - request body
     * 
     * @see CreateQuizRequest CreateQuizRequest class for request body structure
     * @see CreateQuizResponse CreateQuizResponse class for response body structure
     * 
     * @return
     * {@code CreateQuizResponse HTTP 201} - Quiz created successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - Study set not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/{studySetId}")
    public ResponseEntity<QuizDto.CreateQuizResponse> createQuiz(@PathVariable String studySetId,
            @Valid @RequestBody QuizDto.CreateQuizRequest createQuizRequest) {
        QuizDto.CreateQuizResponse response = quizService.createQuiz(createQuizRequest, studySetId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all quizzes for a study set
     * 
     * @apiNote {@code GET /quiz/study-set/{studySetId}}
     * 
     * @param studySetId - id of study set
     * 
     * @see QuizDto.QuizListPage_QuizDetailsResponse QuizListPage_QuizDetailsResponse class for response body structure
     * 
     * @return
     * {@code List<QuizDto.QuizListPage_QuizDetailsResponse> HTTP 200} - list of quizzes
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - Study set not found
     */
    @GetMapping("/study-set/{studySetId}")
    public ResponseEntity<List<QuizResponse>> getQuizzesForStudySet(@PathVariable String studySetId) {
        List<QuizResponse> responses = quizService.getQuizzesForStudySet(studySetId);
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }

    /**
     * Get the details of one quiz
     * 
     * @apiNote {@code GET /quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @see OneQuizPage_QuizDetailsResponse OneQuizPage_QuizDetailsResponse class for response body structure
     * 
     * @return
     * {@code OneQuizPage_QuizDetailsResponse HTTP 200} - quiz details
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - quiz not found
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<QuizResponse> getOneQuizDetails(@PathVariable String quizId) {
        QuizResponse response = quizService.getOneQuizDetails(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Edit a quiz
     * 
     * @apiNote {@code PATCH /quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * @param updateQuizRequest - request body
     * 
     * @see UpdateQuizRequest UpdateQuizRequest class for request body structure
     * @see OneQuizPage_QuizDetailsResponse OneQuizPage_QuizDetailsResponse class for response body structure
     * 
     * @return
     * {@code OneQuizPage_QuizDetailsResponse HTTP 200} - quiz details
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - quiz not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PatchMapping("/{quizId}")
    public ResponseEntity<QuizResponse> updateQuiz(@PathVariable String quizId,
            @Valid @RequestBody QuizDto.UpdateQuizRequest updateQuizRequest) {
        QuizResponse response = quizService.updateQuiz(quizId, updateQuizRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Delete a quiz
     * 
     * @apiNote {@code DELETE /quiz/{quizId}}
     * 
     * @param quizId - id of quiz
     * 
     * @return
     * {@code HTTP 200} - Quiz deleted successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - quiz not found
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}