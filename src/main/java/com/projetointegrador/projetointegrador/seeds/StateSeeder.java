package com.projetointegrador.projetointegrador.seeds;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

// Semente para criar estados no banco
@Component
public class StateSeeder implements CommandLineRunner {
    private final ResourceLoader resourceLoader;
    private final JdbcTemplate jdbcTemplate;

    public StateSeeder(ResourceLoader resourceLoader, JdbcTemplate jdbcTemplate) {
        this.resourceLoader = resourceLoader;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT * FROM state LIMIT 1");

        if (!result.isEmpty()) {
            return;
        }

        Resource resource = resourceLoader.getResource("classpath:database/state.sql");

        try {
            String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            jdbcTemplate.execute(sql);
            System.out.println("State seeder was executed!");
        } catch (IOException e) {
            throw new RuntimeException("Error reading SQL file: ", e);
        }
    }
}

