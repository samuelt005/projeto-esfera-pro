package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.services.StateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/state")
public class StateController {
    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    // Rota para listar todos os estados
    @GetMapping
    public ResponseEntity<?> listStates() {
        return stateService.listStates();
    }
}
