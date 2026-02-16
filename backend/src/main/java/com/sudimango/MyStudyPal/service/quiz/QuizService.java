package com.sudimango.MyStudyPal.service.quiz;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sudimango.MyStudyPal.dto.request.quiz.CreateQuizRequest;
import com.sudimango.MyStudyPal.dto.request.quiz.UpdateQuizRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.CreateQuizResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.QuizResponse;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.entity.User;
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
    public CreateQuizResponse createQuiz(CreateQuizRequest request, String studySetId, User user)
            throws JsonProcessingException {

        StudySet studySet = studySetRepository.findById(studySetId)
            .orElseThrow(() -> new RuntimeException("Study set not found: " + studySetId));

        Quiz quiz = Quiz.builder()
                .name(request.getName())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .studySet(studySet)
                .build();
        
        quizRepository.save(quiz);

        // Delegate question creation to the specific item service
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

    public QuizResponse getOneQuiz(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz with given id not found!"));

        return new QuizResponse(quiz);
    }

    public void updateQuiz(String quizId, UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz with given id not found!"));

        if (request.getName() != null && !request.getName().isBlank()) {
            quiz.setName(request.getName());
        }

        quizRepository.save(quiz);
    }

    public void deleteQuiz(String quizId) {
        quizRepository.deleteById(quizId);
    }
}