package com.sudimango.MyStudyPal.service.study.quiz;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.QuizDto;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.exception.EmptyAiResponseException;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.repository.QuizQuestionRepository;
import com.sudimango.MyStudyPal.repository.QuizRepository;
import com.sudimango.MyStudyPal.utils.Utils;

import jakarta.transaction.Transactional;

@Service
public class QuizQuestionService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private GeminiClient geminiClient;

    private final ObjectMapper mapper;

    public QuizQuestionService() {
        this.mapper = new ObjectMapper();
    }

    public QuizQuestion createQuestionManually(String quizId, QuizQuestionDto.CreateQuizQuestionManuallyRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        QuizQuestion question = QuizQuestion.builder()
                .questionType(request.questionType())
                .questionText(request.questionText())
                .options(request.options())
                .correctAnswers(request.correctAnswers())
                .hint(request.hint())
                .points(request.points())
                .orderIndex(request.orderIndex())
                .quiz(quiz)
                .build();
        
        return question;
    }

    // TODO: Finish
    public QuizQuestion createQuestionWithAI(String quizId, QuizQuestionDto.CreateQuizQuestionWithAIRequest request) {
        return null;
    }

    public QuizQuestion updateQuestionManually(String questionId, QuizQuestionDto.UpdateQuizQuestionManuallyRequest request) {
        QuizQuestion question = quizQuestionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        if (Utils.hasText(request.questionText())) question.setQuestionText(request.questionText());
        if (request.questionType() != null) question.setQuestionType(request.questionType());
        if (request.options() != null) question.setOptions(request.options());
        if (request.correctAnswers() != null) question.setCorrectAnswers(request.correctAnswers());
        if (Utils.hasText(request.hint())) question.setHint(request.hint());
        if (request.points() != null) question.setPoints(request.points());
        if (request.orderIndex() != null) question.setOrderIndex(request.orderIndex());

        quizQuestionRepository.save(question);
        return question;
    }

    // TODO: Finish
    public QuizQuestion updateQuestionWithAI(String questionId, QuizQuestionDto.UpdateQuizQuestionWithAIRequest request) {
        return null;
    }

    @Transactional
    public void createQuestionsForQuiz(QuizDto.CreateQuizRequest request, Quiz quiz) throws JsonProcessingException {

        // Get json of questions from AI
        String studySetId = quiz.getStudySet().getStudySetId();
        String response = geminiClient.generateQuizQuestionsForStudySet(
            studySetId, 
            request.prompt(),
            request.timeLimitMinutes(),
            request.additionalInstructions()
        );
        
        if (response == null || response.trim().isEmpty()) {
            throw new EmptyAiResponseException("AI response for creating questions for the quiz was empty.");
        }
        
        // Map questions to a list
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

    public void deleteQuestion(String questionId) {
        quizQuestionRepository.deleteById(questionId);
    }
}