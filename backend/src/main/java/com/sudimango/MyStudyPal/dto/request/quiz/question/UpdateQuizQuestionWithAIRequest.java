package com.sudimango.MyStudyPal.dto.request.quiz.question;

import com.sudimango.MyStudyPal.entity.QuestionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateQuizQuestionWithAIRequest {
    @NotNull(message = "questionType field in class UpdateQuizQuestionWithAIRequest cannot be null.")
    private QuestionType questionType;

    @NotNull(message = "orderIndex field in class UpdateQuizQuestionWithAIRequest cannot be null.")
    private int orderIndex;

    @NotBlank(message = "prompt field of class UpdateQuizQuestionWithAIRequest cannot be null or blank.")
    private String prompt;
}
