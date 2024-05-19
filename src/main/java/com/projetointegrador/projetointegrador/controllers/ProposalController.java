package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.services.ProposalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/proposal")
public class ProposalController {
    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    // Rota para encontrar uma proposta pelo ID
    @GetMapping("byId/{id}")
    @ResponseBody
    public ResponseEntity<?> findProposal(@PathVariable("id") Long id) {
        return proposalService.findOneProposal(id);
    }

    // Rota para listar todas as propostas ativos com paginação
    @GetMapping("/{page}")
    @ResponseBody
    public ResponseEntity<?> listProposals(
            @PathVariable int page
    ) {
        int size = 20;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Proposal> proposals = proposalService.listActiveProposal(pageRequest);
        return ResponseEntity.ok().body(proposals);
    }

    // Rota para criar uma proposta
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> createProposals(@RequestBody Proposal proposal) {
        return proposalService.createProposal(proposal);
    }

    // Rota para atualizar uma proposta
    @PutMapping
    @ResponseBody
    public ResponseEntity<?> updateProposals(@RequestBody Proposal proposal) {
        return proposalService.updateProposal(proposal);
    }

    // Rota para desativar uma proposta
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteProposals(@PathVariable Long id) {
        return proposalService.deleteProposal(id);
    }

}

