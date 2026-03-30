package com.sudimango.MyStudyPal.dto;

// @formatter:off
public class ErrorDto {
    
    /**
     * Response
     */

    public record ErrorResponse(
        String errorMessage
    ) {}
}
