package com.sudimango.MyStudyPal.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.request.quiz.UpdateQuestionRequest;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.service.quiz.QuizQuestionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quiz-question")
public class QuizQuestionController {

    @Autowired
    private QuizQuestionService questionService;

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<?> getAllQuestionsOfQuiz(@PathVariable String quizId) {
        try {
            List<QuizQuestion> questions = questionService.getAllQuestionsOfQuiz(quizId);
            return ResponseEntity.status(HttpStatus.OK).body(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable String questionId, 
                                            @Valid @RequestBody UpdateQuestionRequest request) {
        try {
            questionService.updateQuestion(questionId, request);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String questionId) {
        try {
            questionService.deleteQuestion(questionId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}