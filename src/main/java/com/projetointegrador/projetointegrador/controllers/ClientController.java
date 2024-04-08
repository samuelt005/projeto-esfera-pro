package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.dtos.ClientDTO;
import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.models.City;
import com.projetointegrador.projetointegrador.models.Client;
import com.projetointegrador.projetointegrador.projections.ClientProjection;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import com.projetointegrador.projetointegrador.repositories.CityRepository;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
public class ClientController {
    private final ClientRepository clientRepository;
    private final AddressRepository addressRepository;
    private final CityRepository cityRepository;

    public ClientController(ClientRepository clientRepository, AddressRepository addressRepository, CityRepository cityRepository) {
        this.clientRepository = clientRepository;
        this.addressRepository = addressRepository;
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public List<ClientProjection> listClients() {
        return clientRepository.findActiveClients();
    }

    @GetMapping("byId/{id}")
    public ClientProjection findClient(@PathVariable("id") Long id) {
        return clientRepository.findClientById(id);
    }

    @PostMapping
    public ClientProjection createClient(@RequestBody ClientDTO clientDTO) {

        Client client = new Client();
        client.setName(clientDTO.getName());
        client.setCpf(clientDTO.getCpf());
        client.setCnpj(clientDTO.getCnpj());
        client.setCompany(clientDTO.getCompany());
        client.setInactive(false);

        client = clientRepository.save(client);

        City city = cityRepository.findById(clientDTO.getCity_id()).orElseThrow();

        Address address = new Address();
        address.setClient(client);
        address.setCity(city);
        address.setNumber(clientDTO.getNumber());
        address.setZip_code(clientDTO.getZip_code());
        address.setStreet(clientDTO.getStreet());

        addressRepository.save(address);

        return findClient(client.getId());
    }


    @PutMapping("/{id}")
    public void updateClient(@PathVariable Long id, @RequestBody Client newClient) {
//        return clientRepository.findById(id).map(client -> {
//            client.setName(newClient.getName());
//            client.setCompany(newClient.getCompany());
//            return clientRepository.save(client);
//        }).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public Client deleteClient(@PathVariable Long id) {
        return clientRepository.findById(id).map(client -> {
            client.setInactive(true);
            return clientRepository.save(client);
        }).orElseThrow();
    }
}
