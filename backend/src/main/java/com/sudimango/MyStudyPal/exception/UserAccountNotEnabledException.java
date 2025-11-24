package com.sudimango.MyStudyPal.exception;

public class UserAccountNotEnabledException extends RuntimeException {
    public UserAccountNotEnabledException(String msg) {
        super(msg);
    }
}
