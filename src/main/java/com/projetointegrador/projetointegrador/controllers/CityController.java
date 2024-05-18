package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.services.CityService;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/city")
public class CityController {
    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    // Rota para buscar cidades pelo ID do estado
    @GetMapping("byState/{stateId}")
    @ResponseBody
    public ResponseEntity<?> listCitiesPerState(@PathVariable("stateId") Long stateId) {
        return cityService.listCitiesPerState(stateId);
    }
}

