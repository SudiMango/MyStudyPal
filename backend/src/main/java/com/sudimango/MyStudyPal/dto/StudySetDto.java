package com.sudimango.MyStudyPal.dto;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.StudySet;

import jakarta.validation.constraints.NotBlank;

// @formatter:off
public class StudySetDto {
    /**
     * Request
     */

    public record CreateStudySetRequest(
        @NotBlank String name,
        String icon,
        String description
    ) {}

    public record UpdateStudySetRequest(
        String name,
        String icon,
        String description
    ) {}

    /**
     * Response
     */

    public record CreateStudySetResponse(
        String studySetId
    ) {}

    public record StudySetResponse(
        String studySetId,
        String name,
        String description,
        String icon,
        Instant createdAt,
        Instant updatedAt,
        
        int totalFlashcardSets,
        int totalDocuments,
        int totalQuizzes
    ) {
        public StudySetResponse(StudySet set) {
            this(
                set.getStudySetId(),
                set.getName(),
                set.getDescription(),
                set.getIcon(),
                set.getCreatedAt(),
                set.getUpdatedAt(),
                set.getFlashcardSets() != null ? 
                    set.getFlashcardSets().size() : 0,
                set.getDocuments() != null ? 
                    set.getDocuments().size() : 0,
                set.getQuizzes() != null ? 
                    set.getQuizzes().size() : 0
            );
        }
    }
}
