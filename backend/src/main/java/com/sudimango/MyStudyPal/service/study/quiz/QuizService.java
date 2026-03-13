package com.sudimango.MyStudyPal.service.study.quiz;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sudimango.MyStudyPal.dto.request.quiz.quiz.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.request.quiz.quiz.UpdateQuizRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.CreateQuizResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.QuizDetailsResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.quiz.QuizResponse;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.repository.QuizRepository;
import com.sudimango.MyStudyPal.repository.StudySetRepository;

import jakarta.transaction.Transactional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionService quizQuestionService;

    @Autowired
    private StudySetRepository studySetRepository;

    @Transactional
    public CreateQuizResponse createQuiz(CreateQuizRequest request, String studySetId)
            throws JsonProcessingException {

        StudySet studySet = studySetRepository.findById(studySetId)
            .orElseThrow(() -> new ResourceNotFoundException("Study set not found with id: " + studySetId));

        Quiz quiz = Quiz.builder()
                .name(request.getName())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .studySet(studySet)
                .build();
        quizRepository.save(quiz);

        quizQuestionService.createQuestionsForQuiz(request, quiz);

        return new CreateQuizResponse(quiz.getQuizId());
    }

    public List<QuizResponse> getQuizzesForStudySet(String studySetId) {
        List<Quiz> quizzes = quizRepository.findAllByStudySet_StudySetId(studySetId);

        List<QuizResponse> responses = new ArrayList<>();
        for (Quiz q : quizzes) {
            responses.add(new QuizResponse(q));
        }

        return responses;
    }

    public QuizDetailsResponse getOneQuizDetails(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        return new QuizDetailsResponse(quiz);
    }

    public QuizResponse updateQuiz(String quizId, UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        if (request.getName() != null && !request.getName().isBlank()) {
            quiz.setName(request.getName());
        }

        quizRepository.save(quiz);
        return new QuizResponse(quiz);
    }

    public void deleteQuiz(String quizId) {
        quizRepository.deleteById(quizId);
    }
}