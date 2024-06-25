package com.projetointegrador.projetointegrador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class ProjetointegradorApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjetointegradorApplication.class, args);
    }

    @Component
    public static class InitialLog implements CommandLineRunner {
        @Value("${APPLICATION_IPV4}")
        private String IP;
        @Value("${APPLICATION_PORT}")
        private String PORT;

        @Override
        public void run(String... args) {
            String greenColor = "\033[0;32m";
            String resetColor = "\033[0m";
            System.out.println(greenColor + "The application has started successfully. Access the website via the following link: http://" + IP + ":" + PORT + "/" + resetColor);
        }
    }
}
