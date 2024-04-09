package com.projetointegrador.projetointegrador.models;

import jakarta.persistence.*;

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
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @SuppressWarnings("unused")
    public Long getId() {
        return id;
    }

    @SuppressWarnings("unused")
    public String getName() {
        return name;
    }

    @SuppressWarnings("unused")
    public void setName(String name) {
        this.name = name;
    }

    @SuppressWarnings("unused")
    public String getCpf() {
        return cpf;
    }

    @SuppressWarnings("unused")
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    @SuppressWarnings("unused")
    public String getCnpj() {
        return cnpj;
    }

    @SuppressWarnings("unused")
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    @SuppressWarnings("unused")
    public String getCompany() {
        return company;
    }

    @SuppressWarnings("unused")
    public void setCompany(String company) {
        this.company = company;
    }

    @SuppressWarnings("unused")
    public Boolean getInactive() {
        return inactive;
    }

    @SuppressWarnings("unused")
    public void setInactive(Boolean inactive) {
        this.inactive = inactive;
    }

    @SuppressWarnings("unused")
    public Address getAddress() {
        return address;
    }

    @SuppressWarnings("unused")
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
