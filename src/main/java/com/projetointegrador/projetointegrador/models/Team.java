package com.projetointegrador.projetointegrador.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String code;

    @Column(nullable = false)
    private Long maxLimit;

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getLimit() {
        return maxLimit;
    }

    public void setLimit(Long maxLimit) {
        this.maxLimit = maxLimit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return Objects.equals(id, team.id) && Objects.equals(name, team.name) && Objects.equals(code, team.code) && Objects.equals(maxLimit, team.maxLimit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, code, maxLimit);
    }
}
