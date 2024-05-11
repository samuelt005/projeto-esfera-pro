package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.services.CityService;
import com.projetointegrador.projetointegrador.services.InteractionService;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interaction")
public class InteractionController {
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    // Rota para listar todas as interações ativos
    @GetMapping
    public ResponseEntity<?> listInteractions() {
        return interactionService.listActiveInteraction();
    }

    // Rota para criar uma interação
    @PostMapping
    public ResponseEntity<?> createInteractions(@RequestBody Interaction interaction) {
        return interactionService.createInteraction(interaction);
    }

    // Rota para atualizar uma interação
    @PutMapping
    public ResponseEntity<?> updateInteractions(@RequestBody Interaction interaction) {
        return interactionService.updateInteraction(interaction);
    }

    // Rota para desativar uma interação
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInteractions(@PathVariable Long id) {
        return interactionService.deleteInteraction(id);
    }

}

