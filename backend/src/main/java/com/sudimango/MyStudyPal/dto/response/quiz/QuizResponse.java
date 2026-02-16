package com.sudimango.MyStudyPal.dto.response.quiz;

import com.sudimango.MyStudyPal.entity.Quiz;
import java.time.Instant;
import lombok.Getter;

@Getter
public class QuizResponse {
    private String quizId;
    private String name;
    private Integer timeLimitMinutes;
    private Instant createdAt;
    private int totalQuestions;
    private int totalPoints;

    public QuizResponse(Quiz quiz) {
        this.quizId = quiz.getQuizId();
        this.name = quiz.getName();
        this.timeLimitMinutes = quiz.getTimeLimitMinutes();
        this.createdAt = quiz.getCreatedAt();
        this.totalQuestions = quiz.getQuizQuestions() != null ? quiz.getQuizQuestions().size() : 0;
        this.totalPoints = quiz.getQuizQuestions() != null ? 
            quiz.getQuizQuestions().stream().mapToInt(q -> q.getPoints()).sum() : 0;
    }
}