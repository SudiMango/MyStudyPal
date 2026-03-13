package com.sudimango.MyStudyPal.dto.request.quiz.attempt;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateQuizAttemptRequest {
    @NotNull(message = "timeSpentSeconds field in SubmitAttemptRequest cannot be null.")
    private int timeSpentSeconds;
    
    private List<AnswerSubmission> answers;
}