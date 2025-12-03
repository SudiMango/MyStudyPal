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

    // Generates vector embedding for a string and returns a string value of the embedding, 
    // so that it can be saved properly in the database
    public String generateAndFormatEmbedding(String text) {
        List<Float> embedding = generateEmbedding(text);
    
        String vectorStr = "[" + embedding.stream()
                            .map(String::valueOf)
                        .collect(Collectors.joining(",")) + "]";
    
        return vectorStr;
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
}
