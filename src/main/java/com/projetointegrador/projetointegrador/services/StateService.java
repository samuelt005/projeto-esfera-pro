package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.StateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class StateService {
    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    // Busca todos os estados
    public ResponseEntity<?> listStates() {
        return ResponseEntity.ok().body(stateRepository.findAll());
    }
}
