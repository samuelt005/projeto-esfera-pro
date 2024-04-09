package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
