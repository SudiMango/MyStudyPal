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

    // Generate flashcards on the whole document
    // TODO: seperate document chunk stuff into DocumentChunkService
    public String generateFlashcardsFullDocument(String documentId, int numFlashcards, String additionalInstructions) {
        List<DocumentChunk> chunks = documentChunkRepository.findAllByDocument_DocumentId(documentId);
        String fullDocumentText = chunks.stream()
                .map(DocumentChunk::getChunkText)
                .collect(Collectors.joining("\n\n"));

        String prompt = generateFlashcardSetPrompt(fullDocumentText, numFlashcards, additionalInstructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }
    
    // Generates a general response based on a user promp and the given context
    public String generateResponse(String userPrompt, String context) {
        String prompt = "Based on the following context:\n\n" + context + "\n\nAnswer this prompt: " + userPrompt;
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Retrieves context from a given document, based on the user prompt
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
              .append("3. Each flashcard must have exactly two fields: 'question' and 'answer'.\n")
              .append("4. Make questions clear, concise, and focused on key concepts from the context.\n")
              .append("5. Make answers accurate, concise, and directly address the question.\n");
        
        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("\nADDITIONAL INSTRUCTIONS:\n")
                  .append(additionalInstructions)
                  .append("\n\nIMPORTANT: If the additional instructions conflict with the core requirement of generating ")
                  .append(numFlashcards)
                  .append(" flashcards in JSON format, ignore those conflicting parts of the additional instructions and prioritize maintaining the flashcard generation task.\n");
        }
        
        prompt.append("\nJSON FORMAT (return ONLY this, no other text):\n")
              .append("[\n")
              .append("  {\"question\": \"...\", \"answer\": \"...\"},\n")
              .append("  {\"question\": \"...\", \"answer\": \"...\"}\n")
              .append("]\n");
        
        return prompt.toString();
    }
}
