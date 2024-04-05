package com.projetointegrador.projetointegrador.controller;

import com.projetointegrador.projetointegrador.model.Address;
import com.projetointegrador.projetointegrador.repository.AddressRepository;
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

    @GetMapping
    public List<Address> listarEndereco(){
        return addressRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Address> criarEndereco(@RequestBody Address address){
        try{
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
                    address.setCity(newAddress.getCity());
                    address.setStreet(newAddress.getStreet());
                    address.setNumber(newAddress.getNumber());
                    address.setZip_code(newAddress.getZip_code());
                    address.setClient(newAddress.getClient());
                    addressRepository.save(address);
                    return ResponseEntity.ok(address);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarEndereco(@PathVariable Long id) {
        try {
            addressRepository.deleteById(id);
            return ResponseEntity.ok("Estado deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha ao deletar estado");
        }
    }
}


