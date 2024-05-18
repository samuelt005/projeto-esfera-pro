package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.services.ProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/proposal")
public class ProposalController {
    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    // Rota para encontrar uma interação pelo ID
    @GetMapping("byId/{id}")
    public ResponseEntity<?> findProposal(@PathVariable("id") Long id) {
        return proposalService.findOneProposal(id);
    }

    // Rota para listar todas as interações ativos
    @GetMapping
    public ResponseEntity<?> listProposals() {
        return proposalService.listActiveProposal();
    }

    // Rota para criar uma interação
    @PostMapping
    public ResponseEntity<?> createProposals(@RequestBody Proposal interaction) {
        return proposalService.createProposal(interaction);
    }

    // Rota para atualizar uma interação
    @PutMapping
    public ResponseEntity<?> updateProposals(@RequestBody Proposal interaction) {
        return proposalService.updateProposal(interaction);
    }

    // Rota para desativar uma interação
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProposals(@PathVariable Long id) {
        return proposalService.deleteProposal(id);
    }

}

