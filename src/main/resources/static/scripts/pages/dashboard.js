let dashboardData;

const colors = ['255, 0, 0', '255, 153, 0', '0, 10, 255', '59, 184, 0'];

// Busca os dados do dashboard
async function getDashboardData() {
    await fetch(`${URL}/dashboard`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar dados do dashboard`);
            }
            return response.json();
        })
        .then(data => {
            dashboardData = data;
            console.log(dashboardData)
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar dados do dashboard");
        });
}

function createChart(ctx, data, labels) {
    const total = data.reduce((acc, value) => acc + value, 0);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                label: 'teste',
                backgroundColor: colors.map(color => `rgba(${color}, 0.5)`),
                borderColor: colors.map(color => `#${color}`),
                borderWidth: 2,
                borderRadius: 20
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    position: 'bottom',
                    labels: {
                        color: '#101828',
                        font: {
                            size: 12,
                            family: 'Arial',
                            weight: 'bold'
                        },
                        padding: 10,
                        usePointStyle: true,
                        boxWidth: 10,
                        boxHeight: 10,
                    }
                },
                tooltip: {
                    xAlign: 'center',
                    yAlign: 'center',
                    displayColors: false,
                    callbacks: {
                        label: function (tooltipItem) {
                            const dataset = tooltipItem.dataset;
                            const currentValue = dataset.data[tooltipItem.dataIndex];
                            const percentage = ((currentValue / total) * 100).toFixed(2);
                            return `${currentValue} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let percentage = ((value / total) * 100).toFixed(2) + '%';
                        return value + ' (' + percentage + ')';
                    },
                    color: '#101828',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#101828',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        }
                    },
                    grid: {
                        color: 'rgba(71, 84, 103, 0.2)',
                        lineWidth: 2,
                        z: -1
                    },
                },
                x: {
                    ticks: {
                        color: '#101828',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(71, 84, 103, 0.2)',
                        lineWidth: 2,
                        z: -1
                    },
                }
            },
            layout: {
                padding: {
                    bottom: 10
                }
            },
            animation: {
                duration: 100
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createProposalChart() {
    const ctx = document.getElementById('proposalChart').getContext('2d');
    const data = dashboardData.totalProposalsCurrentYearByStatus;
    const labels = ['Parado', 'Negociação', 'Acompanhar', 'Fechado'];

    return createChart(ctx, data, labels);
}

function createInteractionChart() {
    const ctx = document.getElementById('interactionChart').getContext('2d');
    const data = dashboardData.totalInteractionsCurrentYearByResult;
    const labels = ['Desligado', 'Ocupado', 'Cx. Postal', 'Atendido'];

    return createChart(ctx, data, labels);
}

function updateCurrentYear() {
    const currentYear = new Date().getFullYear();

    const currentYearElements = document.querySelectorAll('span.current-year');

    currentYearElements.forEach(element => {
        element.textContent = currentYear.toString();
    });
}

function updateCurrentMonth() {
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const currentMonth = new Date().getMonth();
    const monthName = months[currentMonth];

    const currentMonthElements = document.querySelectorAll('span.current-month');

    currentMonthElements.forEach(element => {
        element.textContent = monthName;
    });
}

function setProposalTotalsForMonth() {
    const proposalTotalMonth = document.querySelector('.proposal-total-month');
    const proposalValueMonth = document.querySelector('.proposal-value-month');
    const proposalPercentageMonth = document.querySelector('.proposal-percentage-month');

    const totalProposalsMonth = dashboardData.salesValueCurrentMonth.length;
    const totalValueCurrentMonth = dashboardData.salesValueCurrentMonth.reduce((acc, value) => acc + value, 0);
    const totalValueLastMonth = dashboardData.salesValueLastMonth.reduce((acc, value) => acc + value, 0);

    if (totalValueCurrentMonth && totalValueLastMonth) {
        const percentageIncreaseMonth = (totalValueCurrentMonth / totalValueLastMonth * 100) - 100;
        proposalPercentageMonth.textContent = percentageIncreaseMonth.toFixed(2) + '%';

        if (percentageIncreaseMonth < 0) {
            rotateIcon(proposalPercentageMonth);
        }
    } else {
        hideIncrease(proposalPercentageMonth);
    }

    proposalTotalMonth.textContent = totalProposalsMonth;
    proposalValueMonth.textContent = formatCurrency(totalValueCurrentMonth.toFixed(2));
}

function setProposalTotalsForYear() {
    const proposalTotalYear = document.querySelector('.proposal-total-year');
    const proposalValueYear = document.querySelector('.proposal-value-year');
    const proposalPercentageYear = document.querySelector('.proposal-percentage-year');

    const totalProposalsYear = dashboardData.salesValueCurrentYear.length;
    const totalValueCurrentYear = dashboardData.salesValueCurrentYear.reduce((acc, value) => acc + value, 0);
    const totalValueLastYear = dashboardData.salesValueLastYear.reduce((acc, value) => acc + value, 0);

    if (totalValueCurrentYear && totalValueLastYear) {
        const percentageIncreaseYear = (totalValueCurrentYear / totalValueLastYear * 100) - 100;
        proposalPercentageYear.textContent = percentageIncreaseYear.toFixed(2) + '%';

        if (percentageIncreaseYear < 0) {
            rotateIcon(proposalPercentageYear);
        }
    } else {
        hideIncrease(proposalPercentageYear);
    }

    proposalTotalYear.textContent = totalProposalsYear;
    proposalValueYear.textContent = formatCurrency(totalValueCurrentYear.toFixed(2));
}

function setInteractionTotalsForMonth() {
    const interactionValueMonth = document.querySelector('.interaction-value-month');
    const interactionPercentageMonth = document.querySelector('.interaction-percentage-month');

    if (dashboardData.totalInteractionsCurrentMonth && dashboardData.totalInteractionsLastMonth) {
        const percentageIncreaseMonth = (dashboardData.totalInteractionsCurrentMonth / dashboardData.totalInteractionsLastMonth * 100) - 100;
        interactionPercentageMonth.textContent = percentageIncreaseMonth.toFixed(2) + '%';

        if (percentageIncreaseMonth < 0) {
            rotateIcon(interactionPercentageMonth);
        }
    } else {
        hideIncrease(interactionPercentageMonth);
    }

    interactionValueMonth.textContent = dashboardData.totalInteractionsCurrentMonth;
}

function setInteractionTotalsForYear() {
    const interactionValueYear = document.querySelector('.interaction-value-year');
    const interactionPercentageYear = document.querySelector('.interaction-percentage-year');

    if (dashboardData.totalInteractionsCurrentYear && dashboardData.totalInteractionsLastYear) {
        const percentageIncreaseYear = (dashboardData.totalInteractionsCurrentYear / dashboardData.totalInteractionsLastYear * 100) - 100;
        interactionPercentageYear.textContent = percentageIncreaseYear.toFixed(2) + '%';

        if (percentageIncreaseYear < 0) {
            rotateIcon(interactionPercentageYear);
        }
    } else {
        hideIncrease(interactionPercentageYear);
    }

    interactionValueYear.textContent = dashboardData.totalInteractionsCurrentYear;
}

function rotateIcon(div) {
    const parentDiv = div.parentElement;
    const increaseWrapper = parentDiv.closest('.increase-wrapper');

    if (increaseWrapper) {
        increaseWrapper.classList.add('negative');
    }
}

function hideIncrease(div) {
    const parentDiv = div.parentElement;
    const increaseWrapper = parentDiv.closest('.increase-wrapper');

    if (increaseWrapper) {
        increaseWrapper.classList.add('hidden');
    }
}

function dashboardStartup() {
    getDashboardData().then(() => {
        const proposalCanva = document.getElementById('proposalChart');
        const interactionCanva = document.getElementById('interactionChart');
        if (proposalCanva && interactionCanva) {
            createProposalChart();
            createInteractionChart();
        } else {
            console.error('Elemento canvas não encontrado');
        }

        setProposalTotalsForMonth();
        setProposalTotalsForYear();

        setInteractionTotalsForMonth();
        setInteractionTotalsForYear();
    });

    updateCurrentYear();
    updateCurrentMonth();
}