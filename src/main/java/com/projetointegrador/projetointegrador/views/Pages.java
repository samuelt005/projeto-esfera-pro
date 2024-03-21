package com.projetointegrador.projetointegrador.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Pages {

    @GetMapping("/")
    public ModelAndView frame() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");
        return modelAndView;
    }

    @GetMapping("/clientes")
    public ModelAndView clientes() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("clientes");
        return modelAndView;
    }
}
