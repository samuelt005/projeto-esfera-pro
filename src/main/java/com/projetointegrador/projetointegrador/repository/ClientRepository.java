package com.projetointegrador.projetointegrador.repository;

import com.projetointegrador.projetointegrador.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
