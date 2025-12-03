package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sudimango.MyStudyPal.entity.FlashcardSet;

public interface FlashcardSetRepository extends JpaRepository<FlashcardSet, String> {
    List<FlashcardSet> findAllByUser_UserId(String userId);
}
