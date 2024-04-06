package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    @Autowired
    AddressRepository addressRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    CityRepository cityRepository;

    @GetMapping
    public List<Address> listarEndereco(){
        return addressRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Address> criarEndereco(@RequestBody Address address){
        try{
            City city = cityRepository.findById(address.getCityId()).orElse(null);
            Client client = clientRepository.findById(address.getClientId()).orElse(null);
            address.setCity(city);
            address.setClient(client);
            addressRepository.save(address);
            return ResponseEntity.ok(address);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> atualizarEndereco(@PathVariable Long id, @RequestBody Address newAddress){
        return addressRepository.findById(id)
                .map(address -> {
                    City city = cityRepository.findById(newAddress.getCityId()).orElse(null);
                    Client client = clientRepository.findById(newAddress.getClientId()).orElse(null);
                    address.setCity(city);
                    address.setClient(client);
                    address.setNumber(newAddress.getNumber());
                    address.setStreet(newAddress.getStreet());
                    address.setCityId(newAddress.getCityId());
                    address.setClientId(newAddress.getClientId());
                    return ResponseEntity.ok(addressRepository.save(address));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarEndereco(@PathVariable Long id) {
        try {
            addressRepository.deleteById(id);
            return ResponseEntity.ok("Endereco deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha ao deletar endereco");
        }
    }
}


