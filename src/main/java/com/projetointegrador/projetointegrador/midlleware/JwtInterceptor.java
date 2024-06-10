package com.projetointegrador.projetointegrador.midlleware;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projetointegrador.projetointegrador.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtils jwtUtils;

    @Autowired
    public JwtInterceptor(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");

        System.out.println(token);

        if (token == null || !jwtUtils.isValidToken(token)) {
            setJsonResponse(response, HttpStatus.UNAUTHORIZED, "Token inválido ou faltante");
            return false;
        } else if (jwtUtils.isTokenExpired(token)) {
            setJsonResponse(response, HttpStatus.UNAUTHORIZED, "Token expirado");
            return false;
        }
        return true;
    }

    private void setJsonResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(errorResponse));
    }
}
