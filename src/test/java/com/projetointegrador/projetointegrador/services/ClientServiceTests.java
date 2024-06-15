package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ClientServiceTests {
    private ClientRepository clientRepository;
    private ClientService clientService;

    @BeforeEach
    public void setUp() {
        clientRepository = mock(ClientRepository.class);
        TeamRepository teamRepository = mock(TeamRepository.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        clientService = new ClientService(clientRepository, teamRepository, request);
    }

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

        // Verificando se encontrou o cliente
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(client, actualClient);
        System.out.println("Expected client: " + client);
        System.out.println("Actual client: " + actualClient);
    }

    @Test
    void testlistActiveClients() {
        Client client1 = new Client();
        client1.setId(1L);
        client1.setInactive(false);

        Client client2 = new Client();
        client2.setId(2L);
        client2.setInactive(false);

        List<Client> clients = Arrays.asList(client1, client2);

        Page<Client> page = new PageImpl<>(clients);

        when(clientRepository.findAll(any(Example.class), any(Pageable.class))).thenReturn(page);

        Page<Client> resultPage = clientService.listActiveClients(null, null, PageRequest.of(0, 20));

        // Verificando se o método retornou uma página não nula
        assertNotNull(resultPage);

        // Verificando se a página contém as interações simuladas
        assertEquals(clients, resultPage.getContent());
    }

    @Test
    void testCreateClient() {
        Address mockAddress = new Address();
        Client mockClient = new Client();
        mockClient.setAddress(mockAddress);

        when(clientRepository.save(mockClient)).thenReturn(mockClient);

        ResponseEntity<?> responseEntity = clientService.createClient(mockClient);

        // Verifica se o cliente foi criado com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(mockClient, responseEntity.getBody());
    }

    @Test
    void testUpdateClient() {
        Address mockAddress = new Address();
        mockAddress.setId(1L);
        Client mockClient = new Client();
        mockClient.setAddress(mockAddress);
        mockClient.setId(1L);
        mockClient.setCpf("10179667025");
        mockClient.setCnpj("48110821000107");

        when(clientRepository.save(mockClient)).thenReturn(mockClient);

        ResponseEntity<?> responseEntity = clientService.updateClient(mockClient);

        // Verifica se o cliente foi atualizado com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());

        assertEquals(mockClient, responseEntity.getBody());
    }

    @Test
    void testDeleteClient() {
        Long clientId = 1L;
        Client mockClient = new Client();
        mockClient.setId(clientId);

        when(clientRepository.findById(clientId)).thenReturn(Optional.of(mockClient));

        ResponseEntity<?> responseEntity = clientService.deleteClient(clientId);

        // Verifica se o cliente foi desativado com sucesso e compara o status da request
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        Response responseBody = (Response) responseEntity.getBody();
        assertNotNull(responseBody);
        assertEquals(200, responseBody.getStatus());
        assertEquals("Cliente inativado.", responseBody.getMessage());
    }

    @Test
    void testIsAlreadyRegistered() {
        Client mockClient = new Client();
        mockClient.setId(1L);
        mockClient.setCpf("12345678910");
        mockClient.setCnpj("12345678901234");

        when(clientRepository.findByCpf(mockClient.getCpf())).thenReturn(Optional.of(mockClient));
        when(clientRepository.findByCnpj(mockClient.getCpf())).thenReturn(Optional.of(mockClient));

        // Se o CPF e CNPJ forem o mesmo, mas o ID não, então o método deverá retornar True
        assertTrue(clientService.isAlreadyRegistered(mockClient.getCpf(), mockClient.getCnpj(), 2L));

        // Se o CPF, CNPJ e ID existem no banco então o método deverá retornar False
        assertFalse(clientService.isAlreadyRegistered(mockClient.getCpf(), mockClient.getCnpj(), mockClient.getId()));
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
        Client mockClient = new Client();
        mockClient.setCpf("12345678910");
        mockClient.setId(1L);

        when(clientRepository.findByCpf(mockClient.getCpf())).thenReturn(Optional.of(mockClient));

        // Se o CPF e ID for o mesmo o método deverá retornar false
        assertFalse(clientService.isCpfAlreadyRegistered(mockClient.getCpf(), mockClient.getId()));

        // Se o CPF for o mesmo, mas o ID não o método deverá retornar true
        assertTrue(clientService.isCpfAlreadyRegistered(mockClient.getCpf(), 2L));
    }

    @Test
    void testIsCnpjAlreadyRegistered() {
        Client mockClient = new Client();
        mockClient.setCnpj("01176651000108");
        mockClient.setId(1L);

        when(clientRepository.findByCnpj(mockClient.getCnpj())).thenReturn(Optional.of(mockClient));

        // Se o CNPJ e ID for o mesmo o método deverá retornar false
        assertFalse(clientService.isCnpjAlreadyRegistered(mockClient.getCnpj(), mockClient.getId()));

        // Se o CNPJ for o mesmo, mas o ID não o método deverá retornar true
        assertTrue(clientService.isCnpjAlreadyRegistered(mockClient.getCnpj(), 2L));
    }
}