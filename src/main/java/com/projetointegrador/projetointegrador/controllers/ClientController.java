package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
public class ClientController {
    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public List<Client> listarClientes() {
        return clientRepository.findActiveClients();
    }

    @PostMapping
    public Client criarCliente(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("/{id}")
    public Client atualizarCliente(@PathVariable Long id, @RequestBody Client newClient) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setName(newClient.getName());
                    client.setCompany(newClient.getCompany());
                    return clientRepository.save(client);
                })
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public Client deletarClient(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setInactive(true);
                    return clientRepository.save(client);
                })
                .orElseThrow();
    }
}
