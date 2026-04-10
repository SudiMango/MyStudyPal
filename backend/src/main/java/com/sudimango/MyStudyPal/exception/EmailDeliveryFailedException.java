package com.sudimango.MyStudyPal.exception;

public class EmailDeliveryFailedException extends RuntimeException {
    public EmailDeliveryFailedException(String msg) {
        super(msg);
    }
}
