package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.ChangePasswordDTO;
import com.projetointegrador.projetointegrador.dto.SingUpDTO;
import com.projetointegrador.projetointegrador.dto.LogInDTO;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import com.projetointegrador.projetointegrador.utils.JwtUtils;
import org.springframework.data.domain.Example;
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

    // Validação de usuário
    public ResponseEntity<?> userLogIn(LogInDTO user) {
        try {
            // Verifica se o email e a senha estão presentes
            if (isLogInDataInvalid(user)) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Por favor informe o e-mail e a senha"));
            }

            // Busca usuário pelo email
            Optional<User> existentUser = findByEmail(user.getEmail());

            if (existentUser.isPresent() && verifyPassword(user.getPassword(), existentUser.get().getPassword())) {
                return ResponseEntity.ok().body(jwtUtils.generateToken(existentUser.get(), 3600000));
            } else {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "E-mail ou senha incorretos"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar a solicitação"));
        }
    }

    // Cria um usuário
    public ResponseEntity<?> userSignUp(SingUpDTO user) {
        try {
            if (isSignUpDataInvalid(user)) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Por favor, preencha todos os campos obrigatórios: nome, email, telefone, senha e o numero da sua equipe"));
            }

            if (findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Email já cadastrado"));
            }

            Team team = teamService.findByCode(user.getTeam());
            if (team == null) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Código da equipe ausente"));
            }

            User newUser = new User(user.getName(), user.getEmail(), encryptPassword(user.getPassword()), user.getPhone(), team);
            User createdUser = userRepository.save(newUser);
            return ResponseEntity.ok().body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
        }
    }


    // Método para alterar a senha
    public ResponseEntity<?> changePassword(ChangePasswordDTO changePasswordDTO) {
        try {
            Optional<User> user = findByEmail(changePasswordDTO.getEmail());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Usuário não encontrado."));
            }

            User existingUser = user.get();
            if (!verifyPassword(changePasswordDTO.getOldPassword(), existingUser.getPassword())) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Senha atual incorreta."));
            }

            existingUser.setPassword(encryptPassword(changePasswordDTO.getNewPassword()));
            userRepository.save(existingUser);
            return ResponseEntity.ok().body(new Response(HttpStatus.OK, "Senha alterada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
        }
    }

    // Método para validar dados de login
    private boolean isLogInDataInvalid(LogInDTO user) {
        return user.getEmail().isBlank() || user.getPassword().isBlank();
    }

    // Método para validar dados de cadastro
    private boolean isSignUpDataInvalid(SingUpDTO user) {
        return user.getEmail().isBlank() || user.getPassword().isBlank() || user.getName().isBlank() || user.getPhone().isBlank() || user.getTeam().isBlank();
    }

    public Optional<User> findByEmail(String email) {
        User exampleUser = new User();
        exampleUser.setEmail(email);

        Example<User> example = Example.of(exampleUser);
        return userRepository.findOne(example);
    }
}

