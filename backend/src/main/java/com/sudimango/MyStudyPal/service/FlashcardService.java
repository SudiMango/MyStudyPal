package com.sudimango.MyStudyPal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.request.flashcard.CreateFlashcardSetRequest;
import com.sudimango.MyStudyPal.dto.request.flashcard.UpdateFlashcardRequest;
import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.entity.FlashcardSet;
import com.sudimango.MyStudyPal.repository.FlashcardRepository;

import jakarta.transaction.Transactional;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private GeminiClient geminiClient;

    private ObjectMapper mapper;

    public FlashcardService() {
        mapper = new ObjectMapper();
    }

    @Transactional
    public void createFlashcardsForSet(CreateFlashcardSetRequest request, FlashcardSet set) throws JsonProcessingException, JsonMappingException {

        String response = null;
        if (!request.getUseFullDocument()) {
            String context = geminiClient.getContext(request.getDocumentId(), request.getPrompt());
            response = geminiClient.generateFlashcardsWithContext(context, request.getNumFlashcards(), request.getAdditionalInstructions());
        } else {
            response = geminiClient.generateFlashcardsFullDocument(request.getDocumentId(), request.getNumFlashcards(), request.getAdditionalInstructions());
        }

        if (response == null || response.trim().equals("")) {
            throw new RuntimeException("AI response was null.");
        }

        String cleaned = response
            .replace("```json", "")
            .replace("```", "")
            .trim();

        List<Flashcard> flashcards = mapper.readValue(cleaned,
            new TypeReference<List<Flashcard>>() {
        });

        for (Flashcard f : flashcards) {
            f.setFlashcardSet(set);
        }

        flashcardRepository.saveAll(flashcards);
    }

    public List<Flashcard> getAllFlashcardsOfSet(String setId) {
        return flashcardRepository.getByFlashcardSet_FlashcardSetIdOrderByCreatedAtAsc(setId);
    }

    public void changeReviewStatus(String flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
            .orElseThrow(() -> new RuntimeException("Flashcard not found: " + flashcardId));

        flashcard.setReviewed(flashcard.isReviewed() ? false : true);
        flashcardRepository.save(flashcard);
    }

    public void changeStarStatus(String flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
            .orElseThrow(() -> new RuntimeException("Flashcard not found: " + flashcardId));

        flashcard.setStarred(flashcard.isStarred() ? false : true);
        flashcardRepository.save(flashcard);
    }

    public void deleteFlashcard(String flashcardId) {
        flashcardRepository.deleteById(flashcardId);
    }

    public void updateFlashcard(String flashcardId, UpdateFlashcardRequest request) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
            .orElseThrow(() -> new RuntimeException("Flashcard not found: " + flashcardId));

        if (request.getQuestion() != null && !request.getQuestion().isBlank()) {
            flashcard.setQuestion(request.getQuestion());
        }

        if (request.getAnswer() != null && !request.getAnswer().isBlank()) {
            flashcard.setAnswer(request.getAnswer());
        }

        if (request.getHint() != null && !request.getHint().isBlank()) {
            flashcard.setHint(request.getHint());
        }

        flashcardRepository.save(flashcard);
    }

}