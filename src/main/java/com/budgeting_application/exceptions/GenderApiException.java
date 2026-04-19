package com.budgeting_application.exceptions;

import org.springframework.http.HttpStatus;

public class GenderApiException extends RuntimeException {
    private final HttpStatus status;

    public GenderApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}