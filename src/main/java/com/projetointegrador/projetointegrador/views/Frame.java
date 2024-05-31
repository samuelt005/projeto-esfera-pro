package com.projetointegrador.projetointegrador.views;

import com.projetointegrador.projetointegrador.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.security.Key;

@Controller
public class Frame {

    @Value("${DATABASE_IPV4}")
    private String IP;
    @Value("${APPLICATION_PORT}")
    private String PORT;

    // Rota para pegar o frame base do site
    @GetMapping("/")
    public ModelAndView frame(HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("frame");
        modelAndView.addObject("IP", IP);
        modelAndView.addObject("PORT", PORT);
        Boolean showError = (Boolean) request.getSession().getAttribute("showError");
        modelAndView.addObject("showError", showError != null ? showError : false);
        request.getSession().removeAttribute("showError");
        return modelAndView;
    }
}
