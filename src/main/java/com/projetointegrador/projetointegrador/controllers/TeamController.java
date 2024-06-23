package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.services.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/team")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<?> getTeam() {
        return teamService.getTeam();
    }

    @GetMapping("/members")
    public ResponseEntity<?> listTeamMembers() {
        return teamService.listTeamMembers();
    }

    @GetMapping("/generatenewcode")
    public ResponseEntity<?> generateNewTeamCode() {
        return teamService.generateNewTeamCode();
    }
}
