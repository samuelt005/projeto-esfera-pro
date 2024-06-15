let dashboardData;

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
            console.log(data)
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar dados do dashboard");
        });
}

function dashboardStartup() {
    /* const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });*/

    console.log('INICIOU DASHBOARD')
    getDashboardData().then();
}