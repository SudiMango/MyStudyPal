package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import java.util.List;

import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;
import com.sudimango.MyStudyPal.entity.QuizQuestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// @formatter:off
public class QuizAttemptDto {

    public record AnswerSubmission(
        @NotBlank String questionId,
        List<String> userAnswer
    ) {}

    /**
     * Request
     */

    public record CreateQuizAttemptRequest(
        @NotNull Integer timeSpentSeconds,
        List<AnswerSubmission> answers
    ) {}

    /**
     * Response
     */

    public record CreateQuizAttemptResponse(
        String attemptId
    ) {}

    public record QuizAttemptDetailsResponse(
        String attemptId,
        double score,
        double maxScore,
        Instant startedAt,
        Instant completedAt,
        List<QuizQuestion> questions,
        List<QuizAttemptAnswer> answers
    ) {
        public QuizAttemptDetailsResponse(QuizAttempt attempt) {
            this(
                attempt.getAttemptId(),
                attempt.getScore(),
                attempt.getMaxScore(),
                attempt.getStartedAt(),
                attempt.getCompletedAt(),
                attempt.getQuizAttemptAnswers().stream()
                    .map(QuizAttemptAnswer::getQuizQuestion)
                    .toList(), 
                attempt.getQuizAttemptAnswers()
            );
        }
    }

    public record ShortAnswerGradingResponse(
        Double score
    ) {
        public ShortAnswerGradingResponse() {
            this(
                0.0
            );
        }
    }


}
