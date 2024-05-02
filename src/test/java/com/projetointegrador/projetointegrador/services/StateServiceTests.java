package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.State;
import com.projetointegrador.projetointegrador.repositories.StateRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class StateServiceTests {
    private final StateRepository stateRepository = mock(StateRepository.class);
    private final StateService stateService = new StateService(stateRepository);

    @Test
    public void testListStates() {
        State exampleState1 = new State();
        exampleState1.setId(1L);
        State exampleState2 = new State();
        exampleState2.setId(2L);
        State exampleState3 = new State();
        exampleState3.setId(3L);

        List<State> states = new ArrayList<>();

        states.add(exampleState1);
        states.add(exampleState2);
        states.add(exampleState3);

        when(stateRepository.findAll()).thenReturn(states);

        ResponseEntity<?> response = stateService.listStates();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<State> responseCities = (List<State>) response.getBody();
        assert responseCities != null;
        assertEquals(3, responseCities.size());

        assertEquals(1L, responseCities.get(0).getId());
        assertEquals(2L, responseCities.get(1).getId());
        assertEquals(3L, responseCities.get(2).getId());
    }
}