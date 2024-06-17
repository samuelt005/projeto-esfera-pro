package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class DashboardService {
    private final ProposalRepository proposalRepository;
    private final HttpServletRequest request;

    @Autowired
    public DashboardService(ProposalRepository proposalRepository, HttpServletRequest request) {
        this.proposalRepository = proposalRepository;
        this.request = request;
    }

    // Busca todas as propostas do teamId específico com status = 4 e inactive = false
    public List<Double> getTotalSalesValueInAMonth(Integer monthOffset) {
        LocalDateTime startOfMonth = getStartOfMonth(LocalDate.now().minusMonths(monthOffset));
        LocalDateTime endOfMonth = getEndOfMonth(LocalDate.now().minusMonths(monthOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findProposalValuesInAPeriod(teamId, startOfMonth, endOfMonth);
    }

    // Método para calcular o valor total das vendas para um período de anos
    public List<Double> getTotalSalesValueInAYear(Integer yearOffset) {
        LocalDateTime startOfYear = getStartOfYear(LocalDate.now().minusYears(yearOffset));
        LocalDateTime endOfYear = getEndOfYear(LocalDate.now().minusYears(yearOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findProposalValuesInAPeriod(teamId, startOfYear, endOfYear);
    }

    // Método para buscar o total de interações em um mês
    public Integer getTotalInteractionsInAMonth(Integer monthOffset) {
        LocalDateTime startOfMonth = getStartOfMonth(LocalDate.now().minusMonths(monthOffset));
        LocalDateTime endOfMonth = getEndOfMonth(LocalDate.now().minusMonths(monthOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findTotalAmountOfInteractions(teamId, startOfMonth, endOfMonth);
    }

    // Método para buscar o total de interações em um ano
    public Integer getTotalInteractionsInAYear(Integer yearOffset) {
        LocalDateTime startOfYear = getStartOfYear(LocalDate.now().minusYears(yearOffset));
        LocalDateTime endOfYear = getEndOfYear(LocalDate.now().minusYears(yearOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findTotalAmountOfInteractions(teamId, startOfYear, endOfYear);
    }

    // Método para buscar o total de interações em um ano
    public Integer getTotalProposalsInAYearByStatus(Integer yearOffset, Integer status) {
        LocalDateTime startOfYear = getStartOfYear(LocalDate.now().minusYears(yearOffset));
        LocalDateTime endOfYear = getEndOfYear(LocalDate.now().minusYears(yearOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findTotalAmountOfProposalsByStatus(teamId, status, startOfYear, endOfYear);
    }

    // Método para buscar o total de interações em um ano
    public Integer getTotalInteractionsInAYearByResult(Integer yearOffset, Integer result) {
        LocalDateTime startOfYear = getStartOfYear(LocalDate.now().minusYears(yearOffset));
        LocalDateTime endOfYear = getEndOfYear(LocalDate.now().minusYears(yearOffset));

        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findTotalAmountOfInteractionsByResult(teamId, result, startOfYear, endOfYear);
    }

    public Integer getTotalClients() {
        Long teamId = getTeamIdFromRequest();

        return proposalRepository.findTotalAmountOfClients(teamId);
    }

    // Retorna a data e hora de início do mês para a data especificada
    private LocalDateTime getStartOfMonth(LocalDate date) {
        return date.withDayOfMonth(1).atStartOfDay();
    }

    // Retorna a data e hora de término do mês para a data especificada
    private LocalDateTime getEndOfMonth(LocalDate date) {
        return date.withDayOfMonth(date.lengthOfMonth()).atTime(LocalTime.MAX);
    }

    // Retorna a data e hora de início do ano para a data especificada
    private LocalDateTime getStartOfYear(LocalDate date) {
        return date.withDayOfYear(1).atStartOfDay();
    }

    // Retorna a data e hora de término do ano para a data especificada
    private LocalDateTime getEndOfYear(LocalDate date) {
        return date.withDayOfYear(date.lengthOfYear()).atTime(LocalTime.MAX);
    }

    // Busca o teamId da request
    private Long getTeamIdFromRequest() {
        return (Long) request.getAttribute("teamId");
    }
}
