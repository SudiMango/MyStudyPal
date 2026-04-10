package com.sudimango.MyStudyPal.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.sudimango.MyStudyPal.dto.ErrorDto;
import com.sudimango.MyStudyPal.exception.AiJsonException;
import com.sudimango.MyStudyPal.exception.EmailDeliveryFailedException;
import com.sudimango.MyStudyPal.exception.EmptyAiResponseException;
import com.sudimango.MyStudyPal.exception.ForbiddenException;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.exception.TooManyRequestsException;
import com.sudimango.MyStudyPal.exception.UnauthorizedException;
import com.sudimango.MyStudyPal.exception.UnsupportedFormatException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(UnauthorizedException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(ForbiddenException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_CONTENT)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(MethodArgumentNotValidException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_CONTENT);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(ResourceNotFoundException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(EmptyAiResponseException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(EmptyAiResponseException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(EmailDeliveryFailedException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(EmailDeliveryFailedException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(AiJsonException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(AiJsonException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(RuntimeException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(UnsupportedFormatException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(UnsupportedFormatException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(TooManyRequestsException e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    // Fallback
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto.ErrorResponse> handleException(Exception e) {
        ErrorDto.ErrorResponse error = new ErrorDto.ErrorResponse(
                "An internal server error occurred. Please try again later.");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
