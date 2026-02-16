package com.sudimango.MyStudyPal.dto.request.quiz.attempt;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerSubmission {
    @NotBlank(message = "questionId field in AnswerSubmission cannot be null or blank.")
    private String questionId;

    private Object userAnswer;
}