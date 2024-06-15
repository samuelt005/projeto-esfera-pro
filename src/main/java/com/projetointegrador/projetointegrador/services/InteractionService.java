package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.repositories.InteractionRepository;
import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InteractionService {
    private final InteractionRepository interactionRepository;
    private final HttpServletRequest request;

    @Autowired
    public InteractionService(InteractionRepository interactionRepository, HttpServletRequest request) {
        this.interactionRepository = interactionRepository;
        this.request = request;
    }

    // Encontra uma interação pelo id
    public ResponseEntity<?> findOneInteraction(Long id) {
        Optional<Interaction> optionalInteraction = interactionRepository.findById(id);

        if (optionalInteraction.isPresent()) {
            return ResponseEntity.ok().body(optionalInteraction);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Interação não encontrada.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Lista todas as interações ativas com paginação, pesquisa e filtros
    public Page<Interaction> listActiveInteraction(String searchTerm, Integer resultId, Integer contactId, Pageable pageable) {
        Interaction exampleInteraction = getInteractionExample();

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            Client client = new Client();
            Proposal proposal = new Proposal();
            exampleInteraction.setProposal(proposal);
            exampleInteraction.getProposal().setClient(client);
            exampleInteraction.getProposal().getClient().setName(searchTerm);
        }

        if (resultId != null) {
            exampleInteraction.setResult(resultId);
        }

        if (contactId != null) {
            exampleInteraction.setContact(contactId);
        }

        Example<Interaction> example = Example.of(exampleInteraction, matcher);

        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id"));

        return interactionRepository.findAll(example, pageable);
    }

    // Lista todas as interações ativas
    public List<Interaction> listAllActiveInteractions() {
        Interaction exampleInteraction = getInteractionExample();

        ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

        Example<Interaction> example = Example.of(exampleInteraction, matcher);

        return interactionRepository.findAll(example);
    }

    // Cria uma interação
    public ResponseEntity<?> createInteraction(Interaction interaction) {
        interaction.setInactive(false);
        interaction.setId(null);

        Interaction createdInteraction = interactionRepository.save(interaction);
        return ResponseEntity.ok().body(createdInteraction);
    }

    // Cria várias interações
    public ResponseEntity<?> createInteractions(List<Interaction> interactions) {
        int successfulCreations = 0;

        for (Interaction interaction : interactions) {
            interaction.setInactive(false);
            interaction.setId(null);

            interactionRepository.save(interaction);
            successfulCreations++;
        }

        return ResponseEntity.ok().body("Total de interações cadastradas com sucesso: " + successfulCreations);
    }

    // Atualiza uma interação
    public ResponseEntity<?> updateInteraction(Interaction interaction) {
        if (interaction.getId() == null || interaction.getProposal().getId() == null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs da interação ou da proposta não estão presentes."));
        }

        Interaction updatedInteraction = interactionRepository.save(interaction);
        return ResponseEntity.ok().body(updatedInteraction);
    }

    // Desativa uma interação pelo id
    public ResponseEntity<?> deleteInteraction(Long id) {
        Optional<Interaction> optionalInteraction = interactionRepository.findById(id);

        if (optionalInteraction.isPresent()) {
            Interaction interaction = optionalInteraction.get();
            interaction.setInactive(true);
            interactionRepository.save(interaction);
            Response response = new Response(HttpStatus.OK, "Interacao inativada.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Interação não encontrada.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Cria um exemplo de interação para busca
    private Interaction getInteractionExample() {
        Team exampleTeam = new Team();
        Client exampleClient = new Client();
        Proposal exampleProposal = new Proposal();
        Interaction exampleInteraction = new Interaction();
        exampleTeam.setId(getTeamIdFromRequest());
        exampleClient.setTeam(exampleTeam);
        exampleProposal.setClient(exampleClient);
        exampleInteraction.setProposal(exampleProposal);
        exampleInteraction.setInactive(false);
        return exampleInteraction;
    }

    // Busca o teamId da request
    private Long getTeamIdFromRequest() {
        return (Long) request.getAttribute("teamId");
    }
}
