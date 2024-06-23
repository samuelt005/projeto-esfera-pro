package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.TeamRepository;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.Random;

@Service
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final HttpServletRequest request;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository, HttpServletRequest request) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.request = request;
    }

    public ResponseEntity<?> getTeam() {
        try {
            Long teamId = (Long) request.getAttribute("teamId");

            return ResponseEntity.ok().body(teamRepository.findById(teamId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar equipe.");
        }
    }

    public ResponseEntity<?> listTeamMembers() {
        try {
            User exampleUser = new User();
            Team exampleTeam = new Team();
            exampleTeam.setId((Long) request.getAttribute("teamId"));
            exampleUser.setTeam(exampleTeam);
            exampleUser.setStatus(true);

            ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

            Example<User> example = Example.of(exampleUser, matcher);

            return ResponseEntity.ok().body(userRepository.findAll(example));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar os membros da equipe.");
        }
    }

    public ResponseEntity<?> generateNewTeamCode() {
        try {
            Long teamId = (Long) request.getAttribute("teamId");
            Optional<Team> teamOptional = teamRepository.findById(teamId);

            if (!isProfileAllowed()) {
                Response response = new Response(HttpStatus.FORBIDDEN, "Você não tem permissão para gerar um novo código.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            if (teamOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Equipe não encontrada.");
            }

            Team team = teamOptional.get();
            String newCode = "ESFERA-" + generateRandomString();
            team.setCode(newCode);
            teamRepository.save(team);

            return ResponseEntity.ok().body(teamRepository.findById(teamId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao gerar novo código da equipe.");
        }
    }

    public Team findByCode(String code) {
        Team exampleTeam = new Team();
        exampleTeam.setCode(code);

        Example<Team> example = Example.of(exampleTeam);
        Optional<Team> result = teamRepository.findOne(example);

        return result.orElse(null);
    }

    private String generateRandomString() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < 43; i++) {
            result.append(characters.charAt(random.nextInt(characters.length())));
        }

        return result.toString();
    }

    // Verifica se o user é admin
    private Boolean isProfileAllowed() {
        return Objects.equals(request.getAttribute("profile"), "admin");
    }
}
