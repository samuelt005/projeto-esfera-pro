package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import com.projetointegrador.projetointegrador.repositories.TeamRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ProposalServiceTests {
    private ProposalRepository proposalRepository;
    private ProposalService proposalService;

    @BeforeEach
    public void setUp() {
        proposalRepository = mock(ProposalRepository.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        proposalService = new ProposalService(proposalRepository, request);
    }

    @Test
    void testFindOneProposal() {
        Long proposalId = 1L;
        Proposal proposal = new Proposal();
        proposal.setId(proposalId);
        when(proposalRepository.findById(proposalId)).thenReturn(Optional.of(proposal));

        ResponseEntity<?> responseEntity = proposalService.findOneProposal(proposalId);

        Optional<Proposal> optionalProposal = (Optional<Proposal>) responseEntity.getBody();
        assert optionalProposal != null;
        Proposal actualProposal = optionalProposal.orElse(null);

        // Verificando se encontrou a proposta
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(proposal, actualProposal);
        System.out.println("Expected proposal: " + proposal);
        System.out.println("Actual proposal: " + actualProposal);
    }

    @Test
    void testListProposalsPerClient() {
        Long clientId = 1L;
        Client client = new Client();
        client.setId(clientId);
        Proposal proposal1 = new Proposal();
        proposal1.setClient(client);
        Proposal proposal2 = new Proposal();
        proposal2.setClient(client);

        List<Proposal> proposals = Arrays.asList(proposal1, proposal2);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id");

        Example<Proposal> example = Example.of(proposal1, matcher);

        when(proposalRepository.findAll(example)).thenReturn(proposals);

        ResponseEntity<?> responseEntity = proposalService.listProposalsPerClient(clientId);

        // Verifica se o método retornou uma resposta HTTP OK
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(proposals, responseEntity.getBody());
    }

    @Test
    void testListActiveProposal() {
        Proposal proposal1 = new Proposal();
        proposal1.setId(1L);
        proposal1.setInactive(false);

        Proposal proposal2 = new Proposal();
        proposal2.setId(2L);
        proposal2.setInactive(false);

        List<Proposal> proposals = Arrays.asList(proposal1, proposal2);

        Page<Proposal> page = new PageImpl<>(proposals);

        when(proposalRepository.findAll(any(Example.class), any(Pageable.class))).thenReturn(page);

        Page<Proposal> resultPage = proposalService.listActiveProposal(null, null, null, PageRequest.of(0, 20));

        // Verificando se o método retornou uma página não nula
        assertNotNull(resultPage);

        // Verificando se a página contém as propostas simuladas
        assertEquals(proposals, resultPage.getContent());
    }

    @Test
    void testListAllActiveProposals() {
        Proposal proposal1 = new Proposal();
        proposal1.setId(1L);
        proposal1.setInactive(false);

        Proposal proposal2 = new Proposal();
        proposal2.setId(2L);
        proposal2.setInactive(false);

        List<Proposal> proposals = Arrays.asList(proposal1, proposal2);

        when(proposalRepository.findAll(any(Example.class))).thenReturn(proposals);

        List<Proposal> result = proposalService.listAllActiveProposals();

        // Verificando se o método retornou uma lista não nula
        assertNotNull(result);

        // Verificando se a lista contém as propostas simuladas
        assertEquals(proposals, result);
    }

    @Test
    void testCreateProposal() {
        Client mockClient = new Client();
        Proposal mockProposal = new Proposal();
        mockProposal.setClient(mockClient);

        when(proposalRepository.save(mockProposal)).thenReturn(mockProposal);

        ResponseEntity<?> responseEntity = proposalService.createProposal(mockProposal);

        // Verifica se a proposta foi criada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockProposal, responseEntity.getBody());
    }

    @Test
    void testCreateProposals() {
        Client mockClient = new Client();
        Proposal proposal1 = new Proposal();
        Proposal proposal2 = new Proposal();
        proposal1.setClient(mockClient);
        proposal2.setClient(mockClient);

        List<Proposal> proposals = Arrays.asList(proposal1, proposal2);

        when(proposalRepository.save(proposal1)).thenReturn(proposal1);
        when(proposalRepository.save(proposal2)).thenReturn(proposal2);

        ResponseEntity<?> responseEntity = proposalService.createProposals(proposals);

        // Verifica se as propostas foram criadas com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals("Total de propostas cadastradas com sucesso: 2", responseEntity.getBody());
    }

    @Test
    void testUpdateProposal() {
        Client mockClient = new Client();
        mockClient.setId(1L);
        Proposal mockProposal = new Proposal();
        mockProposal.setClient(mockClient);
        mockProposal.setId(1L);

        when(proposalRepository.save(mockProposal)).thenReturn(mockProposal);

        ResponseEntity<?> responseEntity = proposalService.updateProposal(mockProposal);

        // Verifica se a proposta foi atualizada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());

        assertEquals(mockProposal, responseEntity.getBody());
    }

    @Test
    void testDeleteProposal() {
        Long proposalId = 1L;
        Proposal mockProposal = new Proposal();
        mockProposal.setId(proposalId);

        when(proposalRepository.findById(proposalId)).thenReturn(Optional.of(mockProposal));

        ResponseEntity<?> responseEntity = proposalService.deleteProposal(proposalId);

        // Verifica se a proposta foi desativada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        Response responseBody = (Response) responseEntity.getBody();
        assertNotNull(responseBody);
        assertEquals(200, responseBody.getStatus());
        assertEquals("Proposta inativada.", responseBody.getMessage());
    }
}