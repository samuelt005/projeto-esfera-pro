package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {
}
