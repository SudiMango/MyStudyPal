package com.sudimango.MyStudyPal.dto.response.studyset;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.StudySet;

import lombok.Getter;

@Getter
public class StudySetResponse {
    private String studySetId;
    private String name;
    private String description;
    private String icon;
    private Instant createdAt;
    private Instant updatedAt;
    
    // Summary data for the UI
    private int totalFlashcardSets;
    private int totalDocuments;
    private int totalQuizzes;

    public StudySetResponse(StudySet studySet) {
        this.studySetId = studySet.getStudySetId();
        this.name = studySet.getName();
        this.description = studySet.getDescription();
        this.icon = studySet.getIcon();
        this.createdAt = studySet.getCreatedAt();
        this.updatedAt = studySet.getUpdatedAt();
        
        // Calculate counts for the dashboard view
        this.totalFlashcardSets = studySet.getFlashcardSets() != null ? studySet.getFlashcardSets().size() : 0;
        this.totalDocuments = studySet.getDocuments() != null ? studySet.getDocuments().size() : 0;
        this.totalQuizzes = studySet.getQuizzes() != null ? studySet.getQuizzes().size() : 0;
    }
}