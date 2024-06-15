package com.projetointegrador.projetointegrador.dto;

import java.util.Objects;

public class LogInDTO {
    private String email;
    private String password;

    public LogInDTO() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LogInDTO logInDTO = (LogInDTO) o;
        return Objects.equals(email, logInDTO.email) && Objects.equals(password, logInDTO.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, password);
    }
}
