package com.sudimango.MyStudyPal.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sudimango.MyStudyPal.dto.request.flashcard.CreateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.request.flashcard.UpdateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.response.CreateFlashcardSetResponse;
import com.sudimango.MyStudyPal.dto.response.FlashcardSetResponse;
import com.sudimango.MyStudyPal.entity.Document;
import com.sudimango.MyStudyPal.entity.FlashcardSet;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.DocumentRepository;
import com.sudimango.MyStudyPal.repository.FlashcardSetRepository;

import jakarta.transaction.Transactional;

@Service
public class FlashcardSetService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FlashcardService flashcardService;

    @Transactional
    public CreateFlashcardSetResponse createFlashcardSet(CreateFlashcardSetRequest request, User user)
            throws JsonProcessingException, JsonMappingException {
        Document document = documentRepository
                .findById(request.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document with given ID not found."));

        FlashcardSet set = FlashcardSet.builder()
                .name(request.getName())
                .icon((request.getIcon() != null && !request.getIcon().isEmpty()) ? request.getIcon() : null)
                .document(document)
                .user(user)
                .build();
        flashcardSetRepository.save(set);

        flashcardService.createFlashcardsForSet(request, set);

        return new CreateFlashcardSetResponse(set.getFlashcardSetId());
    }

    public List<FlashcardSetResponse> getFlashcardSets(String userId) {
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findAllByUser_UserId(userId);

        List<FlashcardSetResponse> responses = new ArrayList<>();
        for (FlashcardSet f : flashcardSets) {
            FlashcardSetResponse res = new FlashcardSetResponse(f);
            responses.add(res);
        }

        return responses;
    }

    public FlashcardSetResponse getOneFlashcardSet(String setId) {
        FlashcardSet flashcardSet = flashcardSetRepository
                .findById(setId)
                .orElseThrow(() -> new RuntimeException("FlashcardSet with given id not found!"));

        return new FlashcardSetResponse(flashcardSet);
    }

    public void updateFlashcardSet(String setId, UpdateFlashcardSetRequest request) {
        FlashcardSet flashcardSet = flashcardSetRepository
                .findById(setId)
                .orElseThrow(() -> new RuntimeException("FlashcardSet with given id not found!"));

        if (request.getName() != null && !request.getName().isBlank()) {
            flashcardSet.setName(request.getName());
        }

        if (request.getIcon() != null && !request.getIcon().isBlank()) {
            flashcardSet.setIcon(request.getIcon());
        }

        flashcardSetRepository.save(flashcardSet);
    }

    public void deleteFlashcardSet(String setId) {
        flashcardSetRepository.deleteById(setId);
    }

}
