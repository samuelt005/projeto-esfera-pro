package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import com.projetointegrador.projetointegrador.services.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/address")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Rota para buscar um endereço pelo ID
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> findOneAddress(@PathVariable Long id) {
        return addressService.findOneAddress(id);
    }
}


