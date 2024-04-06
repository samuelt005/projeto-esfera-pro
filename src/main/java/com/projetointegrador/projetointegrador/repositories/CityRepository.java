package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT c.id, c.name FROM City c WHERE c.state.id = :id")
    List<Object[]> findCitiesByStateId(@Param("id") Long id);
}
