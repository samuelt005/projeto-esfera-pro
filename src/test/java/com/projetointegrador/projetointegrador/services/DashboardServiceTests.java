package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.repositories.ProposalRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DashboardServiceTests {

    @Mock
    private ProposalRepository proposalRepository;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTotalSalesValueInAMonth() {
        Long teamId = 1L;
        LocalDateTime now = LocalDateTime.now().minusMonths(1);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
        List<Double> mockValues = Collections.singletonList(1000.0);

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findProposalValuesInAPeriod(teamId, startOfMonth, endOfMonth)).thenReturn(mockValues);

        List<Double> result = dashboardService.getTotalSalesValueInAMonth(1);
        assertEquals(mockValues, result);
    }

    @Test
    void testGetTotalSalesValueInAYear() {
        Long teamId = 1L;
        LocalDateTime now = LocalDateTime.now().minusYears(1);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endOfYear = now.withDayOfYear(now.toLocalDate().lengthOfYear()).with(LocalTime.MAX);
        List<Double> mockValues = Collections.singletonList(12000.0);

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findProposalValuesInAPeriod(teamId, startOfYear, endOfYear)).thenReturn(mockValues);

        List<Double> result = dashboardService.getTotalSalesValueInAYear(1);
        assertEquals(mockValues, result);
    }

    @Test
    void testGetTotalInteractionsInAMonth() {
        Long teamId = 1L;
        LocalDateTime now = LocalDateTime.now().minusMonths(1);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
        Integer mockInteractions = 100;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findTotalAmountOfInteractions(teamId, startOfMonth, endOfMonth)).thenReturn(mockInteractions);

        Integer result = dashboardService.getTotalInteractionsInAMonth(1);
        assertEquals(mockInteractions, result);
    }

    @Test
    void testGetTotalInteractionsInAYear() {
        Long teamId = 1L;
        LocalDateTime now = LocalDateTime.now().minusYears(1);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endOfYear = now.withDayOfYear(now.toLocalDate().lengthOfYear()).with(LocalTime.MAX);
        Integer mockInteractions = 1200;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findTotalAmountOfInteractions(teamId, startOfYear, endOfYear)).thenReturn(mockInteractions);

        Integer result = dashboardService.getTotalInteractionsInAYear(1);
        assertEquals(mockInteractions, result);
    }

    @Test
    void testGetTotalProposalsInAYearByStatus() {
        Long teamId = 1L;
        Integer status = 4;
        LocalDateTime now = LocalDateTime.now().minusYears(1);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endOfYear = now.withDayOfYear(now.toLocalDate().lengthOfYear()).with(LocalTime.MAX);
        Integer mockProposals = 50;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findTotalAmountOfProposalsByStatus(teamId, status, startOfYear, endOfYear)).thenReturn(mockProposals);

        Integer result = dashboardService.getTotalProposalsInAYearByStatus(1, status);
        assertEquals(mockProposals, result);
    }

    @Test
    void testGetTotalInteractionsInAYearByResult() {
        Long teamId = 1L;
        Integer result = 1;
        LocalDateTime now = LocalDateTime.now().minusYears(1);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endOfYear = now.withDayOfYear(now.toLocalDate().lengthOfYear()).with(LocalTime.MAX);
        Integer mockInteractions = 100;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findTotalAmountOfInteractionsByResult(teamId, result, startOfYear, endOfYear)).thenReturn(mockInteractions);

        Integer resultValue = dashboardService.getTotalInteractionsInAYearByResult(1, result);
        assertEquals(mockInteractions, resultValue);
    }

    @Test
    void testGetTotalClients() {
        Long teamId = 1L;
        Integer mockClients = 200;

        when(request.getAttribute("teamId")).thenReturn(teamId);
        when(proposalRepository.findTotalAmountOfClients(teamId)).thenReturn(mockClients);

        Integer result = dashboardService.getTotalClients();
        assertEquals(mockClients, result);
    }
}
