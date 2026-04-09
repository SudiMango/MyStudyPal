package com.sudimango.MyStudyPal.service.study.quiz;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.QuizDto;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.CreateQuizQuestionRequest;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.QuizQuestionResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.TakeQuizResponse;
import com.sudimango.MyStudyPal.dto.QuizQuestionDto.UpdateQuizQuestionRequest;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.exception.AiJsonException;
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

    @Transactional
    public QuizQuestionResponse createQuestion(String quizId, CreateQuizQuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        int maxIdx = quiz.getQuizQuestions().size();
        int targetIndex = Math.max(1, Math.min(request.orderIndex(), maxIdx + 1));

        quizQuestionRepository.incrementIndicesFrom(quizId, targetIndex);

        QuizQuestion question = QuizQuestion.builder().questionType(request.questionType())
                .questionText(request.questionText()).options(request.options())
                .correctAnswers(request.correctAnswers()).hint(request.hint()).points(request.points())
                .orderIndex(targetIndex).quiz(quiz).build();

        return new QuizQuestionResponse(quizQuestionRepository.save(question));
    }

    @Transactional
    public QuizQuestionResponse updateQuestion(String questionId, UpdateQuizQuestionRequest request) {
        QuizQuestion question = quizQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));

        Quiz quiz = quizRepository.findById(question.getQuiz().getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + question.getQuiz().getQuizId()));

        if (Utils.hasText(request.questionText()))
            question.setQuestionText(request.questionText());
        if (request.options() != null)
            question.setOptions(request.options());
        if (request.correctAnswers() != null)
            question.setCorrectAnswers(request.correctAnswers());
        if (Utils.hasText(request.hint()))
            question.setHint(request.hint());
        if (request.points() != null)
            question.setPoints(request.points());

        if (request.orderIndex() != null && request.orderIndex() != question.getOrderIndex()) {
            String quizId = question.getQuiz().getQuizId();
            int oldIndex = question.getOrderIndex();
            int maxIdx = quiz.getQuizQuestions().size();
            int targetIndex = Math.max(1, Math.min(request.orderIndex(), maxIdx));

            if (targetIndex != oldIndex) {
                quizQuestionRepository.decrementOrderIndices(quizId, oldIndex);
                quizQuestionRepository.incrementIndicesFrom(quizId, targetIndex);

                question.setOrderIndex(targetIndex);
            }
        }

        return new QuizQuestionResponse(quizQuestionRepository.save(question));
    }

    public TakeQuizResponse getQuizQuestionsForTakingQuiz(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        return new TakeQuizResponse(quiz);
    }

    public List<QuizQuestionResponse> getQuizQuestionsForQuiz(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        List<QuizQuestionResponse> questions = new ArrayList<>();
        for (QuizQuestion q : quiz.getQuizQuestions()) {
            questions.add(new QuizQuestionResponse(q));
        }

        return questions;
    }

    @Transactional
    public void createQuestionsForQuiz(QuizDto.CreateQuizRequest request, Quiz quiz) {

        // Get json of questions from AI
        String studySetId = quiz.getStudySet().getStudySetId();
        String response = geminiClient.generateQuizQuestionsForStudySet(studySetId, request.prompt(),
                request.numQuestions(), request.additionalInstructions());

        if (response == null || response.trim().isEmpty()) {
            throw new EmptyAiResponseException("AI response for creating questions for the quiz was empty.");
        }

        // Map questions to a list
        String cleaned = response.replace("```json", "").replace("```", "").trim();

        List<QuizQuestion> questions = new ArrayList<>();
        try {
            questions = mapper.readValue(cleaned, new TypeReference<List<QuizQuestion>>() {
            });
        } catch (JsonProcessingException e) {
            throw new AiJsonException("AI didn't return proper json format.");
        }

        for (QuizQuestion q : questions) {
            q.setQuiz(quiz);
        }

        quizQuestionRepository.saveAll(questions);
    }

    @Transactional
    public void deleteQuestion(String questionId) {
        QuizQuestion question = quizQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        String quizId = question.getQuiz().getQuizId();
        int deletedIndex = question.getOrderIndex();

        quizQuestionRepository.delete(question);
        quizQuestionRepository.decrementOrderIndices(quizId, deletedIndex);
    }
}