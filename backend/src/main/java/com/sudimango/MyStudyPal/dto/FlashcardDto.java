package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import com.sudimango.MyStudyPal.entity.Flashcard;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// @formatter:off
public class FlashcardDto {
    /**
     * Request
     */

    public record CreateFlashcardRequest(
        @NotBlank @Size(min = 1) String question,
        @NotBlank @Size(min = 1) String answer,
        @Size(max = 25) String hint,
        @NotNull @Min(1) int orderIndex
    ) {}

    public record UpdateFlashcardRequest(
        String question,
        String answer,
        @Size(max = 25) String hint,
        @Min(1) int orderIndex
    ) {}

    /**
     * Response
     */

    public record FlashcardResponse(
        String flashcardId,
        String question,
        String answer,
        String hint,
        boolean isReviewed,
        boolean isStarred,
        Instant createdAt,
        Instant updatedAt,
        int orderIndex
    ) {
        public FlashcardResponse(Flashcard flashcard) {
            this(
                flashcard.getFlashcardId(),
                flashcard.getQuestion(),
                flashcard.getAnswer(),
                flashcard.getHint(),
                flashcard.isReviewed(),
                flashcard.isStarred(),
                flashcard.getCreatedAt(),
                flashcard.getUpdatedAt(),
                flashcard.getOrderIndex()
            );
        }
    }
}
