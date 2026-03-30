package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import java.util.List;

import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizQuestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// @formatter:off
public class QuizDto {
    /**
     * Request
     */

    public record CreateQuizRequest(
        @NotBlank String name,
        @NotNull int timeLimitMinutes,
        @NotBlank String prompt,
        String additionalInstructions
    ) {}

    public record UpdateQuizRequest(
        String name
    ) {}


    /**
     * Response
     */

    public record CreateQuizResponse(
        String quizId
    ) {}

    public record QuizDetailsResponse(
        String quizId,
        String name,
        Integer timeLimitMinutes,
        Instant createdAt,
        Instant updatedAt,
        int totalQuestions,
        double totalPoints,
        List<QuizQuestion> questions,
        List<QuizAttempt> attempts
    ) {
        public QuizDetailsResponse(Quiz quiz) {
            this(
                quiz.getQuizId(),
                quiz.getName(),
                quiz.getTimeLimitMinutes(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt(),
                quiz.getQuizQuestions() != null ? 
                    quiz.getQuizQuestions().size() : 0,
                quiz.getQuizQuestions() != null ? 
                    quiz.getQuizQuestions().stream().mapToDouble(q -> q.getPoints()).sum() : 0,
                quiz.getQuizQuestions(),
                quiz.getQuizAttempts()
            );
        }
    }
}
