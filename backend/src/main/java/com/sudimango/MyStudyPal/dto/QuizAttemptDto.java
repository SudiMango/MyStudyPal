package com.sudimango.MyStudyPal.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.sudimango.MyStudyPal.dto.QuizQuestionDto.QuizQuestionResponse;
import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// @formatter:off
public class QuizAttemptDto {

    public record AnswerSubmission(
        @NotBlank String questionId,
        List<String> userAnswer
    ) {}

    public record QuizAttemptAnswerResponse (
        String answerId,
        List<String> userAnswer,
        Boolean isCorrect,
        double pointsEarned,
        QuizQuestionResponse question
    ) {
        public QuizAttemptAnswerResponse(QuizAttemptAnswer answer) {
            this(
                answer.getAnswerId(),
                answer.getUserAnswer(),
                answer.getIsCorrect(),
                answer.getPointsEarned(),
                Optional.ofNullable(answer.getQuizAttemptQuestion())
                    .map(QuizQuestionResponse::new)
                    .orElse(null)
            );
        }
    }

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

    public record QuizAttemptResponse(
        String attemptId,
        double score,
        double maxScore,
        Instant startedAt,
        Instant completedAt
    ) {
        public QuizAttemptResponse(QuizAttempt attempt) {
            this(
                attempt.getAttemptId(),
                attempt.getScore(),
                attempt.getMaxScore(),
                attempt.getStartedAt(),
                attempt.getCompletedAt()
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
