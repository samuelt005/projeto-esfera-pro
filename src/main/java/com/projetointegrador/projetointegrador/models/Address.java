package com.projetointegrador.projetointegrador.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@JsonIgnoreProperties({"client", "city_id", "client_id"})
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
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @SuppressWarnings("unused")
    public Long getId() {
        return id;
    }

    @SuppressWarnings("unused")
    public String getStreet() {
        return street;
    }

    @SuppressWarnings("unused")
    public String getZip_code() {
        return zip_code;
    }

    @SuppressWarnings("unused")
    public Integer getNumber() {
        return number;
    }

    @SuppressWarnings("unused")
    public City getCity() {
        return city;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return Objects.equals(id, address.id) && Objects.equals(street, address.street) && Objects.equals(zip_code, address.zip_code) && Objects.equals(number, address.number) && Objects.equals(city, address.city);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, street, zip_code, number, city);
    }
}
