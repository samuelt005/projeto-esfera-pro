package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.*;
import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProposalService {
    private final ProposalRepository proposalRepository;

    public ProposalService(ProposalRepository proposalRepository) {
        this.proposalRepository = proposalRepository;
    }

    // Encontra uma proposta pelo id
    public ResponseEntity<?> findOneProposal(Long id) {
        Optional<Proposal> optionalProposal = proposalRepository.findById(id);

        if (optionalProposal.isPresent()) {
            return ResponseEntity.ok().body(optionalProposal);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Proposta não encontrada.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Lista todas as propostas ativas
    public Page<Proposal> listActiveProposal(String searchTerm, Integer statusId, Integer serviceTypeId, Pageable pageable) {
        Proposal exampleProposal = new Proposal();
        exampleProposal.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            Client client = new Client();
            exampleProposal.setClient(client);
            exampleProposal.getClient().setName(searchTerm);
        }

        if (statusId != null) {
            exampleProposal.setStatus(statusId);
        }

        if (serviceTypeId != null) {
            exampleProposal.setServiceType(serviceTypeId);
        }

        Example<Proposal> example = Example.of(exampleProposal, matcher);

        return proposalRepository.findAll(example, pageable);
    }

    // Lista todas as propostas ativas
    public List<Proposal> listAllActiveProposals() {
        Proposal exampleProposal = new Proposal();
        exampleProposal.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

        Example<Proposal> example = Example.of(exampleProposal, matcher);

        return proposalRepository.findAll(example);
    }

    // Cria uma proposta
    public ResponseEntity<?> createProposal(Proposal proposal) {
        proposal.setInactive(false);
        proposal.setId(null);

        Proposal createdProposal = proposalRepository.save(proposal);
        return ResponseEntity.ok().body(createdProposal);
    }

    // Atualiza uma proposta
    public ResponseEntity<?> updateProposal(Proposal proposal) {
        if (proposal.getId() == null || proposal.getClient().getId() == null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs da proposta ou do cliente não estão presentes."));
        }

        Proposal updatedProposal = proposalRepository.save(proposal);
        return ResponseEntity.ok().body(updatedProposal);
    }

    // Desativa uma proposta pelo id
    public ResponseEntity<?> deleteProposal(Long id) {
        Optional<Proposal> optionalProposal = proposalRepository.findById(id);

        if (optionalProposal.isPresent()) {
            Proposal proposal = optionalProposal.get();
            proposal.setInactive(true);
            proposalRepository.save(proposal);
            Response response = new Response(HttpStatus.OK, "Proposta inativada.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Proposta não encontrada.");
            return ResponseEntity.badRequest().body(response);
        }
    }

}
