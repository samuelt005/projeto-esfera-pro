package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.ChangePasswordDTO;
import com.projetointegrador.projetointegrador.dto.LogInDTO;
import com.projetointegrador.projetointegrador.dto.SingUpDTO;
import com.projetointegrador.projetointegrador.models.JwtToken;
import com.projetointegrador.projetointegrador.models.Team;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import com.projetointegrador.projetointegrador.utils.JwtUtils;
import com.projetointegrador.projetointegrador.utils.PasswordUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.projetointegrador.projetointegrador.utils.PasswordUtils.encryptPassword;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTests {

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TeamService teamService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private HttpServletRequest request;

    @BeforeEach
    public void setUp() {
        userService = new UserService(userRepository, teamService, jwtUtils, request);
    }

    @Test
    void testUserLogIn_Success() {
        String userEmail = "user@example.com";
        String userPassword = "password";
        User mockUser = new User();
        mockUser.setEmail(userEmail);
        mockUser.setPassword(PasswordUtils.encryptPassword(userPassword));

        LogInDTO logInDTO = new LogInDTO();
        logInDTO.setEmail(userEmail);
        logInDTO.setPassword(userPassword);

        when(userRepository.findOne(any())).thenReturn(Optional.of(mockUser));

        JwtToken mockJwtToken = new JwtToken("mockToken", 3600000L);
        when(jwtUtils.generateToken(eq(mockUser), any(Long.class))).thenReturn(mockJwtToken);

        ResponseEntity<?> responseEntity = userService.userLogIn(logInDTO);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("mockToken", ((JwtToken) responseEntity.getBody()).getToken());
    }


    @Test
    void testUserLogIn_InvalidCredentials() {
        // Mock do usuário existente, mas senha incorreta
        String userEmail = "user@example.com";
        String userPassword = "password";
        User mockUser = new User();
        mockUser.setEmail(userEmail);
        mockUser.setPassword("wrongpassword");

        LogInDTO logInDTO = new LogInDTO();
        logInDTO.setEmail(userEmail);
        logInDTO.setPassword(userPassword);

        when(userRepository.findOne(any())).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> responseEntity = userService.userLogIn(logInDTO);

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("E-mail ou senha incorretos", ((Response) responseEntity.getBody()).getMessage());
    }

    @Test
    void testUserSignUp_Success() {
        // Mock do usuário a ser criado
        SingUpDTO signUpDTO = new SingUpDTO();
        signUpDTO.setName("John Doe");
        signUpDTO.setEmail("john.doe@example.com");
        signUpDTO.setPassword("password");
        signUpDTO.setPhone("123456789");
        signUpDTO.setTeam("ESFERA-123");

        Team mockTeam = new Team();
        mockTeam.setId(1L);

        when(teamService.findByCode(anyString())).thenReturn(mockTeam);
        when(userRepository.save(any())).thenAnswer(invocation -> {
            User newUser = invocation.getArgument(0);
            newUser.setId(1L); // Simula a atribuição de ID pelo repositório
            return newUser;
        });

        ResponseEntity<?> responseEntity = userService.userSignUp(signUpDTO);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(1L, ((User) responseEntity.getBody()).getId());
    }

    @Test
    void testChangePassword_Success() {
        String userEmail = "user@example.com";
        String oldPassword = "oldpassword";
        String newPassword = "newpassword";

        ChangePasswordDTO changePasswordDTO = new ChangePasswordDTO();
        changePasswordDTO.setEmail(userEmail);
        changePasswordDTO.setOldPassword(oldPassword);
        changePasswordDTO.setNewPassword(newPassword);

        User mockUser = new User();
        mockUser.setEmail(userEmail);
        mockUser.setPassword(encryptPassword(oldPassword));

        when(userRepository.findOne(any())).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> responseEntity = userService.changePassword(changePasswordDTO);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Senha alterada com sucesso!", ((Response) responseEntity.getBody()).getMessage());
    }

    @Test
    void testDisableUser_Success() {
        Long userId = 1L;
        Long teamId = 1L;

        User mockUser = new User();
        Team mockTeam = new Team();
        mockTeam.setId(teamId); // Definir o ID do mockTeam
        mockUser.setId(userId);
        mockUser.setTeam(mockTeam);
        mockUser.setStatus(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(request.getAttribute("profile")).thenReturn("admin");

        ResponseEntity<?> responseEntity = userService.disableUser(userId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Usuário desativado.", ((Response) responseEntity.getBody()).getMessage());
    }
}
