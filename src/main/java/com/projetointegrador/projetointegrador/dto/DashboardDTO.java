package com.projetointegrador.projetointegrador.dto;

import com.projetointegrador.projetointegrador.models.Interaction;

import java.util.List;

public class DashboardDTO {
    private List<Double> salesValueLastMonth;
    private List<Double> salesValueCurrentMonth;
    private List<Double> salesValueLastYear;
    private List<Double> salesValueCurrentYear;
    private Integer totalInteractionsLastMonth;
    private Integer totalInteractionsCurrentMonth;
    private Integer totalInteractionsLastYear;
    private Integer totalInteractionsCurrentYear;

    public List<Double> getSalesValueLastMonth() {
        return salesValueLastMonth;
    }

    public void setSalesValueLastMonth(List<Double> salesValueLastMonth) {
        this.salesValueLastMonth = salesValueLastMonth;
    }

    public List<Double> getSalesValueCurrentMonth() {
        return salesValueCurrentMonth;
    }

    public void setSalesValueCurrentMonth(List<Double> salesValueCurrentMonth) {
        this.salesValueCurrentMonth = salesValueCurrentMonth;
    }

    public List<Double> getSalesValueLastYear() {
        return salesValueLastYear;
    }

    public void setSalesValueLastYear(List<Double> salesValueLastYear) {
        this.salesValueLastYear = salesValueLastYear;
    }

    public List<Double> getSalesValueCurrentYear() {
        return salesValueCurrentYear;
    }

    public void setSalesValueCurrentYear(List<Double> salesValueCurrentYear) {
        this.salesValueCurrentYear = salesValueCurrentYear;
    }

    public Integer getTotalInteractionsLastMonth() {
        return totalInteractionsLastMonth;
    }

    public void setTotalInteractionsLastMonth(Integer totalInteractionsLastMonth) {
        this.totalInteractionsLastMonth = totalInteractionsLastMonth;
    }

    public Integer getTotalInteractionsCurrentMonth() {
        return totalInteractionsCurrentMonth;
    }

    public void setTotalInteractionsCurrentMonth(Integer totalInteractionsCurrentMonth) {
        this.totalInteractionsCurrentMonth = totalInteractionsCurrentMonth;
    }

    public Integer getTotalInteractionsLastYear() {
        return totalInteractionsLastYear;
    }

    public void setTotalInteractionsLastYear(Integer totalInteractionsLastYear) {
        this.totalInteractionsLastYear = totalInteractionsLastYear;
    }

    public Integer getTotalInteractionsCurrentYear() {
        return totalInteractionsCurrentYear;
    }

    public void setTotalInteractionsCurrentYear(Integer totalInteractionsCurrentYear) {
        this.totalInteractionsCurrentYear = totalInteractionsCurrentYear;
    }
}
