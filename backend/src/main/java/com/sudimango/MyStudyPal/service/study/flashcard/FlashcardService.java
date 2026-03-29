package com.sudimango.MyStudyPal.service.study.flashcard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.FlashcardDto;
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
    public void createFlashcardsForSet(FlashcardDto.CreateFlashcardSetRequest request, FlashcardSet set) throws JsonProcessingException, JsonMappingException {
        String studySetId = set.getStudySet().getStudySetId();
        
        String response = geminiClient.generateFlashcardsForStudySet(
            studySetId, 
            request.prompt(), 
            request.numFlashcards(), 
            request.additionalInstructions()
        );
        
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

    public void updateFlashcard(String flashcardId, FlashcardDto.UpdateFlashcardRequest request) throws JsonProcessingException, JsonMappingException {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
            .orElseThrow(() -> new RuntimeException("Flashcard not found: " + flashcardId));

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
            currFlashcard
                .append("Question: ")
                .append(flashcard.getQuestion())
                .append(", ")
                .append("Answer: ")
                .append(flashcard.getAnswer())
                .append(", ")
                .append("Hint: ")
                .append(flashcard.getHint())
                .append("\n\n")
                .append(request.instructions());

            String studySetId = flashcard.getFlashcardSet().getStudySet().getStudySetId();
            String query = currFlashcard.toString() + "\n\n" + request.instructions();

            String context = geminiClient.getContextFromStudySet(studySetId, query);
            String response = geminiClient.editFlashcard(context, currFlashcard.toString(), request.instructions());

            String cleaned = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

            Flashcard newFlashcard = mapper.readValue(cleaned,
                new TypeReference<Flashcard>() {
            });

            flashcard.setQuestion(newFlashcard.getQuestion());
            flashcard.setAnswer(newFlashcard.getAnswer());
            flashcard.setHint(newFlashcard.getHint());
        }

        flashcardRepository.save(flashcard);
    }

}