package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.request.flashcard.CreateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.request.flashcard.UpdateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.response.CreateFlashcardSetResponse;
import com.sudimango.MyStudyPal.dto.response.FlashcardSetResponse;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.service.FlashcardSetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/flashcard-set")
public class FlashcardSetController {

    @Autowired
    private FlashcardSetService flashcardSetService;

    // TODO: handle errors and http codes properly

    /**
     * Create a new flashcard set with new flashcards from its associated document id
     * 
     * @apiNote {@code POST /api/flashcard-set/create}
     * 
     * @param flashcardSetRequest - request body
     * @see CreateFlashcardSetRequest CreateFlashcardSetRequest class for request body structure
     * 
     * @return
     * {@code HTTP 201} - Flashcard set and flashcards created successfully {null}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while creating the flashcard set {error: ""}
     * 
     * @see CreateFlashcardSetResponse CreateFlashcardSetResponse class for response body structure
     */
    @PostMapping("/create/{studySetId}")
    public ResponseEntity<?> createFlashcardSet(@PathVariable String studySetId,
                                                @Valid @RequestBody CreateFlashcardSetRequest flashcardSetRequest,
                                                @AuthenticationPrincipal User user) {
        try {
            CreateFlashcardSetResponse response = flashcardSetService.createFlashcardSet(flashcardSetRequest, studySetId, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all the flashcard sets for the logged in user
     * 
     * @apiNote {@code GET /api/flashcard-set/get-all}
     * 
     * @return
     * {@code HTTP 200} - Retrieved all flashcard sets successfully {FlashcardSetResponse[]}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while retrieving flashcard sets {error: ""}
     * 
     * @see FlashcardSetResponse FlashcardSetResponse class for response body structure
     */
    @GetMapping("/get-all/{studySetId}")
    public ResponseEntity<?> getFlashcardSets(@PathVariable String studySetId) {
        try {
            List<FlashcardSetResponse> flashcardSets = flashcardSetService.getFlashcardSetsForStudySet(studySetId);
            return ResponseEntity.status(HttpStatus.OK).body(flashcardSets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get a particular flashcard set for the logged in user
     * 
     * @apiNote {@code GET /api/flashcard-set/{setId}}
     * 
     * @return
     * {@code HTTP 200} - Retrieved flashcard set successfully {FlashcardSetResponse}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while retrieving flashcard set {error: ""}
     * 
     * @see FlashcardSetResponse FlashcardSetResponse class for response body structure
     */
    @GetMapping("/{setId}")
    public ResponseEntity<?> getOneFlashcardSet(@PathVariable String setId) {
        try {
            FlashcardSetResponse flashcardSet = flashcardSetService.getOneFlashcardSet(setId);
            return ResponseEntity.status(HttpStatus.OK).body(flashcardSet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update a particular flashcard set for the logged in user
     * 
     * @apiNote {@code PATCH /api/flashcard-set/{setId}}
     * 
     * @return
     * {@code HTTP 200} - Updated flashcard set successfully {null}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while updating flashcard set {error: ""}
     */
    @PatchMapping("/{setId}")
    public ResponseEntity<?> updateFlashcardSet(@PathVariable String setId, 
                                                @Valid @RequestBody UpdateFlashcardSetRequest request) {
        try {
            flashcardSetService.updateFlashcardSet(setId, request);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Delete a particular flashcard set for the logged in user
     * 
     * @apiNote {@code DELETE /api/flashcard-set/{setId}}
     * 
     * @return
     * {@code HTTP 200} - Deleted flashcard set successfully {null}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while deleting flashcard set {error: ""}
     */
    @DeleteMapping("/{setId}")
    public ResponseEntity<?> deleteFlashcardSet(@PathVariable String setId) {
        try {
            flashcardSetService.deleteFlashcardSet(setId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
