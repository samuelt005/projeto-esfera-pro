package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.dto.DashboardDTO;
import com.projetointegrador.projetointegrador.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<?> getDashboardData() {
        DashboardDTO dashboardDTO = new DashboardDTO();
        // Dados de vendas fechadas
        dashboardDTO.setSalesValueLastMonth(dashboardService.getTotalSalesValueInAMonth(1));
        dashboardDTO.setSalesValueCurrentMonth(dashboardService.getTotalSalesValueInAMonth(0));
        dashboardDTO.setSalesValueLastYear(dashboardService.getTotalSalesValueInAYear(1));
        dashboardDTO.setSalesValueCurrentYear(dashboardService.getTotalSalesValueInAYear(0));

        // Dados de interações realizadas
        dashboardDTO.setTotalInteractionsLastMonth(dashboardService.getTotalInteractionsInAMonth(1));
        dashboardDTO.setTotalInteractionsCurrentMonth(dashboardService.getTotalInteractionsInAMonth(0));
        dashboardDTO.setTotalInteractionsLastYear(dashboardService.getTotalInteractionsInAYear(1));
        dashboardDTO.setTotalInteractionsCurrentYear(dashboardService.getTotalInteractionsInAYear(0));

        // Dados de total de propostas no ano por status
        List<Integer> proposalsInAYearByResult = new ArrayList<>();
        for (int statusType = 1; statusType <= 4; statusType++) {
            proposalsInAYearByResult.add(dashboardService.getTotalProposalsInAYearByStatus(0, statusType));
        }
        dashboardDTO.setTotalProposalsCurrentYearByStatus(proposalsInAYearByResult);

        // Dados de total de interações no ano por resultado
        List<Integer> interactionsInAYearByResult = new ArrayList<>();
        for (int resultType = 1; resultType <= 4; resultType++) {
            interactionsInAYearByResult.add(dashboardService.getTotalInteractionsInAYearByResult(0, resultType));
        }
        dashboardDTO.setTotalInteractionsCurrentYearByResult(interactionsInAYearByResult);

        return ResponseEntity.ok().body(dashboardDTO);
    }
}


