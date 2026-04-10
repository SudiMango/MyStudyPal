package com.sudimango.MyStudyPal.service.study.flashcard;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.FlashcardSetDto.CreateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.FlashcardSetDto.CreateFlashcardSetResponse;
import com.sudimango.MyStudyPal.dto.FlashcardSetDto.FlashcardSetResponse;
import com.sudimango.MyStudyPal.dto.FlashcardSetDto.UpdateFlashcardSetRequest;
import com.sudimango.MyStudyPal.entity.FlashcardSet;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.repository.FlashcardSetRepository;
import com.sudimango.MyStudyPal.repository.StudySetRepository;

import jakarta.transaction.Transactional;

@Service
public class FlashcardSetService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardService flashcardService;

    @Autowired
    private StudySetRepository studySetRepository;

    @Transactional
    @PreAuthorize("@resourceAuthorizationService.canAccessStudySet(#studySetId, authentication.principal.userId)")
    public CreateFlashcardSetResponse createFlashcardSet(CreateFlashcardSetRequest request, String studySetId) {

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("Study set not found: " + studySetId));

        FlashcardSet set = FlashcardSet.builder().name(request.name())
                .icon((request.icon() != null && !request.icon().isEmpty()) ? request.icon() : "📖").studySet(studySet)
                .build();
        flashcardSetRepository.save(set);

        flashcardService.createFlashcardsForSet(request, set);

        return new CreateFlashcardSetResponse(set.getFlashcardSetId());
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessStudySet(#studySetId, authentication.principal.userId)")
    public List<FlashcardSetResponse> getFlashcardSetsForStudySet(String studySetId) {
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findAllByStudySet_StudySetId(studySetId);

        List<FlashcardSetResponse> responses = new ArrayList<>();
        for (FlashcardSet f : flashcardSets) {
            FlashcardSetResponse res = new FlashcardSetResponse(f);
            responses.add(res);
        }

        return responses;
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcardSet(#setId, authentication.principal.userId)")
    public FlashcardSetResponse getOneFlashcardSet(String setId) {
        FlashcardSet flashcardSet = flashcardSetRepository.findById(setId)
                .orElseThrow(() -> new RuntimeException("FlashcardSet with given id not found!"));

        return new FlashcardSetResponse(flashcardSet);
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcardSet(#setId, authentication.principal.userId)")
    public FlashcardSetResponse updateFlashcardSet(String setId, UpdateFlashcardSetRequest request) {
        FlashcardSet flashcardSet = flashcardSetRepository.findById(setId)
                .orElseThrow(() -> new RuntimeException("FlashcardSet with given id not found!"));

        if (request.name() != null && !request.name().isBlank()) {
            flashcardSet.setName(request.name());
        }

        if (request.icon() != null && !request.icon().isBlank()) {
            flashcardSet.setIcon(request.icon());
        }

        FlashcardSet saved = flashcardSetRepository.save(flashcardSet);
        return new FlashcardSetResponse(saved);
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcardSet(#setId, authentication.principal.userId)")
    public void deleteFlashcardSet(String setId) {
        if (!flashcardSetRepository.existsById(setId)) {
            throw new ResourceNotFoundException("FlashcardSet with given id not found: " + setId);
        }
        flashcardSetRepository.deleteById(setId);
    }

}
