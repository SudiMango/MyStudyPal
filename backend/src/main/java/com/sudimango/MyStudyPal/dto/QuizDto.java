package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.sudimango.MyStudyPal.dto.QuizAttemptDto.ListAttemptPage_QuizAttemptDetailsResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.QuizQuestionResponse;
import com.sudimango.MyStudyPal.entity.Quiz;
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

    public record QuizListPage_QuizDetailsResponse(
        String quizId,
        String name,
        Integer timeLimitMinutes,
        Instant createdAt,
        Instant updatedAt,
        int totalQuestions,
        double totalPoints,
        int totalAttempts
    ) {
        public QuizListPage_QuizDetailsResponse(Quiz quiz) {
            this(
                quiz.getQuizId(),
                quiz.getName(),
                quiz.getTimeLimitMinutes(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt(),
                Optional.ofNullable(quiz.getQuizQuestions()).map(List::size).orElse(0),
                Optional.ofNullable(quiz.getQuizQuestions())
                        .map(qs -> qs.stream().mapToDouble(QuizQuestion::getPoints).sum())
                        .orElse(0.0),
                Optional.ofNullable(quiz.getQuizAttempts()).map(List::size).orElse(0)
            );
        }
    }

    public record OneQuizPage_QuizDetailsResponse(
        String quizId,
        String name,
        Integer timeLimitMinutes,
        Instant createdAt,
        Instant updatedAt,
        int totalQuestions,
        double totalPoints,
        int totalAttempts,
        List<QuizQuestionResponse> questions,
        List<ListAttemptPage_QuizAttemptDetailsResponse> attempts
    ) {
        public OneQuizPage_QuizDetailsResponse(Quiz quiz) {
            this(
                quiz.getQuizId(),
                quiz.getName(),
                quiz.getTimeLimitMinutes(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt(),
                Optional.ofNullable(quiz.getQuizQuestions()).map(List::size).orElse(0),
                Optional.ofNullable(quiz.getQuizQuestions())
                        .map(qs -> qs.stream().mapToDouble(QuizQuestion::getPoints).sum())
                        .orElse(0.0),
                Optional.ofNullable(quiz.getQuizAttempts()).map(List::size).orElse(0),
                quiz.getQuizQuestions() == null ? List.of() : 
                    quiz.getQuizQuestions().stream().map(QuizQuestionResponse::new).toList(),
                quiz.getQuizAttempts() == null ? List.of() : 
                    quiz.getQuizAttempts().stream().map(ListAttemptPage_QuizAttemptDetailsResponse::new).toList()
            );
        }
    }
}
