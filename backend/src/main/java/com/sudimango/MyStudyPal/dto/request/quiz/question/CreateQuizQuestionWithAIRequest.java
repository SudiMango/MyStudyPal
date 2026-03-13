package com.sudimango.MyStudyPal.dto.request.quiz.question;

import com.sudimango.MyStudyPal.entity.QuestionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateQuizQuestionWithAIRequest {
    @NotNull(message = "questionType field of class CreateQuizQuestionWithAIRequest cannot be null.")
    private QuestionType questionType;

    @NotNull(message = "orderIndex field of class CreateQuizQuestionWithAIRequest cannot be null.")
    private int orderIndex;

    @NotBlank(message = "prompt field of class CreateQuizQuestionWithAIRequest cannot be null or blank.")
    private String prompt;

    private String additionalInstructions;
}
