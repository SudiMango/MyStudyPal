package com.sudimango.MyStudyPal.dto;

import java.util.List;

import com.sudimango.MyStudyPal.entity.QuestionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class QuizQuestionDto {

    /**
     * Request
     */

    public record CreateQuizQuestionManuallyRequest(
        @NotNull QuestionType questionType,
        @NotBlank String questionText,
        @NotEmpty List<String> options,
        @NotEmpty List<String> correctAnswers,
        String hint,
        @NotNull Double points,
        @NotNull Integer orderIndex
    ) {}

    public record CreateQuizQuestionWithAIRequest(
        @NotNull QuestionType questionType,
        @NotNull Integer orderIndex,
        @NotBlank String prompt,
        String additionalInstructions
    ) {}

    public record UpdateQuizQuestionManuallyRequest(
        QuestionType questionType,
        String questionText,
        List<String> options,
        List<String> correctAnswers,
        String hint,
        Double points,
        Integer orderIndex
    ) {}

    public record UpdateQuizQuestionWithAIRequest(
        @NotNull QuestionType questionType,
        @NotNull Integer orderIndex,
        @NotBlank String prompt
    ) {}
}
