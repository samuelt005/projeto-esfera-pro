package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.TeamRepository;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeamServiceTests {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private TeamService teamService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTeam() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        ResponseEntity<?> response = teamService.getTeam();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Optional.of(team), response.getBody());
    }

    @Test
    void testGetTeamError() {
        when(request.getAttribute("teamId")).thenThrow(new RuntimeException());

        ResponseEntity<?> response = teamService.getTeam();
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erro ao buscar equipe.", response.getBody());
    }

    @Test
    void testListTeamMembers() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);
        User user = new User();
        user.setTeam(team);
        user.setStatus(true);

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(userRepository.findAll(any(Example.class))).thenReturn(Collections.singletonList(user));

        ResponseEntity<?> response = teamService.listTeamMembers();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.singletonList(user), response.getBody());
    }

    @Test
    void testListTeamMembersError() {
        when(request.getAttribute("teamId")).thenThrow(new RuntimeException());

        ResponseEntity<?> response = teamService.listTeamMembers();
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erro ao listar os membros da equipe.", response.getBody());
    }

    @Test
    void testGenerateNewTeamCode() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);
        team.setCode("OLD_CODE");

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(request.getAttribute("profile")).thenReturn("admin");
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        ResponseEntity<?> response = teamService.generateNewTeamCode();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(((Optional<Team>) response.getBody()).get().getCode());
    }

    @Test
    void testGenerateNewTeamCodeNoPermission() {
        when(request.getAttribute("profile")).thenReturn("user");

        ResponseEntity<?> response = teamService.generateNewTeamCode();
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(response.getBody() instanceof Response);
        assertEquals("Você não tem permissão para gerar um novo código.", ((Response) response.getBody()).getMessage());
    }

    @Test
    void testGenerateNewTeamCodeTeamNotFound() {
        Long teamId = 1L;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(request.getAttribute("profile")).thenReturn("admin");
        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = teamService.generateNewTeamCode();
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Equipe não encontrada.", response.getBody());
    }

    @Test
    void testGenerateNewTeamCodeError() {
        when(request.getAttribute("teamId")).thenThrow(new RuntimeException());

        ResponseEntity<?> response = teamService.generateNewTeamCode();
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erro ao gerar novo código da equipe.", response.getBody());
    }

    @Test
    void testFindByCode() {
        String code = "ESFERA-TEST";
        Team team = new Team();
        team.setCode(code);

        when(teamRepository.findOne(any())).thenReturn(Optional.of(team));

        Team result = teamService.findByCode(code);
        assertNotNull(result);
        assertEquals(code, result.getCode());
    }

    @Test
    void testFindByCodeNotFound() {
        String code = "NON_EXISTENT_CODE";

        when(teamRepository.findOne(any())).thenReturn(Optional.empty());

        Team result = teamService.findByCode(code);
        assertNull(result);
    }
}
