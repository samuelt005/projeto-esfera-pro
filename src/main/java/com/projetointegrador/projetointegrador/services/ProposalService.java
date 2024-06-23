package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.*;
import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProposalService {
    private final ProposalRepository proposalRepository;
    private final HttpServletRequest request;

    @Autowired
    public ProposalService(ProposalRepository proposalRepository, HttpServletRequest request) {
        this.proposalRepository = proposalRepository;
        this.request = request;
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

    //  Encontra propostas pelo ID do cliente
    public ResponseEntity<?> listProposalsPerClient(Long clientId) {
        Proposal exampleProposal = new Proposal();
        Client exampleClient = new Client();
        exampleClient.setId(clientId);
        exampleProposal.setClient(exampleClient);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id");

        Example<Proposal> example = Example.of(exampleProposal, matcher);

        return ResponseEntity.ok().body(proposalRepository.findAll(example));
    }

    // Lista todas as propostas ativas com paginação, pesquisa e filtros
    public Page<Proposal> listActiveProposal(String searchTerm, Integer statusId, Integer serviceTypeId, Pageable pageable) {
        Proposal exampleProposal = getProposalExample();

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

        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id"));

        return proposalRepository.findAll(example, pageable);
    }

    // Lista todas as propostas ativas
    public List<Proposal> listAllActiveProposals() {
        Proposal exampleProposal = getProposalExample();

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

    // Cria várias interações
    public ResponseEntity<?> createProposals(List<Proposal> proposals) {
        int successfulCreations = 0;

        for (Proposal proposal : proposals) {
            proposal.setInactive(false);
            proposal.setId(null);

            proposalRepository.save(proposal);
            successfulCreations++;
        }

        return ResponseEntity.ok().body("Total de propostas cadastradas com sucesso: " + successfulCreations);
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

    // Cria um exemplo de proposta para busca
    private Proposal getProposalExample() {
        Team exampleTeam = new Team();
        Client exampleClient = new Client();
        Proposal exampleProposal = new Proposal();
        exampleTeam.setId(getTeamIdFromRequest());
        exampleClient.setTeam(exampleTeam);
        exampleProposal.setClient(exampleClient);
        exampleProposal.setInactive(false);
        return exampleProposal;
    }

    // Busca o teamId da request
    private Long getTeamIdFromRequest() {
        return (Long) request.getAttribute("teamId");
    }
}
