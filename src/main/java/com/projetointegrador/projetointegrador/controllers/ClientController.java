package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/client")
public class ClientController {
    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository, AddressRepository addressRepository, CityRepository cityRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping("byId/{id}")
    public Optional<Client> findClient(@PathVariable("id") Long id) {
        return clientRepository.findById(id);
    }

    @GetMapping
    public List<Client> listActiveClients() {
        Client exampleClient = new Client();
        exampleClient.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id");

        Example<Client> example = Example.of(exampleClient, matcher);

        return clientRepository.findAll(example);
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        client.setInactive(false);
        Client createdClient = clientRepository.save(client);
        return ResponseEntity.ok().body(createdClient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Client> deleteClient(@PathVariable Long id) {
        return clientRepository.findById(id).map(client -> {
            client.setInactive(true);
            Client updatedClient = clientRepository.save(client);
            return ResponseEntity.ok().body(updatedClient);
        }).orElseThrow();
    }
}
