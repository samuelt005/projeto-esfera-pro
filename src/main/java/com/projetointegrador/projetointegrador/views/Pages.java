package com.projetointegrador.projetointegrador.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class Pages {

    // Rota da página de calendário
    @GetMapping("/pagecalendario")
    public String pageCalendario() {
        return "pages/calendar";
    }

    // Rota da página de clientes
    @GetMapping("/pageclientes")
    public String pageClientes() {
        return "pages/client";
    }

    // Rota da página de dashboard
    @GetMapping("/pagedashboard")
    public String pageDashboard() {
        return "pages/dashboard";
    }

    // Rota da página de interações
    @GetMapping("/pageinteracoes")
    public String pageInteracoes() {
        return "pages/interaction";
    }

    // Rota da página de propostas
    @GetMapping("/pagepropostas")
    public String pagePropostas() {
        return "pages/proposal";
    }

    // Rota da página de propostas
    @GetMapping("/pageconfigs")
    public String pageConfigs() {
        return "pages/configs";
    }

    @GetMapping("/pageerror")
    public String pageErro() {
        return "pages/error";
    }
}
