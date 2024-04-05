package com.projetointegrador.projetointegrador.controller;

import com.projetointegrador.projetointegrador.model.City;
import com.projetointegrador.projetointegrador.model.State;
import com.projetointegrador.projetointegrador.repository.CityRepository;
import com.projetointegrador.projetointegrador.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/city")
public class CityController {
    @Autowired
    CityRepository cityRepository;
    @Autowired
    StateRepository stateRepository;

    @GetMapping
    public List<City> listarCidade(){
        return cityRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<City> criarCidade(@RequestBody City city){
        try{
            stateRepository.findById(city.getStateId()).map(state ->
                {
                    city.setState(state);
                    return cityRepository.save(city);
                }
            ).orElseThrow();
            return ResponseEntity.ok(city);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> atualizarCidade(@PathVariable Long id, @RequestBody City newCity){
        try {
            return cityRepository.findById(id)
                    .map(city -> {
                        city.setName(newCity.getName());
                        city.setStateId(newCity.getStateId());
                        if (city.getStateId() != null) {
                            State newState = stateRepository.findById(city.getStateId()).orElse(null);
                            if (newState != null) {
                                city.setState(newState);
                            }
                        }
                        cityRepository.save(city);
                        return ResponseEntity.ok(city);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarCidade(@PathVariable Long id) {
        try {
            cityRepository.deleteById(id);
            return ResponseEntity.ok("Cidade deletada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha ao deletar cidade");
        }
    }
}

