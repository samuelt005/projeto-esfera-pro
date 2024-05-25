package com.projetointegrador.projetointegrador.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;
import java.util.Objects;

@Entity
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Date offerDate;
    @Column(nullable = false)
    private Double value;
    @Column(length = 1, nullable = false)
    private Integer serviceType;
    @Column(length = 1, nullable = false)
    private Integer status;
    @Column(length = 1000, nullable = false)
    private String description;
    @Column(nullable = false)
    private Boolean inactive;
    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"address", "cpf", "cnpj", "email", "whatsapp", "cellphone", "telephone", "inactive"})
    private Client client;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getOfferDate() {
        return offerDate;
    }

    public void setOfferDate(Date offerDate) {
        this.offerDate = offerDate;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Integer getServiceType() {
        return serviceType;
    }

    public void setServiceType(Integer serviceType) {
        this.serviceType = serviceType;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getInactive() {
        return inactive;
    }

    public void setInactive(Boolean inactive) {
        this.inactive = inactive;
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
        Proposal proposal = (Proposal) o;
        return Objects.equals(id, proposal.id) && Objects.equals(offerDate, proposal.offerDate) && Objects.equals(value, proposal.value) && Objects.equals(serviceType, proposal.serviceType) && Objects.equals(status, proposal.status) && Objects.equals(description, proposal.description) && Objects.equals(inactive, proposal.inactive) && Objects.equals(client, proposal.client);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, offerDate, value, serviceType, status, description, inactive, client);
    }
}
