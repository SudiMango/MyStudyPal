package com.sudimango.MyStudyPal.dto.response;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.entity.FlashcardSet;

import lombok.Getter;

@Getter
public class FlashcardSetResponse {
    private String flashcardSetId;
    private String name;
    private String icon;
    private Instant createdAt;
    private Instant updatedAt;
    private int totalCards;
    private int reviewedCards;
    private int starredCards;

    public FlashcardSetResponse(FlashcardSet set) {
        this.flashcardSetId = set.getFlashcardSetId();
        this.name = set.getName();
        this.icon = set.getIcon();
        this.createdAt = set.getCreatedAt();
        this.updatedAt = set.getUpdatedAt();
        this.totalCards = set.getFlashcards().size();
        this.reviewedCards = (int) set.getFlashcards().stream()
            .filter(Flashcard::isReviewed)
            .count();
        this.starredCards = (int) set.getFlashcards().stream()
            .filter(Flashcard::isStarred)
            .count();
    }
}
