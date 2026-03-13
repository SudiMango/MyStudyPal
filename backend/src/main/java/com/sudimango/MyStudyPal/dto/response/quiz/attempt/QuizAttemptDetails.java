package com.sudimango.MyStudyPal.dto.response.quiz.attempt;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;
import com.sudimango.MyStudyPal.entity.QuizQuestion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuizAttemptDetails {
    private String attemptId;
    private double score;
    private double maxScore;
    private Instant startedAt;
    private Instant completedAt;
    private List<QuizQuestion> questions;
    private List<QuizAttemptAnswer> answers;
    
    public QuizAttemptDetails(QuizAttempt attempt) {
        this.attemptId = attempt.getAttemptId();
        this.score = attempt.getScore();
        this.maxScore = attempt.getMaxScore();
        this.maxScore = attempt.getMaxScore();
        this.startedAt = attempt.getStartedAt();
        this.completedAt = attempt.getCompletedAt();
        this.answers = attempt.getQuizAttemptAnswers();
        
        this.questions = new ArrayList<>();
        for (QuizAttemptAnswer a : this.answers) {
            this.questions.add(a.getQuizQuestion());
        }
    }

}
