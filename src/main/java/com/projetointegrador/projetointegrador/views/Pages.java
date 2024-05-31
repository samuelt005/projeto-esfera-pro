package com.projetointegrador.projetointegrador.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class Pages {

    // Rota da página de calendário
    @GetMapping("/pagecalendario")
    public String pageCalendario(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/calendario";
    }

    // Rota da página de clientes
    @GetMapping("/pageclientes")
    public String pageClientes(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/clientes";
    }

    // Rota da página de dashboard
    @GetMapping("/pagedashboard")
    public String pageDashboard(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/dashboard";
    }

    // Rota da página de interações
    @GetMapping("/pageinteracoes")
    public String pageInteracoes(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/interacoes";
    }

    // Rota da página de propostas
    @GetMapping("/pagepropostas")
    public String pagePropostas(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/propostas";
    }

    // Rota da página de propostas
    @GetMapping("/pageconfigs")
    public String pageConfigs(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/configs";
    }

    @GetMapping("/pageerror")
    public String pageErro(Model model) throws InterruptedException {
//        Thread.sleep(2000); // Simulated Lag
        return "pages/error";
    }
}
