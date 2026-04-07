package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.FlashcardDto;
import com.sudimango.MyStudyPal.service.study.flashcard.FlashcardSetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/flashcard-set")
public class FlashcardSetController {

    @Autowired
    private FlashcardSetService flashcardSetService;

    /**
     * Create a new flashcard set with new flashcards
     * 
     * @apiNote {@code POST /flashcard-set/{studySetId}}
     * 
     * @param studySetId - id of study set
     * @param flashcardSetRequest - request body
     * 
     * @see FlashcardDto.CreateFlashcardSetRequest CreateFlashcardSetRequest class for request body structure
     * @see FlashcardDto.CreateFlashcardSetResponse CreateFlashcardSetResponse class for response body structure
     * 
     * @return
     * {@code HTTP 201} - Flashcard set and flashcards created successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - Study set not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/{studySetId}")
    public ResponseEntity<FlashcardDto.CreateFlashcardSetResponse> createFlashcardSet(@PathVariable String studySetId,
            @Valid @RequestBody FlashcardDto.CreateFlashcardSetRequest flashcardSetRequest) {
        FlashcardDto.CreateFlashcardSetResponse response = flashcardSetService.createFlashcardSet(flashcardSetRequest,
                studySetId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all the flashcard sets in a study set
     * 
     * @apiNote {@code GET /flashcard-set/{studySetId}}
     * 
     * @param studySetId - id of study set
     * 
     * @see FlashcardDto.FlashcardSetResponse FlashcardSetResponse class for response body structure
     * 
     * @return
     * {@code List<FlashcardDto.FlashcardSetResponse> HTTP 200} - Retrieved all flashcard sets successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - Study set not found
     */
    @GetMapping("/study-set/{studySetId}")
    public ResponseEntity<List<FlashcardDto.FlashcardSetResponse>> getFlashcardSets(@PathVariable String studySetId) {
        List<FlashcardDto.FlashcardSetResponse> flashcardSets = flashcardSetService
                .getFlashcardSetsForStudySet(studySetId);
        return ResponseEntity.status(HttpStatus.OK).body(flashcardSets);
    }

    /**
     * Get a particular flashcard set
     * 
     * @apiNote {@code GET /flashcard-set/{flashcardSetId}}
     * 
     * @param flashcardSetId - id of flashcard set
     * 
     * @see FlashcardDto.FlashcardSetResponse FlashcardSetResponse class for response body structure
     * 
     * @return
     * {@code HTTP 200} - Retrieved flashcard set successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - flashcard set not found
     */
    @GetMapping("/{flashcardSetId}")
    public ResponseEntity<FlashcardDto.FlashcardSetResponse> getOneFlashcardSet(@PathVariable String flashcardSetId) {
        FlashcardDto.FlashcardSetResponse flashcardSet = flashcardSetService.getOneFlashcardSet(flashcardSetId);
        return ResponseEntity.status(HttpStatus.OK).body(flashcardSet);
    }

    /**
     * Update a flashcard set
     * 
     * @apiNote {@code PATCH /flashcard-set/{flashcardSetId}}
     * 
     * @param flashcardSetId - id of flashcard set
     * @param updateFlashcardSetRequest - request body
     * 
     * @see FlashcardDto.UpdateFlashcardSetRequest UpdateFlashcardSetRequest class for request body structure
     * @see FlashcardDto.FlashcardSetResponse FlashcardSetResponse class for response body structure
     * 
     * @return
     * {@code FlashcardSetResponse HTTP 200} - Updated flashcard set successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - flashcard set not found
     * {@code HTTP 422} - Validation errors with request body
     */
    @PatchMapping("/{flashcardSetId}")
    public ResponseEntity<?> updateFlashcardSet(@PathVariable String flashcardSetId,
            @Valid @RequestBody FlashcardDto.UpdateFlashcardSetRequest updateFlashcardSetRequest) {
        FlashcardDto.FlashcardSetResponse set = flashcardSetService.updateFlashcardSet(flashcardSetId,
                updateFlashcardSetRequest);
        return ResponseEntity.status(HttpStatus.OK).body(set);
    }

    /**
     * Delete a flashcard set
     * 
     * @apiNote {@code DEL /flashcard-set/{flashcardSetId}}
     * 
     * @param flashcardSetId - id of flashcard set
     * 
     * @return
     * {@code HTTP 200} - Deleted flashcard set successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - flashcard set not found
     */
    @DeleteMapping("/{flashcardSetId}")
    public ResponseEntity<?> deleteFlashcardSet(@PathVariable String flashcardSetId) {
        flashcardSetService.deleteFlashcardSet(flashcardSetId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
