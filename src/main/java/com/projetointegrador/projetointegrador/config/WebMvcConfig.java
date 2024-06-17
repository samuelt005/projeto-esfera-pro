package com.projetointegrador.projetointegrador.config;

import com.projetointegrador.projetointegrador.midlleware.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final JwtInterceptor jwtInterceptor;

    @Autowired
    public WebMvcConfig(JwtInterceptor jwtInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] patterns = {
                "/pagecalendario",
                "/pageclientes",
                "/pagedashboard",
                "/pageinteracoes",
                "/pagepropostas",
                "/pageconfigs",
                "/client/**",
                "/client",
                "/proposal/**",
                "/proposal",
                "/interaction/**",
                "/interaction",
                "/address/**",
                "/address",
                "/city",
                "/city/**",
                "/state",
                "/team"
        };

        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns(patterns);
    }
}
