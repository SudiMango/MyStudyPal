package com.sudimango.MyStudyPal.exception;

public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException(String msg) {
        super(msg);
    }
}
