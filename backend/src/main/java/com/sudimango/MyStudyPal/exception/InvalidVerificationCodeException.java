package com.sudimango.MyStudyPal.exception;

public class InvalidVerificationCodeException extends RuntimeException {
    public InvalidVerificationCodeException(String msg) {
        super(msg);
    }
}
