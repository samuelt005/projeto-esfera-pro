package com.projetointegrador.projetointegrador.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class Pages {

    @GetMapping("/pagecalendario")
    public String pageCalendario(Model model) throws InterruptedException {
        Thread.sleep(2000); // Simulated Lag
        return "pages/calendario";
    }

    @GetMapping("/pageclientes")
    public String pageClientes(Model model) throws InterruptedException {
        Thread.sleep(2000); // Simulated Lag
        return "pages/clientes";
    }

    @GetMapping("/pagedashboard")
    public String pageDashboard(Model model) throws InterruptedException {
        Thread.sleep(2000); // Simulated Lag
        return "pages/dashboard";
    }

    @GetMapping("/pageinteracoes")
    public String pageInteracoes(Model model) throws InterruptedException {
        Thread.sleep(2000); // Simulated Lag
        return "pages/interacoes";
    }

    @GetMapping("/pagepropostas")
    public String pagePropostas(Model model) throws InterruptedException {
        Thread.sleep(2000); // Simulated Lag
        return "pages/propostas";
    }
}
