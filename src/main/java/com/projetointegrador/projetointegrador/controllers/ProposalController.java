package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.services.ProposalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            @PathVariable int page,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) Integer serviceTypeId
    ) {
        int size = 20;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Proposal> proposals = proposalService.listActiveProposal(searchTerm, statusId, serviceTypeId, pageRequest);

        return ResponseEntity.ok().body(proposals);
    }

    // Rota para listar todas as propostas ativos sem paginação
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<?> listAllProposals() {
        List<Proposal> proposal = proposalService.listAllActiveProposals();
        return ResponseEntity.ok().body(proposal);
    }

    // Rota para criar uma proposta
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> createProposal(@RequestBody Proposal proposal) {
        return proposalService.createProposal(proposal);
    }

    // Rota para criar várias propostas
    @PostMapping("/bulk")
    @ResponseBody
    public ResponseEntity<?> createProposals(@RequestBody List<Proposal> proposal) {
        return proposalService.createProposals(proposal);
    }

    // Rota para atualizar uma proposta
    @PutMapping
    @ResponseBody
    public ResponseEntity<?> updateProposals(@RequestBody Proposal proposals) {
        return proposalService.updateProposal(proposals);
    }

    // Rota para desativar uma proposta
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteProposals(@PathVariable Long id) {
        return proposalService.deleteProposal(id);
    }

}

