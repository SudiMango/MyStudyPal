package com.sudimango.MyStudyPal.dto.request.quiz;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateQuizRequest {
    private String name;
    private Integer timeLimitMinutes;
}