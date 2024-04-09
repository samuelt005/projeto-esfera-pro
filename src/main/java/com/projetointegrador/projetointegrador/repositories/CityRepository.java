package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.projections.CityProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
}
