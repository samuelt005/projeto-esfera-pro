package com.projetointegrador.projetointegrador.controller;

import com.projetointegrador.projetointegrador.model.Client;
import com.projetointegrador.projetointegrador.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/client")
public class ClientController {
    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public List<Client> listarClientes() {
        return clientRepository.findAll();
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

    /*@PatchMapping("/{id}")
    public ResponseEntity<Client> atualizarUsuarioParcial(@PathVariable Long id, @RequestBody Client client) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            Client usuarioExistente = optionalClient.get();

            if (client.getNome() != null) {
                usuarioExistente.setNome(usuarioAtualizado.getNome());
            }
            if (usuarioAtualizado.getEmail() != null) {
                usuarioExistente.setEmail(usuarioAtualizado.getEmail());
            }

            Usuario usuarioAtualizadoSalvo = usuarioRepository.save(usuarioExistente);
            return ResponseEntity.ok(usuarioAtualizadoSalvo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }*/

    @DeleteMapping("/{id}")
    public void deletarClient(@PathVariable Long id) {

    }

}
