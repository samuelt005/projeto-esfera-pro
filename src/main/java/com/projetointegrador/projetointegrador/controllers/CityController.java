package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.projections.CityProjection;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/city")
public class CityController {
    final CityRepository cityRepository;

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping("byState/{stateId}")
    public List<CityProjection> listCitiesPerState(@PathVariable("stateId") Long stateId) {
        return cityRepository.findCitiesByStateId(stateId);
    }
}

