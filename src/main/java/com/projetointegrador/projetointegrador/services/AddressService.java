package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    // Encontra um endereço pelo ID
    public ResponseEntity<?> findOneAddress(Long id) {
        return ResponseEntity.ok().body(addressRepository.findById(id));
    }
}
