package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.services.InteractionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    // Rota para encontrar uma interação pelo ID
    @GetMapping("byId/{id}")
    @ResponseBody
    public ResponseEntity<?> findInteraction(@PathVariable("id") Long id) {
        return interactionService.findOneInteraction(id);
    }

    // Rota para listar todas as interações ativos com paginação
    @GetMapping("/{page}")
    @ResponseBody
    public ResponseEntity<Page<Interaction>> listInteractions(
            @PathVariable int page,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer resultId,
            @RequestParam(required = false) Integer contactId
    ) {
        int size = 20;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Interaction> interactions = interactionService.listActiveInteraction(searchTerm, resultId, contactId, pageRequest);

        return ResponseEntity.ok().body(interactions);
    }

    // Rota para criar uma interação
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> createInteraction(@RequestBody Interaction interaction) {
        return interactionService.createInteraction(interaction);
    }

    // Rota para criar várias interações
    @PostMapping("/bulk")
    @ResponseBody
    public ResponseEntity<?> createInteractions(@RequestBody List<Interaction> interactions) {
        return interactionService.createInteractions(interactions);
    }

    // Rota para atualizar uma interação
    @PutMapping
    @ResponseBody
    public ResponseEntity<?> updateInteractions(@RequestBody Interaction interaction) {
        return interactionService.updateInteraction(interaction);
    }

    // Rota para desativar uma interação
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteInteractions(@PathVariable Long id) {
        return interactionService.deleteInteraction(id);
    }

}

