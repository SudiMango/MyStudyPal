package com.sudimango.MyStudyPal.dto.request.flashcard;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateFlashcardSetRequest {
    @NotBlank(message = "Name field in CreateFlashcardSetWithFlashcards class cannot be null or blank.")
    private String name;
    
    private String icon;

    @NotBlank(message = "DocumentId field in CreateFlashcardSetWithFlashcards class cannot be null or blank.")
    private String documentId;

    @NotNull(message = "NumFlashcards field in CreateFlashcardSetWithFlashcards class cannot be null.")
    private Integer numFlashcards;

    @NotNull(message = "UseFullDocument field in CreateFlashcardSetWithFlashcards class cannot be null.")
    private Boolean useFullDocument;


    private String prompt;
    private String additionalInstructions;
}
