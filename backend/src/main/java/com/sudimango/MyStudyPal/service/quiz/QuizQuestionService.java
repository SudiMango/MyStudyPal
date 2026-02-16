package com.sudimango.MyStudyPal.service.quiz;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.request.quiz.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.request.quiz.UpdateQuestionRequest;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.repository.QuizQuestionRepository;

import jakarta.transaction.Transactional;

@Service
public class QuizQuestionService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private GeminiClient geminiClient;

    private final ObjectMapper mapper;

    public QuizQuestionService() {
        this.mapper = new ObjectMapper();
    }

    @Transactional
    public void createQuestionsForQuiz(CreateQuizRequest request, Quiz quiz) throws JsonProcessingException {
        String studySetId = quiz.getStudySet().getStudySetId();
        
        String response = geminiClient.generateQuizQuestionsForStudySet(
            studySetId, 
            request.getPrompt(),
            request.getTimeLimitMinutes(),
            request.getAdditionalInstructions()
        );
        
        if (response == null || response.trim().isEmpty()) {
            throw new RuntimeException("AI response for quiz was empty.");
        }
        
        String cleaned = response
            .replace("```json", "")
            .replace("```", "")
            .trim();
        
        List<QuizQuestion> questions = mapper.readValue(cleaned,
            new TypeReference<List<QuizQuestion>>() {});
        
        // Set relationships and order indices
        AtomicInteger index = new AtomicInteger(0);
        for (QuizQuestion q : questions) {
            q.setQuiz(quiz);
            q.setOrderIndex(index.getAndIncrement());
        }
        
        quizQuestionRepository.saveAll(questions);
    }

    public List<QuizQuestion> getAllQuestionsOfQuiz(String quizId) {
        return quizQuestionRepository.findByQuiz_QuizIdOrderByOrderIndexAsc(quizId);
    }

    public void updateQuestion(String questionId, UpdateQuestionRequest request) {
        QuizQuestion question = quizQuestionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));

        if (request.getQuestionText() != null) question.setQuestionText(request.getQuestionText());
        if (request.getQuestionType() != null) question.setQuestionType(request.getQuestionType());
        if (request.getOptions() != null) question.setOptions(request.getOptions());
        if (request.getCorrectAnswers() != null) question.setCorrectAnswers(request.getCorrectAnswers());
        if (request.getHint() != null) question.setHint(request.getHint());
        if (request.getPoints() != null) question.setPoints(request.getPoints());
        if (request.getOrderIndex() != null) question.setOrderIndex(request.getOrderIndex());

        quizQuestionRepository.save(question);
    }

    public void deleteQuestion(String questionId) {
        quizQuestionRepository.deleteById(questionId);
    }
}