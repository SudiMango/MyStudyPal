package com.sudimango.MyStudyPal.dto.request.studyset;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateStudySetRequest {
    @NotBlank(message = "Name field in CreateStudySetRequest class cannot be null or blank.")
    private String name;
    
    private String icon;
    private String description;
}
