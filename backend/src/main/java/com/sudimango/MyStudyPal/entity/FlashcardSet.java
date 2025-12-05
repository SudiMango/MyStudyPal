package com.sudimango.MyStudyPal.entity;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "flashcard_sets")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlashcardSet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String flashcardSetId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private String icon = "📖";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @OneToMany(mappedBy = "flashcardSet", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Flashcard> flashcards;

    @Transient
    public int getTotalCards() {
        return flashcards != null ? flashcards.size() : 0;
    }

    @Transient
    public int getReviewedCards() {
        return flashcards != null ? (int) flashcards.stream()
            .filter(Flashcard::isReviewed)
            .count() : 0;
    }

    @Transient
    public int getStarredCards() {
        return flashcards != null ? (int) flashcards.stream()
            .filter(Flashcard::isStarred)
            .count() : 0;
    }
}
