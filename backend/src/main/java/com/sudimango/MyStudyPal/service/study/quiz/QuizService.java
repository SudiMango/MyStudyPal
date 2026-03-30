package com.sudimango.MyStudyPal.service.study.quiz;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sudimango.MyStudyPal.dto.QuizDto;
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
    public QuizDto.CreateQuizResponse createQuiz(QuizDto.CreateQuizRequest request, String studySetId) {

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Study set not found with id: " + studySetId));

        Quiz quiz = Quiz.builder().name(request.name()).timeLimitMinutes(request.timeLimitMinutes()).studySet(studySet)
                .build();
        quizRepository.save(quiz);

        quizQuestionService.createQuestionsForQuiz(request, quiz);

        return new QuizDto.CreateQuizResponse(quiz.getQuizId());
    }

    public List<QuizDto.QuizDetailsResponse> getQuizzesForStudySet(String studySetId) {
        studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Study set not found with id: " + studySetId));

        List<Quiz> quizzes = quizRepository.findAllByStudySet_StudySetId(studySetId);

        List<QuizDto.QuizDetailsResponse> responses = new ArrayList<>();
        for (Quiz q : quizzes) {
            responses.add(new QuizDto.QuizDetailsResponse(q));
        }

        return responses;
    }

    public QuizDto.QuizDetailsResponse getOneQuizDetails(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        return new QuizDto.QuizDetailsResponse(quiz);
    }

    public QuizDto.QuizDetailsResponse updateQuiz(String quizId, QuizDto.UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        if (request.name() != null && !request.name().isBlank()) {
            quiz.setName(request.name());
        }

        quizRepository.save(quiz);
        return new QuizDto.QuizDetailsResponse(quiz);
    }

    public void deleteQuiz(String quizId) {
        quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        quizRepository.deleteById(quizId);
    }
}