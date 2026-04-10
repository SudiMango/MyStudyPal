package com.sudimango.MyStudyPal.exception;

public class EmptyAiResponseException extends RuntimeException {
    public EmptyAiResponseException(String msg) {
        super(msg);
    }
}
