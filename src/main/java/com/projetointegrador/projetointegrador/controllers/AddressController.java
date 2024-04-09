package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/address")
public class AddressController {
    final AddressRepository addressRepository;
    final ClientRepository clientRepository;
    final CityRepository cityRepository;

    public AddressController(AddressRepository addressRepository, ClientRepository clientRepository, CityRepository cityRepository) {
        this.addressRepository = addressRepository;
        this.clientRepository = clientRepository;
        this.cityRepository = cityRepository;
    }

    @GetMapping("/{id}")
    public Optional<Address> findOneAddress(@PathVariable Long id) {
        return addressRepository.findById(id);
    }
}


