package com.sudimango.MyStudyPal.dto.response.quiz.attempt;

import java.math.BigDecimal;
import java.util.List;

import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;

import lombok.Getter;

@Getter
public class AnswerFeedbackResponse {
    private String questionId;
    private String questionText;
    private Object userAnswer;
    private List<String> correctAnswers; // Taken from the question entity
    private boolean isCorrect;
    private BigDecimal pointsEarned;

    public AnswerFeedbackResponse(QuizAttemptAnswer answer) {
        this.questionId = answer.getQuizQuestion().getQuestionId();
        this.questionText = answer.getQuizQuestion().getQuestionText();
        this.userAnswer = answer.getUserAnswer();
        this.correctAnswers = answer.getQuizQuestion().getCorrectAnswers();
        this.isCorrect = answer.isCorrect();
        this.pointsEarned = answer.getPointsEarned();
    }
}