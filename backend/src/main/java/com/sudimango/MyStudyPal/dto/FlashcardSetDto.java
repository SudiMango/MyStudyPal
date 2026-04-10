package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.entity.FlashcardSet;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// @formatter:off
public class FlashcardSetDto {
    /**
     * Request
     */

    public record CreateFlashcardSetRequest(
        @NotBlank @Size(min = 1, max = 50) String name,
        String icon,
        @NotNull @Min(1) @Max(50) int numFlashcards,
        @NotBlank @Size(min = 1, max = 300) String prompt,
        @Size(max = 150) String additionalInstructions
    ) {}

    public record UpdateFlashcardSetRequest(
        @Size(max = 50) String name,
        String icon
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
