package com.sudimango.MyStudyPal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.sudimango.MyStudyPal.entity.Flashcard;

public interface FlashcardRepository extends JpaRepository<Flashcard, String> {
    boolean existsByFlashcardIdAndFlashcardSet_StudySet_User_UserId(String flashcardId, String userId);

    @Modifying
    @Query("UPDATE Flashcard f SET f.orderIndex = f.orderIndex + 1 WHERE f.flashcardSet.flashcardSetId = :setId AND f.orderIndex >= :index")
    void incrementIndicesFrom(String setId, int index);

    @Modifying
    @Query("UPDATE Flashcard f SET f.orderIndex = f.orderIndex - 1 WHERE f.flashcardSet.flashcardSetId = :setId AND f.orderIndex > :index")
    void decrementIndicesFrom(String setId, int index);
}
