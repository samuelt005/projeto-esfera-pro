package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Interaction;
import com.projetointegrador.projetointegrador.repositories.InteractionRepository;
import com.projetointegrador.projetointegrador.responses.Response;
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

        Page<Interaction> resultPage = interactionService.listActiveInteraction(PageRequest.of(0, 20));

        // Verificando se o método retornou uma página não nula
        assertNotNull(resultPage);

        // Verificando se a página contém as interações simuladas
        assertEquals(interactions, resultPage.getContent());
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