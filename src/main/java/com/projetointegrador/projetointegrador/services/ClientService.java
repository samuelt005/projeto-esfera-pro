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
        if (validateClient(client)) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Dados do cliente inválidos."));
        }

        if (isAlreadyRegistered(client.getCpf(), client.getCnpj())) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "CPF ou CNPJ já está cadastrado."));
        }

        client.setInactive(false);
        client.setId(null);
        client.getAddress().setId(null);

        Client createdClient = clientRepository.save(client);
        return ResponseEntity.ok().body(createdClient);
    }

    public ResponseEntity<?> updateClient(Client client) {
        if (client.getId() == null || client.getAddress().getId() == null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs de cliente ou endereço não estão presentes."));
        }

        if (validateClient(client)) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Dados do cliente inválidos."));
        }

        if (isAlreadyRegistered(client.getCpf(), client.getCnpj())) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "CPF ou CNPJ já está cadastrado."));
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

    private boolean validateClient(Client client) {
        if (client.getCpf() != null && !isCpfValid(client.getCpf())) {
            return true;
        }

        return client.getCnpj() != null && !isCnpjValid(client.getCnpj());
    }

    private boolean isAlreadyRegistered(String cpf, String cnpj) {
        if (cpf != null && isCpfAlreadyRegistered(cpf)) {
            return true;
        }

        return cnpj != null && isCnpjAlreadyRegistered(cnpj);
    }

    private Boolean isCpfValid(String cpf) {
        CpfValidator validator = new CpfValidator();
        return validator.isValid(cpf);
    }

    private Boolean isCnpjValid(String cnpj) {
        CnpjValidator validator = new CnpjValidator();
        return validator.isValid(cnpj);
    }

    private boolean isCpfAlreadyRegistered(String cpf) {
        Optional<Client> existentCpf = clientRepository.findByCpf(cpf);
        return existentCpf.isPresent();
    }

    private boolean isCnpjAlreadyRegistered(String cnpj) {
        Optional<Client> existentCnpj = clientRepository.findByCnpj(cnpj);
        return existentCnpj.isPresent();
    }
}
