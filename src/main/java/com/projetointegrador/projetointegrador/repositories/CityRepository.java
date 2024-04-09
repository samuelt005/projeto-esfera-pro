package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
