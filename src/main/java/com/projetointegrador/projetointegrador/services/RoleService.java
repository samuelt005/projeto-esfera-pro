package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Role;
import com.projetointegrador.projetointegrador.repositories.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public ResponseEntity<?> listRoles() {
        try {
            return ResponseEntity.ok().body(roleRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar as roles.");
        }
    }

    public Role findById(Long id) {
        try {
            if (roleRepository.existsById(id)) {
                return roleRepository.findById(id).get();
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<?> createRole(Role role) {
        try {
            role.setId(null);
            Role newRole = roleRepository.save(role);
            return ResponseEntity.ok().body(newRole);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar cargo.");
        }
    }

    public ResponseEntity<?> updateRole(Role role) {
        try {
            if (roleRepository.existsById(role.getId())) {
                Role updatedRole = roleRepository.save(role);
                return ResponseEntity.ok().body(updatedRole);
            } else {
                return ResponseEntity.badRequest().body("Cargo não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar cargo.");
        }
    }

    public ResponseEntity<?> deleteRole(Long id) {
        try {
            if (roleRepository.existsById(id)) {
                roleRepository.deleteById(id);
                return ResponseEntity.ok().body("Cargo deletado.");
            } else {
                return ResponseEntity.badRequest().body("Cargo não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar cargo.");
        }
    }

}
