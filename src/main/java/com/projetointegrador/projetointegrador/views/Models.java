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
    public ResponseEntity<byte[]> downloadModel() throws IOException {
        // Caminho para o arquivo modelo na pasta resources
        String filePath = "static/models/modelo_importacao_clientes.xlsm";

        // Carregar o arquivo modelo como um recurso
        Resource resource = new ClassPathResource(filePath);

        // Obter o nome do arquivo
        String fileName = resource.getFilename();

        // Ler bytes do arquivo modelo
        byte[] data = Files.readAllBytes(resource.getFile().toPath());

        // Configurar os cabeçalhos de resposta
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        assert fileName != null;
        headers.setContentDispositionFormData(fileName, fileName);

        // Retornar uma resposta com os bytes do arquivo e os cabeçalhos
        return ResponseEntity.ok().headers(headers).body(data);
    }
}
