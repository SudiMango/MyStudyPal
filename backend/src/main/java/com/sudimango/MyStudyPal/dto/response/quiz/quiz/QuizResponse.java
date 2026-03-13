package com.sudimango.MyStudyPal.dto.response.quiz.quiz;

import com.sudimango.MyStudyPal.entity.Quiz;
import java.time.Instant;
import lombok.Getter;

@Getter
public class QuizResponse {
    private String quizId;
    private String name;
    private Integer timeLimitMinutes;
    private Instant createdAt;
    private Instant updatedAt;
    private int totalQuestions;
    private double totalPoints;

    public QuizResponse(Quiz quiz) {
        this.quizId = quiz.getQuizId();
        this.name = quiz.getName();
        this.timeLimitMinutes = quiz.getTimeLimitMinutes();
        this.createdAt = quiz.getCreatedAt();
        this.updatedAt = quiz.getUpdatedAt();
        this.totalQuestions = quiz.getQuizQuestions() != null ? quiz.getQuizQuestions().size() : 0;
        this.totalPoints = quiz.getQuizQuestions() != null ? 
            quiz.getQuizQuestions().stream().mapToDouble(q -> q.getPoints()).sum() : 0;
    }
}