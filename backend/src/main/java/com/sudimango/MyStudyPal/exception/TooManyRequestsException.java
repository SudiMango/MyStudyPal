package com.sudimango.MyStudyPal.exception;

public class TooManyRequestsException extends RuntimeException {
    public TooManyRequestsException(String msg) {
        super(msg);
    }
}
