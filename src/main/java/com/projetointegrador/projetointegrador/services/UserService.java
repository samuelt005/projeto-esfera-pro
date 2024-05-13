package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.dto.UserDTO;
import com.projetointegrador.projetointegrador.models.User;
import com.projetointegrador.projetointegrador.repositories.UserRepository;
import com.projetointegrador.projetointegrador.responses.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import static com.projetointegrador.projetointegrador.utils.PasswordUtils.*;

import java.util.Optional;

@Service
public class UserService {
        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        // Encontra um usuário pelo id
        public ResponseEntity<?> findOneUser(Long id) {
            Optional<User> optionalUser = userRepository.findById(id);

            if (optionalUser.isPresent()) {
                return ResponseEntity.ok().body(optionalUser);
            } else {
                Response response = new Response(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // Lista todos os clientes ativos
        /*public ResponseEntity<?> listActiveClients() {
            Client exampleClient = new Client();
            exampleClient.setInactive(false);

            ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("id");

            Example<Client> example = Example.of(exampleClient, matcher);

            List<Client> clients = clientRepository.findAll(example);
            return ResponseEntity.ok().body(clients);
        }*/

        // Validação de usuário
        public ResponseEntity<?> userValidation(UserDTO user) {
            try {

                // Verifica se o email e a senha estão presentes
                if (user.getEmail().isBlank() || user.getPassword().isBlank()) {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Email ou senha não estão presentes."));
                }

                // Busca usuário pelo email
                Optional<User> existentUser = userRepository.findByEmail(user.getEmail());

                // Verifica se o usuário existe
                if (existentUser.isPresent()) {
                    // Verifica se a senha está correta
                    if (verifyPassword(user.getPassword(), existentUser.get().getPassword())) {
                        return ResponseEntity.ok().body("Pode entrar");
                    } else {
                        return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Senha ou Email incorretos."));
                    }
                } else {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Usuário não encontrado."));
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar a solicitação."));
            }
        }

        // Cria um usuário
        public ResponseEntity<?> createUser(User user) {
            try {
                if (user.getEmail().isBlank() || user.getPassword().isBlank() || user.getName().isBlank() || user.getPhone().isBlank()) {
                    return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Por favor, preencha todos os campos obrigatórios: nome, email, telefone e senha."));
                }
                if (userRepository.findByEmail(user.getEmail()).isPresent()){
                    throw new Exception("Email já cadastrado.");
                }
                user.setId(null);
                user.setPassword(encryptPassword(user.getPassword()));
                User createdUser = userRepository.save(user);
                return ResponseEntity.ok().body(createdUser);
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
            }
        }


        // Atualiza um cliente
        /*public ResponseEntity<?> updateClient(Client client) {
            if (client.getId() == null || client.getAddress().getId() == null) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "IDs de cliente ou endereço não estão presentes."));
            }

            if (validateClient(client)) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "Dados do cliente inválidos."));
            }

            if (isAlreadyRegistered(client.getCpf(), client.getCnpj(), client.getId())) {
                return ResponseEntity.badRequest().body(new Response(HttpStatus.BAD_REQUEST, "CPF ou CNPJ já está cadastrado."));
            }

            Client updatedClient = clientRepository.save(client);
            return ResponseEntity.ok().body(updatedClient);
        }*/

        // Desativa um cliente pelo id
       /* public ResponseEntity<?> deleteClient(Long id) {
            Optional<Client> optionalClient = clientRepository.findById(id);

            if (optionalClient.isPresent()) {
                Client client = optionalClient.get();
                client.setInactive(true);
                clientRepository.save(client);
                Response response = new Response(HttpStatus.OK, "Cliente inativado.");
                return ResponseEntity.ok().body(response);
            } else {
                Response response = new Response(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
                return ResponseEntity.badRequest().body(response);
            }
        }*/

        // Valida CPF e CNPJ do cliente

        // Verifica se o cliente já está cadastrado no banco
       /* public boolean isAlreadyRegistered(String cpf, String cnpj, Long id) {
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
        }*/
}

