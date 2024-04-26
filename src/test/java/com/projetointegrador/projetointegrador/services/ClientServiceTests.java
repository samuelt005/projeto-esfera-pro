package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
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
public class ClientServiceTests {

    private final ClientRepository clientRepository = mock(ClientRepository.class);
    private final ClientService clientService = new ClientService(clientRepository);

    @Test
    void testFindOneClient() {
        Long clientId = 1L;
        Client client = new Client();
        client.setId(clientId);
        when(clientRepository.findById(clientId)).thenReturn(Optional.of(client));

        ResponseEntity<?> responseEntity = clientService.findOneClient(clientId);

        Optional<Client> optionalClient = (Optional<Client>) responseEntity.getBody();
        assert optionalClient != null;
        Client actualClient = optionalClient.orElse(null);

        // Asserting the response
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(client, actualClient);
        System.out.println("Expected client: " + client);
        System.out.println("Actual client: " + actualClient);
    }

    @Test
    void testlistActiveClients() {
        ResponseEntity<?> responseEntity = clientService.listActiveClients();

        assertEquals(HttpStatusCode.valueOf(200), responseEntity.getStatusCode());

        Object body = responseEntity.getBody();
        assertTrue(body instanceof List);
    }

    @Test
    void testCreateClient() {
        // TODO add test
    }

    @Test
    void testUpdateClient() {
        // TODO add test
    }

    @Test
    void testDeleteClient() {
        // TODO add test
    }

    @Test
    void testValidateClient() {
        // TODO add test
    }

    @Test
    void testIsAlreadyRegisteredisAlreadyRegistered() {
        // TODO add test
    }

    @Test
    void testIsCpfValid_invalid() {
        Boolean invalidCpf = clientService.isCpfValid("12345678910");
        assertFalse(invalidCpf);
    }

    @Test
    void testIsCpfValid_valid() {
        Boolean validCpf = clientService.isCpfValid("10179667025");
        assertTrue(validCpf);
    }

    @Test
    void testIsCnpjValid_invalid() {
        Boolean validCnpj = clientService.isCnpjValid("94242644000192");
        assertFalse(validCnpj);
    }

    @Test
    void testIsCnpjValid_valid() {
        Boolean validCnpj = clientService.isCnpjValid("48110821000107");
        assertTrue(validCnpj);
    }

    @Test
    void testIsCpfAlreadyRegistered() {
        // TODO add test
    }

    @Test
    void testIsCnpjAlreadyRegistered() {
        // TODO add test
    }
}