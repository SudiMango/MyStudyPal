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
    private static final String CHAT_MODEL = "gemini-3-flash-preview";
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

        String vectorStr = "[" + embedding.stream().map(String::valueOf).collect(Collectors.joining(",")) + "]";

        return vectorStr;
    }

    // Generate flashcards for entire study set using RAG
    public String generateFlashcardsForStudySet(String studySetId, String userPrompt, int numFlashcards,
            String additionalInstructions) {
        String context = getContextFromStudySet(studySetId, userPrompt);

        String prompt = generateFlashcardSetPrompt(context, numFlashcards, additionalInstructions);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    // Generate quiz questions for entire study set using RAG
    public String generateQuizQuestionsForStudySet(String studySetId, String userPrompt, int numQuestions,
            String additionalInstructions) {
        String context = getContextFromStudySet(studySetId, userPrompt);

        String prompt = generateQuizPrompt(context, numQuestions, additionalInstructions);
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

    public String markShortAnswerQuestions(List<String> questions, List<String> correctAnswer, List<String> userAnswer,
            List<String> hint, List<Double> maxPoints) {
        String prompt = generateMarkShortAnswersPrompt(questions, correctAnswer, userAnswer, hint, maxPoints);
        GenerateContentResponse response = this.client.models.generateContent(CHAT_MODEL, prompt, null);
        return response.text();
    }

    /*
     * 
     * PRIVATE FUNCTIONS
     * 
     */

    // Generates vector embedding given a string
    private List<Float> generateEmbedding(String text) {
        EmbedContentConfig config = EmbedContentConfig.builder().outputDimensionality(EMBEDDING_DIMENSIONS)
                .taskType("RETRIEVAL_DOCUMENT").build();

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

    /**
     * AI Prompts
     */

    // Generate prompt string to create all the flashcards of a new set
    // @formatter:off
    private String generateFlashcardSetPrompt(String context, int numFlashcards, String additionalInstructions) {

        // Using a Text Block for the core prompt structure for maximum readability
        String basePrompt = """
            You are a flashcard generation assistant. Your task is to create exactly %d flashcards based on the provided context. If no context is provided, use your own knowledge of the topic to create the flashcards.

            CONTEXT:
            %s

            REQUIREMENTS:
            1. Generate exactly %d flashcards.
            2. Return ONLY a JSON array. Do not include markdown formatting or any introductory text.
            3. Each flashcard object must contain: 'question', 'answer', 'hint', and 'orderIndex'.
            4. STYLE: Write questions and answers naturally. DO NOT use phrases like "According to the context" or "Based on the text". Ask questions directly.
            5. PRIORITY: Only generate flashcards on content that would realistically appear on an exam. Prioritize definitions, mechanisms, processes, key relationships, and important facts. Skip trivia, fun facts, historical anecdotes, and peripheral details unless they are relevant for the topic of the set or explicitly asked for by the user in the additional instructions part.
            6. FIELD SPECS:
            - 'question': Clear, concise, and focused on key concepts.
            - 'answer': Accurate and direct.
            - 'hint': Short and precise (max 25 characters).
            - 'orderIndex': Integer starting from 1, representing the sequence of the cards.

            """;

        StringBuilder prompt = new StringBuilder(String.format(basePrompt, numFlashcards, context, numFlashcards));

        // Handle Additional Instructions
        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("ADDITIONAL INSTRUCTIONS:\n")
                .append(additionalInstructions)
                .append("\n\nIMPORTANT: Maintain the JSON format and card count even if these instructions conflict.\n\n");
        }

        prompt.append("""
            JSON FORMAT EXAMPLE:
            [
            {
                "question": "What is the capital of France?",
                "answer": "Paris",
                "hint": "City of Light",
                "orderIndex": 1
            }
            ]
            """);

        return prompt.toString();
    }

    // Generate prompt string to create all the quiz questions of a new quiz
    private String generateQuizPrompt(String context, int numQuestions, String additionalInstructions) {
        String basePrompt = """
            You are a quiz generation assistant. Your task is to create exactly %d questions based on the following context. If no context is provided, use your own knowledge of the topic to create the questions.

            CONTEXT:
            %s

            REQUIREMENTS:
            1. Generate exactly %d questions.
            2. Return ONLY a JSON array. Do not include markdown formattin or any introductory text.
            3. Use only these QuestionType values: 'MULTIPLE_CHOICE', 'MULTIPLE_ANSWER', 'TRUE_FALSE', 'SHORT_ANSWER'.
            4. Each object must contain: 'questionText', 'questionType', 'options', 'correctAnswers', 'hint', 'points', and 'orderIndex'.
            5. STYLE: Write questions naturally. DO NOT use phrases like "According to the context" or "Based on the document". Ask the question directly.
            6. PRIORITY: Only generate questions on content that would realistically appear on an exam. Prioritize definitions, mechanisms, processes, key relationships, and important facts. Skip trivia, fun facts, historical anecdotes, and peripheral details unless they are relevant for the topic of the quiz or explicitly asked for by the user in the additional instructions part.
            7. FIELD SPECS:
            - 'options': A JSON array of strings (must be empty [] for SHORT_ANSWER).
            - 'correctAnswers': A JSON array of strings containing the correct value(s).
            - 'hint': A short precise hint (max 25 characters). Do not make the hint too close to the correct answer.
            - 'points': Integer value (default to 1).
            - 'orderIndex': Integer value starting from 1.
            
            """;

        StringBuilder prompt = new StringBuilder(String.format(basePrompt, numQuestions, context, numQuestions));

        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("ADDITIONAL INSTRUCTIONS:\n")
                .append(additionalInstructions)
                .append("\n\nIMPORTANT: Prioritize the JSON quiz generation task even if these instructions conflict.\n\n");
        }

        prompt.append("""
            JSON FORMAT EXAMPLE (return ONLY the array):
            [
            {
                "questionText": "What is the capital of France?",
                "questionType": "MULTIPLE_CHOICE",
                "options": ["Paris", "London", "Berlin"],
                "correctAnswers": ["Paris"],
                "hint": "City of light",
                "points": 1,
                "orderIndex": 1
            }
            ]
            """);

        return prompt.toString();
    }

    private String generateMarkShortAnswersPrompt(List<String> questions, List<String> correctAnswer,
            List<String> userAnswer, List<String> hint, List<Double> maxPoints) {
        
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            You are an expert academic grading assistant. Your task is to grade a series of short-answer questions.

            ### GRADING LOGIC:
            1. Compare 'User Answer' against 'Correct Answer' within the context of the 'Question' and the 'Hint'.
            2. Award points based on conceptual accuracy and understanding.
            3. Be lenient with minor typos but strict with factual errors.
            4. If the answer is basically the exact same as the hint, give lower marks. Ignore the hint if it is empty.
            4. STYLE: Do not provide feedback or explanations like "The user missed the point". 
            5. ORDERING: You MUST return the scores in the exact same order as the items provided below.
            
            ### QUESTIONS TO GRADE:
            """);

        for (int i = 0; i < questions.size(); i++) {
            prompt.append(String.format("""
                --- ITEM %d ---
                Question: %s
                Correct Answer: %s
                User Answer: %s
                Max Points: %.2f
                
                """, i + 1, questions.get(i), correctAnswer.get(i), userAnswer.get(i), maxPoints.get(i)));
        }

        prompt.append("""
            ### OUTPUT REQUIREMENTS:
            - Return ONLY a valid JSON array of objects. 
            - Do not include markdown or introductory text.
            - Each object must contain exactly one key: 'score' (numeric value).

            ### EXAMPLE RESPONSE:
            [
            {"score": 1.0},
            {"score": 0.5},
            {"score": 2.0}
            ]
            """);

        return prompt.toString();
    }
    // @formatter:on

}
