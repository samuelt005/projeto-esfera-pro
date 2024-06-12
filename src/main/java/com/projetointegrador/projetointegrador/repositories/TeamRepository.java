package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT u FROM Team u WHERE u.code = ?1")
    Optional<Team> findByCode(String code);
}
