package com.sudimango.MyStudyPal.dto.request.flashcard;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateFlashcardSetRequest {
    @NotBlank(message = "Name field in CreateFlashcardSetRequest class cannot be null or blank.")
    private String name;
    
    private String icon;

    @NotNull(message = "NumFlashcards field in CreateFlashcardSetRequest class cannot be null.")
    private Integer numFlashcards;

    @NotBlank(message = "Prompt for flashcard set generation cannot be null or blank.")
    private String prompt;

    private String additionalInstructions;
}
