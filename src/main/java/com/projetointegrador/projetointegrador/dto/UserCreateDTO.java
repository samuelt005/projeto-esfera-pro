package com.projetointegrador.projetointegrador.dto;

import com.projetointegrador.projetointegrador.models.Team;

import java.util.Objects;

public class UserCreateDTO {

    private String name;

    private String email;

    private String password;

    private String phone;

    private String team;

    public UserCreateDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserCreateDTO that = (UserCreateDTO) o;
        return Objects.equals(name, that.name) && Objects.equals(email, that.email) && Objects.equals(password, that.password) && Objects.equals(phone, that.phone) && Objects.equals(team, that.team);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, email, password, phone, team);
    }
}
