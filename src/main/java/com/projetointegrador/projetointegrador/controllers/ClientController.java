package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.services.ClientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Rota para listar todos os clientes ativos com paginação
    @GetMapping("/{page}")
    @ResponseBody
    public ResponseEntity<?> listClients(
            @PathVariable int page,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Long stateId
    ) {
        int size = 20;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Client> clients = clientService.listActiveClients(searchTerm, stateId, pageRequest);

        return ResponseEntity.ok().body(clients);
    }

    // Rota para listar todos os clientes ativos sem paginação
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<?> listAllClients() {
        List<Client> clients = clientService.listAllActiveClients();
        return ResponseEntity.ok().body(clients);
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
