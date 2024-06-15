package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    @Query("SELECT p.value FROM Proposal p " +
           "JOIN p.client c " +
           "JOIN c.team t " +
           "WHERE t.id = :teamId " +
           "AND p.status = 4 " +
           "AND p.inactive = false " +
           "AND p.offerDate BETWEEN :startingDate AND :endingDate")
    List<Double> findProposalValuesInAPeriod(Long teamId, LocalDateTime startingDate, LocalDateTime endingDate);

    @Query("SELECT count(i.id) FROM Interaction i " +
           "JOIN i.proposal p " +
           "JOIN p.client c " +
           "JOIN c.team t " +
           "WHERE t.id = :teamId " +
           "AND i.inactive = false " +
           "AND i.date BETWEEN :startingDate AND :endingDate")
    Integer findTotalAmountOfInteractions(Long teamId, LocalDateTime startingDate, LocalDateTime endingDate);

    @Query("SELECT count(p.id) FROM Proposal p " +
           "JOIN p.client c " +
           "JOIN c.team t " +
           "WHERE t.id = :teamId " +
           "AND p.inactive = false " +
           "AND p.status = :status " +
           "AND p.offerDate BETWEEN :startingDate AND :endingDate")
    Integer findTotalAmountOfProposalsByStatus(Long teamId, Integer status, LocalDateTime startingDate, LocalDateTime endingDate);

    @Query("SELECT count(i.id) FROM Interaction i " +
           "JOIN i.proposal p " +
           "JOIN p.client c " +
           "JOIN c.team t " +
           "WHERE t.id = :teamId " +
           "AND i.inactive = false " +
           "AND i.result = :result " +
           "AND i.date BETWEEN :startingDate AND :endingDate")
    Integer findTotalAmountOfInteractionsByResult(Long teamId, Integer result, LocalDateTime startingDate, LocalDateTime endingDate);
}
