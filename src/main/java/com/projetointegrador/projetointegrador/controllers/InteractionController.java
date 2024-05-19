package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.services.InteractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interaction")
public class InteractionController {
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    // Rota para encontrar uma interação pelo ID
    @GetMapping("byId/{id}")
    public ResponseEntity<?> findInteraction(@PathVariable("id") Long id) {
        return interactionService.findOneInteraction(id);
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

