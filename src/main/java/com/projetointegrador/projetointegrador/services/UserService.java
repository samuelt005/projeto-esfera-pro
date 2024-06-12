package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.UserCreateDTO;
import com.projetointegrador.projetointegrador.dto.UserDTO;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import com.projetointegrador.projetointegrador.utils.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import static com.projetointegrador.projetointegrador.utils.PasswordUtils.*;

import java.util.Optional;

@Service
public class UserService {
        private final UserRepository userRepository;
        private final TeamService teamService;

        private final JwtUtils jwtUtils;


        public UserService(UserRepository userRepository, TeamService teamService, JwtUtils jwtUtils) {
            this.userRepository = userRepository;
            this.teamService = teamService;
            this.jwtUtils = jwtUtils;
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
                        try {
                            // Gera um token JWT
                            return ResponseEntity.ok().body(jwtUtils.generateToken(existentUser.get(), 3600000));
                        } catch (Exception e) {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
                        }
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
        public ResponseEntity<?> createUser(UserCreateDTO user) {
            try {
                if (user.getEmail().isBlank() || user.getPassword().isBlank() || user.getName().isBlank() || user.getPhone().isBlank() || user.getTeam().isBlank()){
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Por favor, preencha todos os campos obrigatórios: nome, email, telefone, senha e o numero da sua equipe."));
                }
                if (userRepository.findByEmail(user.getEmail()).isPresent()){
                    throw new Exception("Email já cadastrado.");
                }

                Team team = teamService.findByCode(user.getTeam());
                if (team == null) {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Código da equipe inválido."));
                }

                User user1 = new User(
                    user.getName(),
                    user.getEmail(),
                    encryptPassword(user.getPassword()),
                    user.getPhone(),
                    team
                );


                User createdUser = userRepository.save(user1);
                return ResponseEntity.ok().body(createdUser);
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
            }
        }

}

