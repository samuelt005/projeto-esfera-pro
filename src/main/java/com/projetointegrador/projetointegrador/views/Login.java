package com.projetointegrador.projetointegrador.views;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Login {
    @Value("${DATABASE_IPV4}")
    private String IP;
    @Value("${APPLICATION_PORT}")
    private String PORT;

    // Rota para pegar o frame base do site
    @GetMapping("/login")
    public ModelAndView frame(HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        modelAndView.addObject("IP", IP);
        modelAndView.addObject("PORT", PORT);
        return modelAndView;
    }
}
