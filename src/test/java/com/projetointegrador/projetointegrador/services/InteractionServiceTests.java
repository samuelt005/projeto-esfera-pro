package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.models.Proposal;
import com.projetointegrador.projetointegrador.repositories.InteractionRepository;
import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class InteractionServiceTests {
    private InteractionRepository interactionRepository;
    private InteractionService interactionService;

    @BeforeEach
    public void setUp() {
        interactionRepository = mock(InteractionRepository.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        interactionService = new InteractionService(interactionRepository, request);
    }

    @Test
    void testFindOneInteraction() {
        Long interactionId = 1L;
        Interaction interaction = new Interaction();
        interaction.setId(interactionId);
        when(interactionRepository.findById(interactionId)).thenReturn(Optional.of(interaction));

        ResponseEntity<?> responseEntity = interactionService.findOneInteraction(interactionId);

        Optional<Interaction> optionalInteraction = (Optional<Interaction>) responseEntity.getBody();
        assert optionalInteraction != null;
        Interaction actualInteraction = optionalInteraction.orElse(null);

        // Verificando se encontrou a interação
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(interaction, actualInteraction);
        System.out.println("Expected interaction: " + interaction);
        System.out.println("Actual interaction: " + actualInteraction);
    }

    @Test
    void testListActiveInteraction() {
        Interaction interaction1 = new Interaction();
        interaction1.setId(1L);
        interaction1.setInactive(false);

        Interaction interaction2 = new Interaction();
        interaction2.setId(2L);
        interaction2.setInactive(false);

        List<Interaction> interactions = Arrays.asList(interaction1, interaction2);

        Page<Interaction> page = new PageImpl<>(interactions);

        when(interactionRepository.findAll(any(Example.class), any(Pageable.class))).thenReturn(page);

        Page<Interaction> resultPage = interactionService.listActiveInteraction(null, null, null, PageRequest.of(0, 20));

        // Verificando se o método retornou uma página não nula
        assertNotNull(resultPage);

        // Verificando se a página contém as interações simuladas
        assertEquals(interactions, resultPage.getContent());
    }

    @Test
    void testCreateInteraction() {
        Client mockClient = new Client();
        Proposal mockProposal = new Proposal();
        Interaction mockInteraction = new Interaction();
        mockInteraction.setProposal(mockProposal);
        mockInteraction.getProposal().setClient(mockClient);

        when(interactionRepository.save(mockInteraction)).thenReturn(mockInteraction);

        ResponseEntity<?> responseEntity = interactionService.createInteraction(mockInteraction);

        // Verifica se a interação foi criada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockInteraction, responseEntity.getBody());
    }

    @Test
    void testUpdateInteraction() {
        Client mockClient = new Client();
        Proposal mockProposal = new Proposal();
        mockProposal.setId(1L);
        Interaction mockInteraction = new Interaction();
        mockInteraction.setProposal(mockProposal);
        mockInteraction.getProposal().setClient(mockClient);
        mockInteraction.setId(1L);

        when(interactionRepository.save(mockInteraction)).thenReturn(mockInteraction);

        ResponseEntity<?> responseEntity = interactionService.updateInteraction(mockInteraction);

        // Verifica se a interação foi atualizada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());

        assertEquals(mockInteraction, responseEntity.getBody());
    }

    @Test
    void testDeleteInteraction() {
        Long interactionId = 1L;
        Interaction mockInteraction = new Interaction();
        mockInteraction.setId(interactionId);

        when(interactionRepository.findById(interactionId)).thenReturn(Optional.of(mockInteraction));

        ResponseEntity<?> responseEntity = interactionService.deleteInteraction(interactionId);

        // Verifica se a interação foi desativada com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        Response responseBody = (Response) responseEntity.getBody();
        assertNotNull(responseBody);
        assertEquals(200, responseBody.getStatus());
        assertEquals("Interacao inativada.", responseBody.getMessage());
    }
}