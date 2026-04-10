package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.sudimango.MyStudyPal.entity.QuestionType;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizQuestion;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// @formatter:off
public class QuizDto {
    /**
     * Request
     */

    public record CreateQuizRequest(
        @NotBlank @Size(min = 1, max = 50) String name,
        @NotNull @Min(1) @Max(50) int numQuestions,
        @NotBlank String prompt,
        @Size(max = 150) String additionalInstructions,
        @NotEmpty @Size(min = 1, max = 4) Set<QuestionType> allowedTypes
    ) {}

    public record UpdateQuizRequest(
        @Size(max = 50) String name
    ) {}


    /**
     * Response
     */

    public record CreateQuizResponse(
        String quizId
    ) {}

    public record QuizResponse(
        String quizId,
        String name,
        Instant createdAt,
        Instant updatedAt,
        int totalQuestions,
        double totalPoints,
        int totalAttempts
    ) {
        public QuizResponse(Quiz quiz) {
            this(
                quiz.getQuizId(),
                quiz.getName(),
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
}
