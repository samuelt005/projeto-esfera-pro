package com.projetointegrador.projetointegrador.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.sql.Date;
import java.util.Objects;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 100, nullable = false)
    @JsonIgnore
    private String password;

    @Column(length = 30, nullable = false)
    private String phone;

    @Column(length = 100, nullable = true)
    private String image_key;

    @Column(nullable = false)
    private Boolean status;

    @JoinColumn(name = "team_id")
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Team team;


    public User() {
    }

    public User(String name, String email, String password,String phone, Team team) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.team = team;
        this.password = password;
        this.status = true;
    }

    public User(String name, String email, String password, String phone, String image_key, Boolean status, Team team) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.image_key = image_key;
        this.status = status;
        this.team = team;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
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

    public String getImage_key() {
        return image_key;
    }

    public void setImage_key(String image_key) {
        this.image_key = image_key;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(name, user.name) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(phone, user.phone) && Objects.equals(image_key, user.image_key) && Objects.equals(status, user.status) && Objects.equals(team, user.team);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, password, phone, image_key, status, team);
    }
}
