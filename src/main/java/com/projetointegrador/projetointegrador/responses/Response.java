package com.projetointegrador.projetointegrador.responses;

import org.springframework.http.HttpStatus;

// Semente para criar estados no banco
public class Response {
    private int status;
    private String error;
    private String message;

    public Response(HttpStatus status, String message) {
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
