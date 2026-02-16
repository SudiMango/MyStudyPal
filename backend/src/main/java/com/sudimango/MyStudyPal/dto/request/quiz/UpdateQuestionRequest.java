package com.sudimango.MyStudyPal.dto.request.quiz;

import com.sudimango.MyStudyPal.entity.QuestionType;
import java.util.List;
import lombok.Data;

@Data
public class UpdateQuestionRequest {
    private String questionText;
    private QuestionType questionType;
    private List<String> options;
    private List<String> correctAnswers;
    private String hint;
    private Integer points;
    private Integer orderIndex;
}