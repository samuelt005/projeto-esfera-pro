package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.repositories.StateRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/state")
public class StateController {
    final StateRepository stateRepository;

    public StateController(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @GetMapping
    public List<State> listarEstados() {
        return stateRepository.findAll();
    }
}
