package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCpf(String cpf);

    Optional<Client> findByCnpj(String cnpj);
}
