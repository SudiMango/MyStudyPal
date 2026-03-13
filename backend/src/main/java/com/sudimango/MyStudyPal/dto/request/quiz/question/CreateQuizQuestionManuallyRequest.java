package com.sudimango.MyStudyPal.dto.request.quiz.question;

import java.util.List;

import com.sudimango.MyStudyPal.entity.QuestionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateQuizQuestionManuallyRequest {
    @NotNull(message = "questionType field in class CreateQuizQuestionManuallyRequest cannot be null.")
    private QuestionType questionType;

    @NotBlank(message = "questionText field in class CreateQuizQuestionManuallyRequest cannot be null or blank.")
    private String questionText;

    @NotEmpty(message = "options field in class CreateQuizQuestionManuallyRequest cannot be empty.")
    private List<String> options;

    @NotEmpty(message = "correctAnswers field in class CreateQuizQuestionManuallyRequest cannot be empty.")
    private List<String> correctAnswers;

    private String hint;

    @NotNull(message = "points field in class CreateQuizQuestionManuallyRequest cannot be null.")
    private double points;

    @NotNull(message = "orderIndex field in class CreateQuizQuestionManuallyRequest cannot be null.")
    private int orderIndex;
}
