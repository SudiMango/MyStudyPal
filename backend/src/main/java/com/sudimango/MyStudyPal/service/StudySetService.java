package com.sudimango.MyStudyPal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.request.studyset.CreateStudySetRequest;
import com.sudimango.MyStudyPal.dto.request.studyset.UpdateStudySetRequest;
import com.sudimango.MyStudyPal.dto.response.studyset.StudySetResponse;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.StudySetRepository;

import jakarta.transaction.Transactional;

@Service
public class StudySetService {

    @Autowired
    private StudySetRepository studySetRepository;

    /**
     * Creates a new study set linked to the authenticated user.
     */
    @Transactional
    public StudySetResponse createStudySet(CreateStudySetRequest request, User user) {
        StudySet studySet = StudySet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon((request.getIcon() != null && !request.getIcon().isBlank()) ? request.getIcon() : "📖")
                .user(user)
                .build();

        StudySet savedSet = studySetRepository.save(studySet);
        
        // Return the full response including generated ID and timestamps
        return new StudySetResponse(savedSet);
    }

    /**
     * Retrieves all study sets belonging to a specific user.
     */
    public List<StudySetResponse> getStudySets(String userId) {
        List<StudySet> studySets = studySetRepository.findAllByUser_UserId(userId);

        return studySets.stream()
                .map(StudySetResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single study set by its ID.
     */
    public StudySetResponse getOneStudySet(String studySetId) {
        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("StudySet with given id not found: " + studySetId));

        return new StudySetResponse(studySet);
    }

    /**
     * Updates study set metadata (name, description, icon).
     */
    @Transactional
    public void updateStudySet(String studySetId, UpdateStudySetRequest request) {
        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("StudySet with given id not found: " + studySetId));

        if (request.getName() != null && !request.getName().isBlank()) {
            studySet.setName(request.getName());
        }

        if (request.getDescription() != null) {
            studySet.setDescription(request.getDescription());
        }

        if (request.getIcon() != null && !request.getIcon().isBlank()) {
            studySet.setIcon(request.getIcon());
        }

        studySetRepository.save(studySet);
    }

    /**
     * Deletes a study set. 
     * Due to CascadeType.ALL in the entity, this will also delete nested flashcards/documents.
     */
    @Transactional
    public void deleteStudySet(String studySetId) {
        if (!studySetRepository.existsById(studySetId)) {
            throw new RuntimeException("StudySet not found, cannot delete.");
        }
        studySetRepository.deleteById(studySetId);
    }
}