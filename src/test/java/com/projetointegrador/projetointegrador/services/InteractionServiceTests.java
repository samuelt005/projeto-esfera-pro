package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.repositories.InteractionRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class InteractionServiceTests {

    private final InteractionRepository interactionRepository = mock(InteractionRepository.class);
    private final InteractionService interactionService = new InteractionService(interactionRepository);

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

        // Asserting the response
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(interaction, actualInteraction);
        System.out.println("Expected interaction: " + interaction);
        System.out.println("Actual interaction: " + actualInteraction);
    }

    @Test
    void testlistActiveInteractions() {
        ResponseEntity<?> responseEntity = interactionService.listActiveInteraction();

        assertEquals(HttpStatusCode.valueOf(200), responseEntity.getStatusCode());

        Object body = responseEntity.getBody();
        assertTrue(body instanceof List);
    }

    @Test
    void testCreateInteraction() {
        Client mockClient = new Client();
        Interaction mockInteraction = new Interaction();
        mockInteraction.setClient(mockClient);

        when(interactionRepository.save(mockInteraction)).thenReturn(mockInteraction);

        ResponseEntity<?> responseEntity = interactionService.createInteraction(mockInteraction);

        // Verifica se a interaction foi criado com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockInteraction, responseEntity.getBody());
    }

    @Test
    void testUpdateInteraction() {
        Client mockClient = new Client();
        mockClient.setId(1L);
        Interaction mockInteraction = new Interaction();
        mockInteraction.setClient(mockClient);
        mockInteraction.setId(1L);

        when(interactionRepository.save(mockInteraction)).thenReturn(mockInteraction);

        ResponseEntity<?> responseEntity = interactionService.updateInteraction(mockInteraction);

        // Verifica se a interaction foi atualizado com sucesso e compara o status da request
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

        // Verifica se a interaction foi desativado com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        Response responseBody = (Response) responseEntity.getBody();
        assertNotNull(responseBody);
        assertEquals(200, responseBody.getStatus());
        assertEquals("Interacao inativada.", responseBody.getMessage());
    }
}