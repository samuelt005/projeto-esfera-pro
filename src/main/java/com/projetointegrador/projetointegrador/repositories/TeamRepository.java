package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
