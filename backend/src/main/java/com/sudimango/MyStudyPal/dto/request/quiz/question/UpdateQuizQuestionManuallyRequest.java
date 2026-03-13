package com.sudimango.MyStudyPal.dto.request.quiz.question;

import java.util.List;

import com.sudimango.MyStudyPal.entity.QuestionType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateQuizQuestionManuallyRequest {
    private QuestionType questionType;
    private String questionText;
    private List<String> options;
    private List<String> correctAnswers;
    private String hint;
    private Double points;
    private Integer orderIndex;
}
