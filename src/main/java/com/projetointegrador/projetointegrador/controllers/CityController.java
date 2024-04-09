package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.projections.CityProjection;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
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
    public List<City> listCitiesPerState(@PathVariable("stateId") Long stateId) {
        City exampleCity = new City();
        State exampleState = new State();
        exampleState.setId(stateId);
        exampleCity.setState(exampleState);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id");

        Example<City> example = Example.of(exampleCity, matcher);

        return cityRepository.findAll(example);
    }
}

