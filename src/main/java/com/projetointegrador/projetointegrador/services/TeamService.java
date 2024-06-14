package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.repositories.TeamRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TeamService {
    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public ResponseEntity<?> listTeams() {
        try {
            return ResponseEntity.ok().body(teamRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar os times.");
        }
    }

    public Team findByCode(String code) {
        try {
            return teamRepository.findByCode(code).get();
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<?> createTeam(Team team) {
        try {
            Team newTeam = teamRepository.save(team);
            return ResponseEntity.ok().body(newTeam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar o time.");
        }
    }

    public ResponseEntity<?> updateTeam(Team team) {
        try {
            if (teamRepository.existsById(team.getId())) {
                Team updatedTeam = teamRepository.save(team);
                return ResponseEntity.ok().body(updatedTeam);
            } else {
                return ResponseEntity.badRequest().body("Time não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar o time.");
        }
    }

    public ResponseEntity<?> deleteTeam(Long id) {
        try {
            if (teamRepository.existsById(id)) {
                teamRepository.deleteById(id);
                return ResponseEntity.ok().body("Time deletado.");
            } else {
                return ResponseEntity.badRequest().body("Time não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar o time.");
        }
    }
}
