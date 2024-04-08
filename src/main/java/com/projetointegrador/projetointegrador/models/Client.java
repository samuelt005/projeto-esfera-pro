package com.projetointegrador.projetointegrador.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50, nullable = false)
    private String name;
    @Column(length = 11)
    private String cpf;
    @Column(length = 14)
    private String cnpj;
    @Column(length = 50)
    private String company;
    @Column(nullable = false)
    private Boolean inactive;
    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL)
    private Address address;

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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Client client = (Client) o;
        return Objects.equals(id, client.id) && Objects.equals(name, client.name) && Objects.equals(cpf, client.cpf) && Objects.equals(cnpj, client.cnpj) && Objects.equals(company, client.company) && Objects.equals(inactive, client.inactive) && Objects.equals(address, client.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, cpf, cnpj, company, inactive, address);
    }
}
