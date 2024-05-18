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
    @ResponseBody
    public ResponseEntity<?> findClient(@PathVariable("id") Long id) {
        return clientService.findOneClient(id);
    }

    // Rota para listar todos os clientes ativos
    @GetMapping
    @ResponseBody
    public ResponseEntity<?> listClients() {
        return clientService.listActiveClients();
    }

    // Rota para criar um cliente
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        return clientService.createClient(client);
    }

    // Rota para atualizar um cliente
    @PutMapping
    @ResponseBody
    public ResponseEntity<?> updateClient(@RequestBody Client client) {
        return clientService.updateClient(client);
    }

    // Rota para desativar um cliente
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
