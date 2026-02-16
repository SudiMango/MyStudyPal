package com.sudimango.MyStudyPal.component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.genai.Client;
import com.google.genai.types.ContentEmbedding;
import com.google.genai.types.EmbedContentConfig;
import com.google.genai.types.EmbedContentResponse;
import com.google.genai.types.GenerateContentResponse;
import com.sudimango.MyStudyPal.entity.DocumentChunk;
import com.sudimango.MyStudyPal.repository.DocumentChunkRepository;

@Component
public class GeminiClient {
    private final Client client;
    private static final String CHAT_MODEL = "gemini-2.5-flash";
    private static final String EMBEDDING_MODEL = "gemini-embedding-001";
    private static final int EMBEDDING_DIMENSIONS = 768;

    @Autowired
    private DocumentChunkRepository documentChunkRepository;
    
    public GeminiClient(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder().apiKey(apiKey).build();
    }

    /*
     * 
     * PUBLIC FUNCTIONS
     * 
     */

    // Generates vector embedding for a string and returns a string value of the embedding, 
    // so that it can be saved properly in the database
    public String generateAndFormatEmbedding(String text) {
        List<Float> embedding = generateEmbedding(text);
    
        String vectorStr = "[" + embedding.stream()
                            .map(String::valueOf)
                        .collect(Collectors.joining(",")) + "]";
    
        return vectorStr;
    }

    // TODO: enable retries when content generation fails to format as JSON

    // Generate flashcards with context
    public String generateFlashcardsWithContext(String context, int numFlashcards, String additionalInstructions) {
        String prompt = generateFlashcardSetPrompt(context, numFlashcards, additionalInstructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Generate flashcards for entire study set using RAG
    public String generateFlashcardsForStudySet(String studySetId, String userPrompt, int numFlashcards, String additionalInstructions) {
        // Get relevant context from all documents in the study set using RAG
        String context = getContextFromStudySet(studySetId, userPrompt);
        
        // Generate flashcards using the retrieved context
        String prompt = generateFlashcardSetPrompt(context, numFlashcards, additionalInstructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Retrieves context from all documents in a study set, based on the user prompt
    public String getContextFromStudySet(String studySetId, String userPrompt) {
        List<Float> queryEmbedding = generateEmbedding(userPrompt);
        String vectorStr = queryEmbedding.toString();
        
        // Find similar chunks across ALL documents in the study set
        List<String> relevantChunks = documentChunkRepository.findSimilarChunksInStudySet(studySetId, vectorStr, 10);
        
        if (relevantChunks.isEmpty()) {
            return "No matching content found in the study set.";
        }
        
        String context = String.join("\n\n", relevantChunks);
        return context;
    }

    // Generate flashcards on the whole document
    // TODO: seperate document chunk stuff into DocumentChunkService
    @Deprecated
    public String generateFlashcardsFullDocument(String documentId, int numFlashcards, String additionalInstructions) {
        List<DocumentChunk> chunks = documentChunkRepository.findAllByDocument_DocumentId(documentId);
        String fullDocumentText = chunks.stream()
                .map(DocumentChunk::getChunkText)
                .collect(Collectors.joining("\n\n"));

        String prompt = generateFlashcardSetPrompt(fullDocumentText, numFlashcards, additionalInstructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Edit flashcard with AI
    public String editFlashcard(String context, String currentFlashcard, String instructions) {
        String prompt = generateUpdateFlashcardPrompt(context, currentFlashcard, instructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Retrieves context from a given document, based on the user prompt
    @Deprecated
    public String getContext(String documentId, String userPrompt) {
        List<Float> queryEmbedding = generateEmbedding(userPrompt);
        String vectorStr = queryEmbedding.toString();
    
        List<String> relevantChunks = documentChunkRepository.findSimilarChunks(documentId, vectorStr, 5);
    
        if (relevantChunks.isEmpty()) {
            return "No matching documents found.";
        }
    
        String context = String.join("\n\n", relevantChunks);
        return context;
    }

    /*
     * 
     * PRIVATE FUNCTIONS
     * 
     */

    // Generates vector embedding given a string
    private List<Float> generateEmbedding(String text) {
        EmbedContentConfig config = EmbedContentConfig.builder()
            .outputDimensionality(EMBEDDING_DIMENSIONS)
            .taskType("RETRIEVAL_DOCUMENT")
            .build();
        
        EmbedContentResponse response = this.client.models.embedContent(EMBEDDING_MODEL, text, config);
        
        List<Float> result = new ArrayList<>();
        if (response.embeddings().isPresent()) {
            List<ContentEmbedding> embeddings = response.embeddings().get();
            if (!embeddings.isEmpty()) {
                ContentEmbedding embedding = embeddings.get(0);
                if (embedding.values().isPresent()) {
                    result.addAll(embedding.values().get());
                }
            }
        }
        return result;
    }

    // Generate prompt string to create all the flashcards of a new set
    private String generateFlashcardSetPrompt(String context, int numFlashcards, String additionalInstructions) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are a flashcard generation assistant. Your task is to create exactly ")
              .append(numFlashcards)
              .append(" flashcards based on the following context:\n\n");
        
        prompt.append("CONTEXT:\n")
              .append(context)
              .append("\n\n");
        
        prompt.append("REQUIREMENTS:\n")
              .append("1. Generate exactly ").append(numFlashcards).append(" flashcards.\n")
              .append("2. Return ONLY a JSON array with no additional text or markdown.\n")
              .append("3. Each flashcard must have exactly three fields: 'question', 'answer' and 'hint'.\n")
              .append("4. For each flashcard, make a hint which is 25 characters long max. Do not make the hint long, it should be short and precise.\n")
              .append("5. Make questions clear, concise, and focused on key concepts from the context.\n")
              .append("6. Make answers accurate, concise, and directly address the question.\n");
        
        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("\nADDITIONAL INSTRUCTIONS:\n")
                  .append(additionalInstructions)
                  .append("\n\nIMPORTANT: If the additional instructions conflict with the core requirement of generating ")
                  .append(numFlashcards)
                  .append(" flashcards in JSON format, ignore those conflicting parts of the additional instructions and prioritize maintaining the flashcard generation task.\n");
        }
        
        prompt.append("\nJSON FORMAT (return ONLY this, no other text):\n")
              .append("[\n")
              .append("  {\"question\": \"...\", \"answer\": \"...\"}, \"hint\": \"...\"},\n")
              .append("  {\"question\": \"...\", \"answer\": \"...\"}, \"hint\": \"...\"},\n")
              .append("]\n");
        
        return prompt.toString();
    }

    // Generate prompt string to update an existing flashcard
    private String generateUpdateFlashcardPrompt(String context, String currentFlashcard, String instructions) {
        StringBuilder prompt = new StringBuilder();
        
        prompt
            .append("You are a flashcard generation assistant. Your task is to edit this already existing flashcard based on the following context:\n\n")
            .append("Current flashcard:\n")
            .append(currentFlashcard)
            .append("\n")
            .append("CONTEXT:\n")
              .append(context)
              .append("\n\n");
        
        prompt.append("REQUIREMENTS:\n")
              .append("1. Return ONLY a JSON array with no additional text or markdown.\n")
              .append("2. The flashcard have exactly three fields: 'question', 'answer' and 'hint'.\n")
              .append("3. The hint for the flashcard can be 25 characters long max. Do not make the hint long, it should be short and precise.\n")
              .append("4. Make questions clear, concise, and focused on key concepts from the context.\n")
              .append("5. Make answers accurate, concise, and directly address the question.\n");
        
        if (instructions != null && !instructions.trim().isEmpty()) {
            prompt.append("\nINSTRUCTIONS TO UPDATE THIS FLASHCARD:\n")
                  .append(instructions)
                  .append("\n")
                  .append("IMPORTANT:\n")
                  .append("1. Only edit the necessary fields. For example, if the instruction asks to only do something with the hint and answer, don't modify the question.\n")
                  .append("2. If the additional instructions conflict with the core requirement of editing the in JSON format, ignore those conflicting parts of the additional instructions and prioritize maintaining the flashcard editing task. \n");
        } else {
            prompt
                .append("\nINSTRUCTIONS TO UPDATE THIS FLASHCARD:\n")
                .append("Use the given context to make the current flashcard better in all factors.");
        }
        
        prompt.append("\nJSON FORMAT (return ONLY this, no other text, make sure its one json object and not a list):\n")
              .append(" {\"question\": \"...\", \"answer\": \"...\"}, \"hint\": \"...\"},\n");
        
        return prompt.toString();
    }
}
