package com.projetointegrador.projetointegrador.midlleware;

import com.projetointegrador.projetointegrador.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

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
        if (token == null || !jwtUtils.isValidToken(token)) {
            response.sendRedirect("/login");
            return false;
        } else if (jwtUtils.isTokenExpired(token)) {
            response.sendRedirect("/login");
            return false;
        }
        return true;
    }
}
