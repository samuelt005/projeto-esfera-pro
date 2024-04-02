package com.projetointegrador.projetointegrador.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Frame {
    @GetMapping("/")
    public ModelAndView frame() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("frame");
        return modelAndView;
    }
}
