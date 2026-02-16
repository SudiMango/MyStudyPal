package com.sudimango.MyStudyPal.dto.response.quiz.attempt;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import com.sudimango.MyStudyPal.entity.QuizAttempt;

import lombok.Getter;

@Getter
public class SubmitAttemptResponse {
    private String attemptId;
    private BigDecimal score;
    private BigDecimal maxScore;
    private Double percentage;
    private Integer timeSpentSeconds;
    private Instant completedAt;
    private List<AnswerFeedbackResponse> answerDetails;

    public SubmitAttemptResponse(QuizAttempt attempt) {
        this.attemptId = attempt.getAttemptId();
        this.score = attempt.getScore();
        this.maxScore = attempt.getMaxScore();
        
        // Calculate percentage for the UI progress bars
        if (maxScore.compareTo(BigDecimal.ZERO) > 0) {
            this.percentage = (score.doubleValue() / maxScore.doubleValue()) * 100;
        } else {
            this.percentage = 0.0;
        }

        this.timeSpentSeconds = attempt.getTimeSpentSeconds();
        this.completedAt = attempt.getCompletedAt();
        
        // Map the internal answers to a feedback DTO
        if (attempt.getQuizAttemptAnswers() != null) {
            this.answerDetails = attempt.getQuizAttemptAnswers().stream()
                .map(AnswerFeedbackResponse::new)
                .collect(Collectors.toList());
        }
    }
}