package com.projetointegrador.projetointegrador.controllers;

import com.projetointegrador.projetointegrador.dto.DashboardDTO;
import com.projetointegrador.projetointegrador.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        dashboardDTO.setSalesValueLastMonth(dashboardService.getTotalSalesValueInAMonth(1));
        dashboardDTO.setSalesValueCurrentMonth(dashboardService.getTotalSalesValueInAMonth(0));
        dashboardDTO.setSalesValueLastYear(dashboardService.getTotalSalesValueInAYear(1));
        dashboardDTO.setSalesValueCurrentYear(dashboardService.getTotalSalesValueInAYear(0));

        dashboardDTO.setTotalInteractionsLastMonth(dashboardService.getTotalInteractionsInAMonth(1));
        dashboardDTO.setTotalInteractionsCurrentMonth(dashboardService.getTotalInteractionsInAMonth(0));
        dashboardDTO.setTotalInteractionsLastYear(dashboardService.getTotalInteractionsInAYear(1));
        dashboardDTO.setTotalInteractionsCurrentYear(dashboardService.getTotalInteractionsInAYear(0));

        return ResponseEntity.ok().body(dashboardDTO);
    }
}


