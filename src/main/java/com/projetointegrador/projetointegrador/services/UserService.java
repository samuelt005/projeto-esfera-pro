package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.UserDTO;
import com.projetointegrador.projetointegrador.models.Role;
import com.projetointegrador.projetointegrador.models.Status;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import static com.projetointegrador.projetointegrador.utils.PasswordUtils.*;

import java.util.Optional;

@Service
public class UserService {
        private final UserRepository userRepository;
        private final RoleService roleService;
        private final TeamService teamService;
        private final StatusService statusService;


        public UserService(UserRepository userRepository, RoleService roleService, TeamService teamService, StatusService statusService) {
            this.userRepository = userRepository;
            this.roleService = roleService;
            this.teamService = teamService;
            this.statusService = statusService;
        }

        // Encontra um usuário pelo id
        public ResponseEntity<?> findOneUser(Long id) {
            Optional<User> optionalUser = userRepository.findById(id);

            if (optionalUser.isPresent()) {
                return ResponseEntity.ok().body(optionalUser);
            } else {
                Response response = new Response(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // Validação de usuário
        public ResponseEntity<?> userValidation(UserDTO user) {
            try {

                // Verifica se o email e a senha estão presentes
                if (user.getEmail().isBlank() || user.getPassword().isBlank()) {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Email ou senha não estão presentes."));
                }

                // Busca usuário pelo email
                Optional<User> existentUser = userRepository.findByEmail(user.getEmail());

                // Verifica se o usuário existe
                if (existentUser.isPresent()) {
                    // Verifica se a senha está correta
                    if (verifyPassword(user.getPassword(), existentUser.get().getPassword())) {
                        return ResponseEntity.ok().body("Pode entrar");
                    } else {
                        return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Senha ou Email incorretos."));
                    }
                } else {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Usuário não encontrado."));
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar a solicitação."));
            }
        }

        // Cria um usuário
        public ResponseEntity<?> createUser(User user) {
            try {
                if (user.getEmail().isBlank() || user.getPassword().isBlank() || user.getName().isBlank() || user.getPhone().isBlank()) {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Por favor, preencha todos os campos obrigatórios: nome, email, telefone e senha."));
                }
                if (userRepository.findByEmail(user.getEmail()).isPresent()){
                    throw new Exception("Email já cadastrado.");
                }

                user.setId(null);
                user.setPassword(encryptPassword(user.getPassword()));

                if (user.getTeam() != null){
                    Team team = teamService.findById(user.getTeam().getId());
                    if (team == null){
                        throw new Exception("Time não encontrado.");
                    }
                    user.setTeam(team);
                }
                if (user.getRole() != null){
                    Role role = roleService.findById(user.getRole().getId());
                    if (role == null){
                        throw new Exception("Cargo não encontrado.");
                    }
                    user.setRole(role);
                }
                if (user.getStatus() != null){
                    Status status = statusService.findById(user.getStatus().getId());
                    if (status == null){
                        throw new Exception("Status não encontrado.");
                    }
                    user.setStatus(status);
                }

                User createdUser = userRepository.save(user);
                return ResponseEntity.ok().body(createdUser);
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
            }
        }

}

