package com.sudimango.MyStudyPal.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MethodArgumentNotValidResponse {
    private List<String> errors;
}
