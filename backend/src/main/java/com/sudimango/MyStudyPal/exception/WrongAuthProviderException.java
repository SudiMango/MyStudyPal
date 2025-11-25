package com.sudimango.MyStudyPal.exception;

public class WrongAuthProviderException extends RuntimeException {
    public WrongAuthProviderException(String msg) {
        super(msg);
    }
}
