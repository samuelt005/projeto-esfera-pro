package com.projetointegrador.projetointegrador.controller;

import com.projetointegrador.projetointegrador.model.State;
import com.projetointegrador.projetointegrador.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/state")
public class StateController {
    @Autowired
    StateRepository stateRepository;

    @GetMapping
    public List<State> listarEstado(){
        return stateRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<State> criarEstado(@RequestBody State state){
        try{
            stateRepository.save(state);
            return ResponseEntity.ok(state);
        }catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<State> atualizarEstado(@PathVariable Long id, @RequestBody State newState){
        return stateRepository.findById(id)
                .map(state -> {
                    state.setName(newState.getName());
                    state.setUf(newState.getUf());
                    stateRepository.save(state);
                    return ResponseEntity.ok(state);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarEstado(@PathVariable Long id) {
        try {
            stateRepository.deleteById(id);
            return ResponseEntity.ok("Estado deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha ao deletar estado");
        }
    }
}
