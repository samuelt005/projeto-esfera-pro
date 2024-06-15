package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.dto.SingUpDTO;
import com.projetointegrador.projetointegrador.dto.LogInDTO;
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

    @PostMapping("/login")
    public ResponseEntity<?> userLogIn(@RequestBody LogInDTO user) {
        return userService.userLogIn(user);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> userSignUp(@RequestBody SingUpDTO newUser) {
        return userService.userSignUp(newUser);
    }


}
