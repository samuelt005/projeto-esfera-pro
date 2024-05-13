package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.repositories.InteractionRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InteractionService {
    private final InteractionRepository interactionRepository;

    public InteractionService(InteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
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

    // Lista todas as interações ativas
    public ResponseEntity<?> listActiveInteraction() {
        Interaction exampleInteraction = new Interaction();
        exampleInteraction.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

        Example<Interaction> example = Example.of(exampleInteraction, matcher);

        List<Interaction> clients = interactionRepository.findAll(example);
        return ResponseEntity.ok().body(clients);
    }

    // Cria uma interação
    public ResponseEntity<?> createInteraction(Interaction interaction) {
        interaction.setInactive(false);
        interaction.setId(null);

        Interaction createdInteraction = interactionRepository.save(interaction);
        return ResponseEntity.ok().body(createdInteraction);
    }

    // Atualiza uma interação
    public ResponseEntity<?> updateInteraction(Interaction interaction) {
        if (interaction.getId() == null || interaction.getClient().getId() == null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs da interação ou do cliente não estão presentes."));
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
            Response response = new Response(HttpStatus.OK, "Interação inativada.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Interação não encontrada.");
            return ResponseEntity.badRequest().body(response);
        }
    }

}
