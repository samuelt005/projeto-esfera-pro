package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
}
