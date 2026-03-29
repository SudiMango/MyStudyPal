package com.sudimango.MyStudyPal.dto;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.entity.FlashcardSet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FlashcardDto {
    /**
     * Request
     */

    public record CreateFlashcardSetRequest(
        @NotBlank String name,
        String icon,
        @NotNull Integer numFlashcards,
        @NotBlank String prompt,
        String additionalInstructions
    ) {}

    public record UpdateFlashcardSetRequest(
        String name,
        String icon
    ) {}

    public record UpdateFlashcardRequest(
        String question,
        String answer,
        String hint,
        String instructions,
        String mode
    ) {}

    /**
     * Response
     */

    public record CreateFlashcardSetResponse(
        String flashcardSetId
    ) {}

    public record FlashcardSetResponse(
        String flashcardSetId,
        String name,
        String icon,
        Instant createdAt,
        Instant updatedAt,
        int totalCards,
        int reviewedCards,
        int starredCards
    ) {
        public FlashcardSetResponse(FlashcardSet set) {
            this(
                set.getFlashcardSetId(),
                set.getName(),
                set.getIcon(),
                set.getCreatedAt(),
                set.getUpdatedAt(),
                set.getFlashcards().size(),
                (int) set.getFlashcards().stream()
                    .filter(Flashcard::isReviewed)
                    .count(),
                (int) set.getFlashcards().stream()
                    .filter(Flashcard::isStarred)
                    .count()
            );
        }
    }
}
