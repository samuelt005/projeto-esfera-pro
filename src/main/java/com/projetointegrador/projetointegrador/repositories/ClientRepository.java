package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.projections.ClientProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT " +
            "c.id as id, " +
            "c.name as name, " +
            "c.cpf as cpf, " +
            "c.cnpj as cnpj, " +
            "c.company as company, " +
            "a.city.id as city_id, " +
            "a.city.name as city_name, " +
            "a.city.state.id as state_id, " +
            "a.city.state.name as state_name, " +
            "a.number as number, " +
            "a.street as street, " +
            "a.zip_code as zip_code " +
            "FROM " +
            "Client c " +
            "JOIN Address a ON a.client.id = c.id " +
            "WHERE " +
            "c.inactive = false")
    List<ClientProjection> findActiveClients();

    @Query("SELECT " +
            "c.id as id, " +
            "c.name as name, " +
            "c.cpf as cpf, " +
            "c.cnpj as cnpj, " +
            "c.company as company, " +
            "a.city.id as city_id, " +
            "a.city.name as city_name, " +
            "a.city.state.id as state_id, " +
            "a.city.state.name as state_name, " +
            "a.number as number, " +
            "a.street as street, " +
            "a.zip_code as zip_code " +
            "FROM " +
            "Client c " +
            "JOIN Address a ON a.client.id = c.id " +
            "WHERE " +
            "c.inactive = false AND c.id = :id")
    ClientProjection findClientById(@Param("id") Long id);
}
