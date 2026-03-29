package com.sudimango.MyStudyPal.dto;

public class ErrorDto {
    
    /**
     * Response
     */

    public record ErrorResponse(
        String errorMessage
    ) {}
}
