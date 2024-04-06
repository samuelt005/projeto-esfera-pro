package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT c FROM Client c WHERE c.inactive = false")
    List<Client> findActiveClients();
}
