package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import com.projetointegrador.projetointegrador.response.Response;
import com.projetointegrador.projetointegrador.validatos.CnpjValidator;
import com.projetointegrador.projetointegrador.validatos.CpfValidator;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ResponseEntity<?> findOneClient(Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);

        if (optionalClient.isPresent()) {
            return ResponseEntity.ok().body(optionalClient);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    public ResponseEntity<?> listActiveClients() {
        Client exampleClient = new Client();
        exampleClient.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

        Example<Client> example = Example.of(exampleClient, matcher);

        List<Client> clients = clientRepository.findAll(example);
        return ResponseEntity.ok().body(clients);
    }

    public ResponseEntity<?> createClient(Client client) {
        client.setInactive(false);
        client.setId(null);
        client.getAddress().setId(null);

        if (client.getCpf() != null) {
            if (!this.isCpfValid(client.getCpf())) {
                Response response = new Response(HttpStatus.BAD_REQUEST, "CPF inválido.");
                return ResponseEntity.badRequest().body(response);
            }
        }

        if (client.getCnpj() != null) {
            if (!this.isCpnjValid(client.getCnpj())) {
                Response response = new Response(HttpStatus.BAD_REQUEST, "CNPJ inválido.");
                return ResponseEntity.badRequest().body(response);
            }
        }

        Client createdClient = clientRepository.save(client);
        return ResponseEntity.ok().body(createdClient);
    }


    public ResponseEntity<?> updateClient(Client client) {
        client.setId(null);
        client.getAddress().setId(null);

        if (client.getId() == null) {
            Response response = new Response(HttpStatus.BAD_REQUEST, "Id de cliente não está presente.");
            return ResponseEntity.badRequest().body(response);
        }

        if (client.getAddress().getId() == null) {
            Response response = new Response(HttpStatus.BAD_REQUEST, "Id de endereço não está presente.");
            return ResponseEntity.badRequest().body(response);
        }

        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok().body(updatedClient);
    }

    public ResponseEntity<?> deleteClient(Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);

        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            client.setInactive(true);
            clientRepository.save(client);
            Response response = new Response(HttpStatus.OK, "Cliente inativado.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    public Boolean isCpfValid(String cpf) {
        CpfValidator validator = new CpfValidator();
        return validator.isValid(cpf);
    }

    public Boolean isCpnjValid(String cnpj) {
        CnpjValidator validator = new CnpjValidator();
        return validator.isValid(cnpj);
    }
}
