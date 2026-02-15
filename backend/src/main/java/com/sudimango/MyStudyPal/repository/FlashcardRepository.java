package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sudimango.MyStudyPal.entity.Flashcard;

public interface FlashcardRepository extends JpaRepository<Flashcard, String> {
    List<Flashcard> getByFlashcardSet_FlashcardSetIdOrderByCreatedAtAsc(String flashcardSetId);
}
