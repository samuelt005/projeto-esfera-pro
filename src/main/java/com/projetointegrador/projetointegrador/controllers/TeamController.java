package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.services.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/team")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService){this.teamService = teamService;}

    @GetMapping
    public ResponseEntity<?> listTeams(){
        return teamService.listTeams();
    }

    @PostMapping
    public ResponseEntity<?> createTeam(Team team){
        return teamService.createTeam(team);
    }

    @PutMapping
    public ResponseEntity<?> updateTeam(Team team){
        return teamService.updateTeam(team);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id){
        return teamService.deleteTeam(id);
    }
}
