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
import com.sudimango.MyStudyPal.dto.FlashcardDto.FlashcardResponse;
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

    /**
     * Create flashcards for a set
     */
    @Transactional
    public void createFlashcardsForSet(FlashcardDto.CreateFlashcardSetRequest request, FlashcardSet set) {
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
        flashcardSetRepository.findById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard set not found: " + setId));

        List<FlashcardResponse> lst = new ArrayList<>();

        List<Flashcard> flashcards = flashcardRepository.getByFlashcardSet_FlashcardSetIdOrderByCreatedAtAsc(setId);
        for (Flashcard f : flashcards) {
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
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public void deleteFlashcard(String flashcardId) {
        flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found: " + flashcardId));
        flashcardRepository.deleteById(flashcardId);
    }

    /**
    * Update a flashcard
    */
    @PreAuthorize("@resourceAuthorizationService.canAccessFlashcard(#flashcardId, authentication.principal.userId)")
    public FlashcardDto.FlashcardResponse updateFlashcard(String flashcardId,
            FlashcardDto.UpdateFlashcardRequest request) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found: " + flashcardId));

        if (request.mode().equals("manual")) {
            if (request.question() != null && !request.question().isBlank()) {
                flashcard.setQuestion(request.question());
            }

            if (request.answer() != null && !request.answer().isBlank()) {
                flashcard.setAnswer(request.answer());
            }

            if (request.hint() != null && !request.hint().isBlank()) {
                flashcard.setHint(request.hint());
            }
        } else if (request.mode().equals("AI")) {
            StringBuilder currFlashcard = new StringBuilder();
            currFlashcard.append("Question: ").append(flashcard.getQuestion()).append(", ").append("Answer: ")
                    .append(flashcard.getAnswer()).append(", ").append("Hint: ").append(flashcard.getHint())
                    .append("\n\n").append(request.instructions());

            String studySetId = flashcard.getFlashcardSet().getStudySet().getStudySetId();
            String query = currFlashcard.toString() + "\n\n" + request.instructions();

            String context = geminiClient.getContextFromStudySet(studySetId, query);
            String response = geminiClient.editFlashcard(context, currFlashcard.toString(), request.instructions());

            String cleaned = response.replace("```json", "").replace("```", "").trim();

            Flashcard newFlashcard;
            try {
                newFlashcard = mapper.readValue(cleaned, new TypeReference<Flashcard>() {
                });
            } catch (JsonProcessingException e) {
                throw new AiJsonException("AI didn't return proper json format.");
            }

            flashcard.setQuestion(newFlashcard.getQuestion());
            flashcard.setAnswer(newFlashcard.getAnswer());
            flashcard.setHint(newFlashcard.getHint());
        }

        Flashcard saved = flashcardRepository.save(flashcard);
        return new FlashcardResponse(saved);
    }

}