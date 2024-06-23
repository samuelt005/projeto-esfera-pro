package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.*;
import com.projetointegrador.projetointegrador.repositories.ClientRepository;
import com.projetointegrador.projetointegrador.repositories.TeamRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import com.projetointegrador.projetointegrador.validators.CnpjValidator;
import com.projetointegrador.projetointegrador.validators.CpfValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final TeamRepository teamRepository;
    private final HttpServletRequest request;

    @Autowired
    public ClientService(ClientRepository clientRepository, TeamRepository teamRepository, HttpServletRequest request) {
        this.clientRepository = clientRepository;
        this.teamRepository = teamRepository;
        this.request = request;
    }

    // Encontra um cliente pelo id
    public ResponseEntity<?> findOneClient(Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);

        if (optionalClient.isPresent()) {
            return ResponseEntity.ok().body(optionalClient);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Lista todas os clientes ativos com paginação, pesquisa e filtros
    public Page<Client> listActiveClients(String searchTerm, Long stateId, Pageable pageable) {
        Client exampleClient = new Client();
        Team exampleTeam = new Team();
        exampleTeam.setId(getTeamIdFromRequest());
        exampleClient.setTeam(exampleTeam);
        exampleClient.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            exampleClient.setName(searchTerm);
        }

        if (stateId != null) {
            Address address = new Address();
            City city = new City();
            State state = new State();
            state.setId(stateId);
            exampleClient.setAddress(address);
            exampleClient.getAddress().setCity(city);
            exampleClient.getAddress().getCity().setState(state);
        }

        Example<Client> example = Example.of(exampleClient, matcher);

        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id"));

        return clientRepository.findAll(example, pageable);
    }

    // Lista todos os clientes ativos
    public List<Client> listAllActiveClients() {
        Client exampleClient = new Client();
        Team exampleTeam = new Team();
        exampleTeam.setId(getTeamIdFromRequest());
        exampleClient.setTeam(exampleTeam);
        exampleClient.setInactive(false);

        ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

        Example<Client> example = Example.of(exampleClient, matcher);

        return clientRepository.findAll(example);
    }

    // Cria um cliente
    public ResponseEntity<?> createClient(Client client) {
        if (client.getCnpj() != null && client.getCpf() != null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Informe somente o CPF ou CNPJ."));
        }

        if (validateClient(client)) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Dados do cliente inválidos."));
        }

        if (isAlreadyRegistered(client.getCpf(), client.getCnpj(), null)) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "CPF ou CNPJ já está cadastrado."));
        }

        client.setInactive(false);
        client.setId(null);
        client.getAddress().setId(null);
        client.setTeam(getTeamFromRequest());

        Client createdClient = clientRepository.save(client);
        return ResponseEntity.ok().body(createdClient);
    }

    // Cria vários clientes
    public ResponseEntity<?> createClients(List<Client> clients) {
        int successfulCreations = 0;
        List<Client> clientsWithErrors = new ArrayList<>();

        Team team = getTeamFromRequest();

        for (Client client : clients) {
            if (!validateClient(client)) {
                if (!isAlreadyRegistered(client.getCpf(), client.getCnpj(), null)) {
                    client.setInactive(false);
                    client.setId(null);
                    client.getAddress().setId(null);
                    client.setTeam(team);

                    clientRepository.save(client);
                    successfulCreations++;
                } else {
                    clientsWithErrors.add(client);
                }
            } else {
                clientsWithErrors.add(client);
            }
        }

        StringBuilder responseMessage = new StringBuilder();
        responseMessage.append("Total de clientes cadastrados com sucesso: ").append(successfulCreations);
        if (!clientsWithErrors.isEmpty()) {
            responseMessage.append("\n <br> <br> Clientes que não foram possíveis de cadastrar:");
            for (Client clientWithError : clientsWithErrors) {
                responseMessage.append("\n<br>- ").append(clientWithError.getName());
            }
        }

        return ResponseEntity.ok().body(responseMessage.toString());
    }

    // Atualiza um cliente
    public ResponseEntity<?> updateClient(Client client) {
        if (client.getId() == null || client.getAddress().getId() == null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs de cliente ou endereço não estão presentes."));
        }

        if (client.getCnpj() != null && client.getCpf() != null) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Informe somente o CPF ou CNPJ."));
        }

        if (validateClient(client)) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Dados do cliente inválidos."));
        }

        if (isAlreadyRegistered(client.getCpf(), client.getCnpj(), client.getId())) {
            return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "CPF ou CNPJ já está cadastrado."));
        }

        client.setTeam(getTeamFromRequest());

        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok().body(updatedClient);
    }

    // Desativa um cliente pelo id
    public ResponseEntity<?> deleteClient(Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);

        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();

            // Verifica se o time do cliente é o mesmo do token
            Long teamId = getTeamIdFromRequest();
            if (!client.getTeam().getId().equals(teamId)) {
                Response response = new Response(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir este cliente.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            client.setInactive(true);
            clientRepository.save(client);
            Response response = new Response(HttpStatus.OK, "Cliente inativado.");
            return ResponseEntity.ok().body(response);
        } else {
            Response response = new Response(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Valida CPF e CNPJ do cliente
    public boolean validateClient(Client client) {
        if (client.getCnpj() != null && client.getCpf() != null) {
            return true;
        }

        if (client.getCnpj() != null && client.getCpf() == null) {
            return !isCnpjValid(client.getCnpj());
        }

        if (client.getCpf() != null && client.getCnpj() == null) {
            return !isCpfValid(client.getCpf());
        }

        return false;
    }

    // Verifica se o cliente já está cadastrado no banco
    public boolean isAlreadyRegistered(String cpf, String cnpj, Long id) {
        if (cpf != null && isCpfAlreadyRegistered(cpf, id)) {
            return true;
        }

        return cnpj != null && isCnpjAlreadyRegistered(cnpj, id);
    }

    // Verifica se o CPF do cliente é valido
    public Boolean isCpfValid(String cpf) {
        CpfValidator validator = new CpfValidator();
        return validator.isValid(cpf);
    }

    // Verifica se o CNPJ do cliente é valido
    public Boolean isCnpjValid(String cnpj) {
        CnpjValidator validator = new CnpjValidator();
        return validator.isValid(cnpj);
    }

    // Verifica se já possui um cliente com o mesmo CPF
    public boolean isCpfAlreadyRegistered(String cpf, Long id) {
        Optional<Client> existentCpf = clientRepository.findByCpf(cpf);
        return existentCpf.isPresent() && !Objects.equals(existentCpf.get().getId(), id);
    }

    // Verifica se já possui um cliente com o mesmo CNPJ
    public boolean isCnpjAlreadyRegistered(String cnpj, Long id) {
        Optional<Client> existentCnpj = clientRepository.findByCnpj(cnpj);
        return existentCnpj.isPresent() && !Objects.equals(existentCnpj.get().getId(), id);
    }

    // Busca o teamId da request
    public Long getTeamIdFromRequest() {
        return (Long) request.getAttribute("teamId");
    }

    // Busca o time a partir do teamId da request
    private Team getTeamFromRequest() {
        Long teamId = getTeamIdFromRequest();
        Optional<Team> optionalTeam = teamRepository.findById(teamId);
        return optionalTeam.orElse(null);
    }
}
