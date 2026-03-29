package com.sudimango.MyStudyPal.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.sudimango.MyStudyPal.dto.ErrorDto;
import com.sudimango.MyStudyPal.exception.EmptyAiResponseException;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_CONTENT);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(EmptyAiResponseException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleEmptyAiResponse(EmptyAiResponseException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    // Fallback
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleGeneral(Exception e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse("An internal server error occurred. Please try again later.");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
