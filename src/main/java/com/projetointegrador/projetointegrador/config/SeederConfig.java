package com.projetointegrador.projetointegrador.config;

import com.projetointegrador.projetointegrador.seeds.CitySeeder;
import com.projetointegrador.projetointegrador.seeds.StateSeeder;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

// Configuração dos seeders
@Configuration
public class SeederConfig {
    private final StateSeeder stateSeeder;
    private final CitySeeder citySeeder;

    public SeederConfig(StateSeeder stateSeeder, CitySeeder citySeeder) {
        this.stateSeeder = stateSeeder;
        this.citySeeder = citySeeder;
    }

    // Ordem de execução
    @PostConstruct
    public void seedData() {
        stateSeeder.run();
        citySeeder.run();
    }
}
