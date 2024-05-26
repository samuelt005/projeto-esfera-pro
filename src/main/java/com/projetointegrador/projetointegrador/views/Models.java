package com.projetointegrador.projetointegrador.views;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.nio.file.Files;

@Controller
public class Models {

    @GetMapping("/getClientsModel")
    public ResponseEntity<byte[]> downloadModelClient() throws IOException {
        String filePath = "static/models/modelo_importacao_clientes.xlsm";

        return getResponseEntity(filePath);
    }

    @GetMapping("/getProposalsModel")
    public ResponseEntity<byte[]> downloadModelProposal() throws IOException {
        String filePath = "static/models/modelo_importacao_propostas.xlsm";

        return getResponseEntity(filePath);
    }

    @GetMapping("/getInteractionsModel")
    public ResponseEntity<byte[]> downloadModelInteraction() throws IOException {
        String filePath = "static/models/modelo_importacao_interacoes.xlsm";

        return getResponseEntity(filePath);
    }

    private ResponseEntity<byte[]> getResponseEntity(String filePath) throws IOException {
        Resource resource = new ClassPathResource(filePath);
        String fileName = resource.getFilename();
        byte[] data = Files.readAllBytes(resource.getFile().toPath());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        assert fileName != null;
        headers.setContentDispositionFormData(fileName, fileName);

        return ResponseEntity.ok().headers(headers).body(data);
    }
}
