package com.projetointegrador.projetointegrador.views;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;

@Controller
public class Error implements ErrorController {

    @RequestMapping("/error")
    public ModelAndView handleError(HttpServletResponse response, HttpServletRequest request) throws IOException {
        request.getSession().setAttribute("showError", true);
        response.sendRedirect("/");
        return new ModelAndView("pages/error");
    }
}
