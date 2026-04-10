package com.sudimango.MyStudyPal.service.study.flashcard;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.FlashcardDto;
import com.sudimango.MyStudyPal.dto.FlashcardDto.CreateFlashcardRequest;
import com.sudimango.MyStudyPal.dto.FlashcardDto.FlashcardResponse;
import com.sudimango.MyStudyPal.dto.FlashcardSetDto.CreateFlashcardSetRequest;
import com.sudimango.MyStudyPal.entity.Flashcard;
import com.sudimango.MyStudyPal.entity.FlashcardSet;
import com.sudimango.MyStudyPal.exception.AiJsonException;
import com.sudimango.MyStudyPal.exception.EmptyAiResponseException;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.repository.FlashcardRepository;
import com.sudimango.MyStudyPal.repository.FlashcardSetRepository;

import jakarta.transaction.Transactional;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private GeminiClient geminiClient;

    private ObjectMapper mapper;

    public FlashcardService() {
        mapper = new ObjectMapper();
    }

    @Transactional
    public FlashcardResponse createFlashcard(String flashcardSetId, CreateFlashcardRequest request) {
        FlashcardSet set = flashcardSetRepository.findById(flashcardSetId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard set not found"));

        int maxIdx = set.getFlashcards().size();
        int targetIndex = Math.max(1, Math.min(request.orderIndex(), maxIdx + 1));

        flashcardRepository.incrementIndicesFrom(flashcardSetId, targetIndex);

        Flashcard flashcard = Flashcard.builder().question(request.question()).answer(request.answer())
                .hint(request.hint()).orderIndex(targetIndex).flashcardSet(set).build();

        return new FlashcardResponse(flashcardRepository.save(flashcard));
    }

    /**
     * Create flashcards for a set
     */
    @Transactional
    public void createFlashcardsForSet(CreateFlashcardSetRequest request, FlashcardSet set) {
        String studySetId = set.getStudySet().getStudySetId();

        String response = geminiClient.generateFlashcardsForStudySet(studySetId, request.prompt(),
                request.numFlashcards(), request.additionalInstructions());

        if (response == null || response.trim().equals("")) {
            throw new EmptyAiResponseException(
                    "AI response for generating flashcards for the flashcard set was empty.");
        }

        String cleaned = response.replace("```json", "").replace("```", "").trim();

        List<Flashcard> flashcards = new ArrayList<>();
        try {
            flashcards = mapper.readValue(cleaned, new TypeReference<List<Flashcard>>() {
            });
        } catch (JsonProcessingException e) {
            throw new AiJsonException("AI didn't return proper json format.");
        }

        for (Flashcard f : flashcards) {
            f.setFlashcardSet(set);
        }

        flashcardRepository.saveAll(flashcards);
    }

    /**
    * Get all the flashcards of a set
    */
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcardSet(#setId, authentication.principal.userId)")
    public List<FlashcardResponse> getAllFlashcardsOfSet(String setId) {
        FlashcardSet set = flashcardSetRepository.findById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard set not found: " + setId));

        List<FlashcardResponse> lst = new ArrayList<>();
        for (Flashcard f : set.getFlashcards()) {
            lst.add(new FlashcardResponse(f));
        }

        return lst;
    }

    /**
    * Change review status of a flashcard
    */
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public void changeReviewStatus(String flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found: " + flashcardId));

        flashcard.setReviewed(flashcard.isReviewed() ? false : true);
        flashcardRepository.save(flashcard);
    }

    /**
    * Change star status of a flashcard
    */
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public void changeStarStatus(String flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found: " + flashcardId));

        flashcard.setStarred(flashcard.isStarred() ? false : true);
        flashcardRepository.save(flashcard);
    }

    /**
    * Delete a flashcard
    */
    @Transactional
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public void deleteFlashcard(String flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found"));

        String setId = flashcard.getFlashcardSet().getFlashcardSetId();
        int deletedIndex = flashcard.getOrderIndex();

        flashcardRepository.delete(flashcard);
        flashcardRepository.decrementIndicesFrom(setId, deletedIndex);
    }

    /**
    * Update a flashcard
    */
    @Transactional
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public FlashcardDto.FlashcardResponse updateFlashcard(String flashcardId,
            FlashcardDto.UpdateFlashcardRequest request) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found: " + flashcardId));

        FlashcardSet set = flashcardSetRepository.findById(flashcard.getFlashcardSet().getFlashcardSetId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flashcard set not found with id: " + flashcard.getFlashcardSet().getFlashcardSetId()));

        if (request.question() != null && !request.question().isBlank())
            flashcard.setQuestion(request.question());
        if (request.answer() != null && !request.answer().isBlank())
            flashcard.setAnswer(request.answer());
        if (request.hint() != null && !request.hint().isBlank())
            flashcard.setHint(request.hint());

        int oldIndex = flashcard.getOrderIndex();
        String setId = flashcard.getFlashcardSet().getFlashcardSetId();

        if (request.orderIndex() != oldIndex) {
            int maxIdx = set.getFlashcards().size();
            int targetIndex = Math.max(1, Math.min(request.orderIndex(), maxIdx));

            if (targetIndex != oldIndex) {
                flashcardRepository.decrementIndicesFrom(setId, oldIndex);
                flashcardRepository.incrementIndicesFrom(setId, targetIndex);
                flashcard.setOrderIndex(targetIndex);
            }
        }

        Flashcard saved = flashcardRepository.save(flashcard);
        return new FlashcardResponse(saved);
    }

}