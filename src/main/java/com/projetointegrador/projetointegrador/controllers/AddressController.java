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

    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        try {
            addressRepository.save(address);
            return ResponseEntity.ok(address);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address newAddress) {
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
}


