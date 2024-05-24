package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class CityServiceTests {
    private final CityRepository cityRepository = mock(CityRepository.class);
    private final CityService cityService = new CityService(cityRepository);

    @Test
    public void testListCitiesPerState() {
        Long stateId = 1L;
        State exampleState = new State();
        exampleState.setId(stateId);

        List<City> cities = new ArrayList<>();
        City exampleCity1 = new City();
        exampleCity1.setState(exampleState);
        City exampleCity2 = new City();
        exampleCity2.setState(exampleState);
        cities.add(exampleCity1);
        cities.add(exampleCity2);

        when(cityRepository.findAll(any(Example.class))).thenReturn(cities);

        ResponseEntity<?> response = cityService.listCitiesPerState(stateId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<City> responseCities = (List<City>) response.getBody();
        assert responseCities != null;
        assertEquals(2, responseCities.size());

        assertEquals(stateId, responseCities.get(0).getState().getId());
        assertEquals(stateId, responseCities.get(1).getState().getId());
    }
}