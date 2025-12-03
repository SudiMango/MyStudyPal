package com.sudimango.MyStudyPal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "flashcards")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String flashcardId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false)
    @Builder.Default
    private boolean isReviewed = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean isStarred = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_set_id", nullable = false)
    private FlashcardSet flashcardSet;
}
