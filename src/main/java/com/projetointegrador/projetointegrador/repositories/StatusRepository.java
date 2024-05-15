package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Long> {
}
