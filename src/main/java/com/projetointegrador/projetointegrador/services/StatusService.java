package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Status;
import com.projetointegrador.projetointegrador.repositories.StatusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class StatusService {
    private final StatusRepository statusRepository;

    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public ResponseEntity<?> listStatus() {
        try {
            return ResponseEntity.ok().body(statusRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar os status.");
        }
    }

    public Status findById(Long id) {
        try {
            if (statusRepository.existsById(id)) {
                return statusRepository.findById(id).get();
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<?> createStatus(Status status) {
        try {
            Status newStatus = statusRepository.save(status);
            return ResponseEntity.ok().body(newStatus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar o status.");
        }
    }

    public ResponseEntity<?> updateStatus(Status status) {
        try {
            if (statusRepository.existsById(status.getId())) {
                Status updatedStatus = statusRepository.save(status);
                return ResponseEntity.ok().body(updatedStatus);
            } else {
                return ResponseEntity.badRequest().body("Status não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar o status.");
        }
    }

    public ResponseEntity<?> deleteStatus(Long id) {
        try {
            if (statusRepository.existsById(id)) {
                statusRepository.deleteById(id);
                return ResponseEntity.ok().body("Status deletado.");
            } else {
                return ResponseEntity.badRequest().body("Status não encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar o status.");
        }
    }
}
