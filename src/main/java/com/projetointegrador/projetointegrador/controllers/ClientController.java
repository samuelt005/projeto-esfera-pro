package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.services.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Rota para encontrar um cliente pelo ID
    @GetMapping("byId/{id}")
    public ResponseEntity<?> findClient(@PathVariable("id") Long id) {
        return clientService.findOneClient(id);
    }

    // Rota para listar todos os clientes ativos
    @GetMapping
    public ResponseEntity<?> listClients() {
        return clientService.listActiveClients();
    }

    // Rota para criar um cliente
    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        return clientService.createClient(client);
    }

    // Rota para atualizar um cliente
    @PutMapping
    public ResponseEntity<?> updateClient(@RequestBody Client client) {
        return clientService.updateClient(client);
    }

    // Rota para desativar um cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
