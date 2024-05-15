package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Status;
import com.projetointegrador.projetointegrador.services.StatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/status")
public class StatusController {
    private final StatusService statusService;

    public StatusController(StatusService statusService){this.statusService = statusService;}

    @GetMapping
    public ResponseEntity<?> listStatus(){
        return statusService.listStatus();
    }

    @PostMapping
    public ResponseEntity<?> createStatus(@RequestBody Status status){
        return statusService.createStatus(status);
    }

    @PutMapping
    public ResponseEntity<?> updateStatus(@RequestBody Status status){
        return statusService.updateStatus(status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Long id){
        return statusService.deleteStatus(id);
    }
}
