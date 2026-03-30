package com.sudimango.MyStudyPal.service.study;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.StudySetDto;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
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
    public StudySetDto.CreateStudySetResponse createStudySet(StudySetDto.CreateStudySetRequest request, User user) {
        StudySet studySet = StudySet.builder().name(request.name()).description(request.description())
                .icon((request.icon() != null && !request.icon().isBlank()) ? request.icon() : "📖").user(user).build();

        StudySet savedSet = studySetRepository.save(studySet);

        return new StudySetDto.CreateStudySetResponse(savedSet.getStudySetId());
    }

    /**
     * Retrieves all study sets belonging to a specific user.
     */
    public List<StudySetDto.StudySetResponse> getStudySets(String userId) {
        List<StudySet> studySets = studySetRepository.findAllByUser_UserId(userId);

        return studySets.stream().map(StudySetDto.StudySetResponse::new).collect(Collectors.toList());
    }

    /**
     * Retrieves a single study set by its ID.
     */
    public StudySetDto.StudySetResponse getOneStudySet(String studySetId) {
        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("StudySet with given id not found: " + studySetId));

        return new StudySetDto.StudySetResponse(studySet);
    }

    /**
     * Updates study set metadata (name, description, icon).
     */
    @Transactional
    public StudySetDto.StudySetResponse updateStudySet(String studySetId, StudySetDto.UpdateStudySetRequest request) {
        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("StudySet with given id not found: " + studySetId));

        if (request.name() != null && !request.name().isBlank()) {
            studySet.setName(request.name());
        }

        if (request.description() != null) {
            studySet.setDescription(request.description());
        }

        if (request.icon() != null && !request.icon().isBlank()) {
            studySet.setIcon(request.icon());
        }

        StudySet saved = studySetRepository.save(studySet);
        return new StudySetDto.StudySetResponse(saved);
    }

    /**
     * Deletes a study set. 
     * Due to CascadeType.ALL in the entity, this will also delete nested flashcards/documents.
     */
    @Transactional
    public void deleteStudySet(String studySetId) {
        if (!studySetRepository.existsById(studySetId)) {
            throw new ResourceNotFoundException("StudySet with given id not found: " + studySetId);
        }
        studySetRepository.deleteById(studySetId);
    }
}