package com.sudimango.MyStudyPal.dto.request.quiz.quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class CreateQuizRequest {
    @NotBlank(message = "name field in CreateQuizRequest class cannot be null or blank.")
    private String name;

    @NotNull(message = "timeLimitMinutes field in CreateQuizRequest class cannot be null.")
    private int timeLimitMinutes;

    @NotBlank(message = "Prompt for flashcard set generation cannot be null or blank.")
    private String prompt;

    private String additionalInstructions;
}