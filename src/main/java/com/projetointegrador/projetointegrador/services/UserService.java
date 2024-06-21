package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.ChangePasswordDTO;
import com.projetointegrador.projetointegrador.dto.SingUpDTO;
import com.projetointegrador.projetointegrador.dto.LogInDTO;
import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import com.projetointegrador.projetointegrador.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import static com.projetointegrador.projetointegrador.utils.PasswordUtils.*;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TeamService teamService;
    private final JwtUtils jwtUtils;
    private final HttpServletRequest request;

    public UserService(UserRepository userRepository, TeamService teamService, JwtUtils jwtUtils, HttpServletRequest request) {
        this.userRepository = userRepository;
        this.teamService = teamService;
        this.jwtUtils = jwtUtils;
        this.request = request;
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

            long userCount = findByTeam(team).size();
            String profile = (userCount == 0) ? "admin" : "user";

            User newUser = new User();
            newUser.setName(user.getName());
            newUser.setEmail(user.getEmail());
            newUser.setPassword(encryptPassword(user.getPassword()));
            newUser.setPhone(user.getPhone());
            newUser.setProfile(profile);
            newUser.setTeam(team);
            newUser.setStatus(true);
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

    // Desativa um usuário pelo id
    public ResponseEntity<?> disableUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);

        // TODO verificar se o user é admin

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Verifica se o time do user é o mesmo do token
            Long teamId = getTeamIdFromRequest();
            if (!user.getTeam().getId().equals(teamId)) {
                Response response = new Response(HttpStatus.FORBIDDEN, "Você não tem permissão para desativar este usuário.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            user.setStatus(false);
            userRepository.save(user);
            Response response = new Response(HttpStatus.OK, "Usuário desativado.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
            return ResponseEntity.badRequest().body(response);
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

    public List<User> findByTeam(Team team) {
        User exampleUser = new User();
        exampleUser.setTeam(team);

        Example<User> example = Example.of(exampleUser);
        return userRepository.findAll(example);
    }

    // Busca o teamId da request
    private Long getTeamIdFromRequest() {
        return (Long) request.getAttribute("teamId");
    }
}

