package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Role;
import com.projetointegrador.projetointegrador.services.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/role")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService){this.roleService = roleService;}

    @GetMapping
    public ResponseEntity<?> listRoles() {
        return roleService.listRoles();
    }

    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        return roleService.createRole(role);
    }

    @PutMapping
    public ResponseEntity<?> updateRole(@RequestBody Role role) {
        return roleService.updateRole(role);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        return roleService.deleteRole(id);
    }

}
