package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.service.FlashcardService;

@RestController
@RequestMapping("/api/flashcard")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/{setId}")
    public ResponseEntity<?> getAllFlashcardsOfSet(@PathVariable String setId) {
        try {
            List<Flashcard> flashcards = flashcardService.getAllFlashcardsOfSet(setId);
            return ResponseEntity.status(HttpStatus.OK).body(flashcards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/review/{flashcardId}")
    public ResponseEntity<?> changeReviewStatus(@PathVariable String flashcardId) {
        try {
            flashcardService.changeReviewStatus(flashcardId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/star/{flashcardId}")
    public ResponseEntity<?> changeStarStatus(@PathVariable String flashcardId) {
        try {
            flashcardService.changeStarStatus(flashcardId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
