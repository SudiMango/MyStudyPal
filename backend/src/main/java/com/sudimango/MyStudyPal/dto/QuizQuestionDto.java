package com.sudimango.MyStudyPal.dto;

import java.util.List;
import java.util.Optional;

import com.sudimango.MyStudyPal.entity.QuestionType;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizAttemptQuestion;
import com.sudimango.MyStudyPal.entity.QuizQuestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

// @formatter:off
public class QuizQuestionDto {

    public record Quiz_QuizQuestionResponse(
        String questionId,
        QuestionType questionType,
        String questionText,
        List<String> options,
        String hint,
        double points,
        int orderIndex
    ) {
        public Quiz_QuizQuestionResponse(QuizQuestion question) {
            this(
                question.getQuestionId(),
                question.getQuestionType(),
                question.getQuestionText(),
                question.getOptions(),
                question.getHint(),
                question.getPoints(),
                question.getOrderIndex()
            );
        }
    }

    /**
     * Request
     */

    public record CreateQuizQuestionRequest(
        @NotNull QuestionType questionType,
        @NotBlank String questionText,
        @NotEmpty List<String> options,
        @NotEmpty List<String> correctAnswers,
        String hint,
        @NotNull Double points,
        @NotNull Integer orderIndex
    ) {}

    public record UpdateQuizQuestionRequest(
        String questionText,
        List<String> options,
        List<String> correctAnswers,
        String hint,
        Double points,
        Integer orderIndex
    ) {}

    /**
     * Response
     */

    public record QuizQuestionResponse(
        String questionId,
        QuestionType questionType,
        String questionText,
        List<String> options,
        List<String> correctAnswers,
        String hint,
        double points,
        int orderIndex
    ) {
        public QuizQuestionResponse(QuizQuestion question) {
            this(
                question.getQuestionId(),
                question.getQuestionType(),
                question.getQuestionText(),
                question.getOptions(),
                question.getCorrectAnswers(),
                question.getHint(),
                question.getPoints(),
                question.getOrderIndex()
            );
        }

        public QuizQuestionResponse(QuizAttemptQuestion question) {
            this(
                question.getOriginalQuestionId(),
                question.getQuestionType(),
                question.getQuestionText(),
                question.getOptions(),
                question.getCorrectAnswers(),
                question.getHint(),
                question.getPoints(),
                question.getOrderIndex()
            );
        }
    }

    public record TakeQuizResponse(
        String name,
        List<Quiz_QuizQuestionResponse> questions
    ) {
        public TakeQuizResponse(Quiz quiz) {
            this(
                quiz.getName(),
                Optional.ofNullable(quiz.getQuizQuestions())
                    .orElse(List.of())
                    .stream()
                    .map(Quiz_QuizQuestionResponse::new)
                    .toList()
            );
        }
    }
}
