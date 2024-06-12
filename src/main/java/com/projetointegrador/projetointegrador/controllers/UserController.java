package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.dto.UserCreateDTO;
import com.projetointegrador.projetointegrador.dto.UserDTO;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/validation")
    public ResponseEntity<?> validateUser(@RequestBody UserDTO user) {
        return userService.userValidation(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserCreateDTO newUser) {
        return userService.createUser(newUser);
    }


}
