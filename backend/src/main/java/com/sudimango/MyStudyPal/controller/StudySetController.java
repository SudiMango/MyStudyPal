package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sudimango.MyStudyPal.dto.StudySetDto;
import com.sudimango.MyStudyPal.dto.StudySetDto.CreateStudySetRequest;
import com.sudimango.MyStudyPal.dto.StudySetDto.CreateStudySetResponse;
import com.sudimango.MyStudyPal.dto.StudySetDto.StudySetResponse;
import com.sudimango.MyStudyPal.dto.StudySetDto.UpdateStudySetRequest;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.service.study.StudySetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/study-set")
public class StudySetController {

    @Autowired
    private StudySetService studySetService;

    /**
     * Create a new study set for the logged in user
     * 
     * @apiNote {@code POST /study-set}
     * 
     * @param studySetRequest - request body
     * @param user - Current logged in user
     * 
     * @see CreateStudySetRequest CreateStudySetRequest for request body structure
     * @see CreateStudySetResponse CreateStudySetResponse for response body structure
     * 
     * @return
     * {@code CreateStudySetResponse HTTP 201} - Study set created successfully
     * 
     * @throws
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("")
    public ResponseEntity<CreateStudySetResponse> createStudySet(
            @Valid @RequestBody CreateStudySetRequest studySetRequest, @AuthenticationPrincipal User user) {
        CreateStudySetResponse response = studySetService.createStudySet(studySetRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all study sets for the logged in user
     * 
     * @apiNote {@code GET /study-set}
     * 
     * @param user - Current logged in user
     * 
     * @see StudySetResponse StudySetResponse for response body structure
     * 
     * @return
     * {@code List<StudySetResponse> HTTP 200} - Study sets retrieved successfully
     */
    @GetMapping("")
    public ResponseEntity<List<StudySetResponse>> getStudySets(@AuthenticationPrincipal User user) {
        List<StudySetResponse> studySets = studySetService.getStudySets(user.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(studySets);
    }

    /**
     * Gets a particular study set
     * 
     * @apiNote {@code GET /study-set/{studySetId}}
     * 
     * @param studySetId - id of study set
     * 
     * @see StudySetResponse StudySetResponse for response body structure
     * 
     * @return
     * {@code StudySetResponse HTTP 200} - Study set retrieved successfully
     * 
     * @throws
     * {@code HTTP 403} - Current user doesn't own this resource
     * {@code HTTP 404} - study set not found
     */
    @GetMapping("/{studySetId}")
    public ResponseEntity<StudySetResponse> getOneStudySet(@PathVariable String studySetId) {
        StudySetResponse studySet = studySetService.getOneStudySet(studySetId);
        return ResponseEntity.status(HttpStatus.OK).body(studySet);
    }

    /**
    * Update study set details 
    * 
    * @apiNote {@code PATCH /study-set/{studySetId}}
    * 
    * @param studySetId - id of study set
    * @param request - request body
    * 
    * @see UpdateStudySetRequest UpdateStudySetRequest for request body structure
    * @see StudySetResponse StudySetResponse for response body structure
    * 
    * @return
    * {@code StudySetResponse HTTP 200} - Study set updated successfully
    * 
    * @throws
    * {@code HTTP 403} - Current user doesn't own this resource
    * {@code HTTP 404} - study set not found
    */
    @PatchMapping("/{studySetId}")
    public ResponseEntity<StudySetResponse> updateStudySet(@PathVariable String studySetId,
            @Valid @RequestBody UpdateStudySetRequest request) {
        StudySetDto.StudySetResponse studySet = studySetService.updateStudySet(studySetId, request);
        return ResponseEntity.status(HttpStatus.OK).body(studySet);
    }

    /**
    * Delete a study set
    * 
    * @apiNote {@code DEL /study-set/{studySetId}}
    * 
    * @param studySetId - id of study set
    * 
    * @return
    * {@code HTTP 200} - Study set deleted successfully
    * 
    * @throws
    * {@code HTTP 403} - Current user doesn't own this resource
    * {@code HTTP 404} - study set not found
    */
    @DeleteMapping("/{studySetId}")
    public ResponseEntity<?> deleteStudySet(@PathVariable String studySetId) {
        studySetService.deleteStudySet(studySetId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}