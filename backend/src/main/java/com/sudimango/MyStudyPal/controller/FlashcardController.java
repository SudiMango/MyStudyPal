package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.FlashcardDto;
import com.sudimango.MyStudyPal.service.study.flashcard.FlashcardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/flashcard")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    /**
     * Get all flashcards of a flashcard set
     * 
     * @apiNote {@code GET /flashcard/{flashcardSetId}}
     * 
     * @param flashcardSetId - id of flashcard set
     * 
     * @see FlashcardDto.FlashcardResponse FlashcardResponse class for response body structure
     * 
     * @return
     * {@code List<FlashcardDto.FlashcardResponse> HTTP 200} - Flashcards retrieved successfully
     * 
     * @throws
     * {@code HTTP 404} - flashcard set not found
     */
    @GetMapping("/{flashcardSetId}")
    public ResponseEntity<List<FlashcardDto.FlashcardResponse>> getAllFlashcardsOfSet(
            @PathVariable String flashcardSetId) {
        List<FlashcardDto.FlashcardResponse> flashcards = flashcardService.getAllFlashcardsOfSet(flashcardSetId);
        return ResponseEntity.status(HttpStatus.OK).body(flashcards);
    }

    /**
     * Review/unreview a flashcard
     * 
     * @apiNote {@code PATCH /flashcard/review/{flashcardId}}
     * 
     * @param flashcardId - id of flashcard
     * 
     * @return
     * {@code HTTP 200} - Flashcard reviewed/unreviewed successfully
     * 
     * @throws
     * {@code HTTP 404} - flashcard not found
     */
    @PatchMapping("/review/{flashcardId}")
    public ResponseEntity<?> changeReviewStatus(@PathVariable String flashcardId) {
        flashcardService.changeReviewStatus(flashcardId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    /**
     * Star/unstar a flashcard
     * 
     * @apiNote {@code PATCH /flashcard/star/{flashcardId}}
     * 
     * @param flashcardId - id of flashcard
     * 
     * @return
     * {@code HTTP 200} - Flashcard starred/unstarred successfully
     * 
     * @throws
     * {@code HTTP 404} - flashcard not found
     */
    @PatchMapping("/star/{flashcardId}")
    public ResponseEntity<?> changeStarStatus(@PathVariable String flashcardId) {
        flashcardService.changeStarStatus(flashcardId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    /**
     * Update a flashcard
     * 
     * @apiNote {@code PATCH /flashcard/{flashcardSetId}}
     * 
     * @param flashcardSetId - id of flashcard set
     * @param updateFlashcardRequest - request body
     * 
     * @see FlashcardDto.UpdateFlashcardRequest UpdateFlashcardRequest class for request body structure
     * @see FlashcardDto.FlashcardResponse FlashcardResponse class for response body structure
     * 
     * @return
     * {@code FlashcardResponse HTTP 200} - Flashcard updated successfully
     * 
     * @throws
     * {@code HTTP 404} - flashcard set not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PatchMapping("/{flashcardId}")
    public ResponseEntity<FlashcardDto.FlashcardResponse> updateFlashcard(@PathVariable String flashcardId,
            @Valid @RequestBody FlashcardDto.UpdateFlashcardRequest updateFlashcardRequest) {
        FlashcardDto.FlashcardResponse flashcard = flashcardService.updateFlashcard(flashcardId,
                updateFlashcardRequest);
        return ResponseEntity.status(HttpStatus.OK).body(flashcard);
    }

    /**
    * Delete a flashcard
    * 
    * @apiNote {@code DEL /flashcard/{flashcardId}}
    * 
    * @param flashcardId - id of flashcard
    * 
    * @return
    * {@code HTTP 200} - Flashcard deleted successfully
    * 
    * @throws
    * {@code HTTP 404} - flashcard not found
    */
    @DeleteMapping("/{flashcardId}")
    public ResponseEntity<?> deleteFlashcard(@PathVariable String flashcardId) {
        flashcardService.deleteFlashcard(flashcardId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
