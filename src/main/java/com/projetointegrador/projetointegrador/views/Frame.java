package com.projetointegrador.projetointegrador.views;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Frame {

    @Value("${DATABASE_IPV4}")
    private String IP;
    @Value("${APPLICATION_PORT}")
    private String PORT;

    // Rota para pegar o frame base do site
    @GetMapping("/")
    public ModelAndView frame() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("frame");
        modelAndView.addObject("IP", IP);
        modelAndView.addObject("PORT", PORT);
        return modelAndView;
    }
}
