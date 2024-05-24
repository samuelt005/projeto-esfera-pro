package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CityService {
    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    //  Encontra cidades pelo ID do estado
    public ResponseEntity<?> listCitiesPerState(Long stateId) {
        City exampleCity = new City();
        State exampleState = new State();
        exampleState.setId(stateId);
        exampleCity.setState(exampleState);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id");

        Example<City> example = Example.of(exampleCity, matcher);

        return ResponseEntity.ok().body(cityRepository.findAll(example));
    }
}
