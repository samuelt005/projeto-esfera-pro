package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.CityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@SpringBootTest
public class CityServiceTests {
    private final CityRepository cityRepository = mock(CityRepository.class);
    private final CityService cityService = new CityService(cityRepository);

    @Test
    public void testListCitiesPerState() {
        Long stateId = 1L;

        ResponseEntity<?> responseEntity = cityService.listCitiesPerState(stateId);

        assertEquals(HttpStatusCode.valueOf(200), responseEntity.getStatusCode());

        Object body = responseEntity.getBody();
        assertTrue(body instanceof List);
    }
}