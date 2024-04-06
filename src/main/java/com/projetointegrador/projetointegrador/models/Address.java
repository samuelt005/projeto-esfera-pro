package com.projetointegrador.projetointegrador.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50, nullable = false)
    private String street;
    @Column(length = 50, nullable = false)
    private String zip_code;
    @Column(nullable = false)
    private Integer number;
    @Transient
    private Long cityId;
    @Transient
    private Long clientId;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    public Long getId() {
        return id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZip_code() {
        return zip_code;
    }

    public void setZip_code(String zip_code) {
        this.zip_code = zip_code;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address adress = (Address) o;
        return Objects.equals(id, adress.id) && Objects.equals(street, adress.street) && Objects.equals(zip_code, adress.zip_code) && Objects.equals(number, adress.number) && Objects.equals(city, adress.city) && Objects.equals(client, adress.client);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, street, zip_code, number, city, client);
    }
}
