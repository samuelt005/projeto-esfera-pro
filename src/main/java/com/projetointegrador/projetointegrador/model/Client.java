package com.projetointegrador.projetointegrador.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(length = 11, nullable = true)
    private String cpf;
    @Column(length = 14, nullable = true)
    private String cnpj;
    @Column(length = 50, nullable = true)
    private String company;
    @Column(nullable = false)
    private Boolean inactive;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Boolean getInactive() {
        return inactive;
    }

    public void setInactive(Boolean inactive) {
        this.inactive = inactive;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Client client = (Client) o;
        return Objects.equals(id, client.id) && Objects.equals(name, client.name) && Objects.equals(cpf, client.cpf) && Objects.equals(cnpj, client.cnpj) && Objects.equals(company, client.company);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, cpf, cnpj, company);
    }
}
