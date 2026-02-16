package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.request.studyset.CreateStudySetRequest;
import com.sudimango.MyStudyPal.dto.request.studyset.UpdateStudySetRequest;
import com.sudimango.MyStudyPal.dto.response.studyset.StudySetResponse;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.service.StudySetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/study-set")
public class StudySetController {

    @Autowired
    private StudySetService studySetService;

    /**
     * Create a new study set for the logged in user
     * @apiNote {@code POST /api/study-set/create}
     * @param studySetRequest - request body
     * @return
     * {@code HTTP 201} - Study set created successfully {StudySetResponse}
     * {@code HTTP 400} - Validation errors
     * {@code HTTP 500} - Internal server error
     */
    @PostMapping("/create")
    public ResponseEntity<?> createStudySet(@Valid @RequestBody CreateStudySetRequest studySetRequest,
                                            @AuthenticationPrincipal User user) {
        try {
            StudySetResponse response = studySetService.createStudySet(studySetRequest, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all study sets for the logged in user
     * * @apiNote {@code GET /api/study-set/get-all}
     */
    @GetMapping("/get-all")
    public ResponseEntity<?> getStudySets(@AuthenticationPrincipal User user) {
        try {
            List<StudySetResponse> studySets = studySetService.getStudySets(user.getUserId());
            return ResponseEntity.status(HttpStatus.OK).body(studySets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get a specific study set by ID
     * * @apiNote {@code GET /api/study-set/{studySetId}}
     */
    @GetMapping("/{studySetId}")
    public ResponseEntity<?> getOneStudySet(@PathVariable String studySetId) {
        try {
            StudySetResponse studySet = studySetService.getOneStudySet(studySetId);
            return ResponseEntity.status(HttpStatus.OK).body(studySet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update study set details (e.g., title, description)
     * * @apiNote {@code PATCH /api/study-set/{studySetId}}
     */
    @PatchMapping("/{studySetId}")
    public ResponseEntity<?> updateStudySet(@PathVariable String studySetId, 
                                            @Valid @RequestBody UpdateStudySetRequest request) {
        try {
            studySetService.updateStudySet(studySetId, request);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Delete a study set and potentially its nested flashcard sets
     * * @apiNote {@code DELETE /api/study-set/{studySetId}}
     */
    @DeleteMapping("/{studySetId}")
    public ResponseEntity<?> deleteStudySet(@PathVariable String studySetId) {
        try {
            studySetService.deleteStudySet(studySetId);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}