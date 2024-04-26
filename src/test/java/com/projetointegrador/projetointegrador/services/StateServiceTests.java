package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.StateRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

@SpringBootTest
public class StateServiceTests {
    private final StateRepository stateRepository = mock(StateRepository.class);
    private final StateService stateService = new StateService(stateRepository);

    @Test
    public void testListStates() {
        ResponseEntity<?> responseEntity = stateService.listStates();

        assertEquals(HttpStatusCode.valueOf(200), responseEntity.getStatusCode());

        Object body = responseEntity.getBody();
        assertTrue(body instanceof List);
    }
}