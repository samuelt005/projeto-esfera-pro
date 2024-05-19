package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.services.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

