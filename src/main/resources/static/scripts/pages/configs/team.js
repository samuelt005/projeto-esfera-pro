async function getTeamData() {
    await fetch(`${URL}/team`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar dados da equipe`);
            }
            return response.json();
        })
        .then(data => {
            setTeamData(data)
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar dados da equipe");
        });
}

async function getTeamMembers() {
    await fetch(`${URL}/team/members`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar membros da equipe`);
            }
            return response.json();
        })
        .then(data => {
            addTeamMemberRows(data);
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar membros da equipe");
        });
}

async function getNewTeamCode() {
    await fetch(`${URL}/team/generatenewcode`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao gerar novo código`);
            }
            return response.json();
        })
        .then(data => {
            setTeamData(data)
            showSuccessToast("Novo código da equipe gerado com sucesso!");
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao gerar novo código");
        });
}

// Adiciona linhas a tabela de clientes
function addTeamMemberRows(members) {
    const tableContent = document.querySelector(".table-members-content");

    members.forEach((client) => {
        const newRow = createTeamMemberTableRow(client);
        tableContent.appendChild(newRow);
    });
}

// Cria um elemento HTML de uma linha da tabela
function createTeamMemberTableRow(member) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', member.id);
    newRow.innerHTML = `
        <td>${member.name}</td>
        <td>${member.profile === 'admin' ? "Gerente" : "Televendedor"}</td>
        <td>${member.email}</td>
        <td>${getPhoneFormatted(member.phone)}</td>
        <td>Ações</td>
    `;

    return newRow;
}

function copyTeamCode() {
    const teamCodeInput = document.querySelector('input[name="teamCode"]');
    const copyButton = document.querySelector('.copy-button');
    const copyIcon = copyButton.querySelector('.copy-button .copy');
    const checkIcon = copyButton.querySelector('.copy-button .check');

    teamCodeInput.select();
    teamCodeInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(teamCodeInput.value)
        .then(() => {
            showSuccessToast("Código da equipe copiado para a área de transferência!");
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');

            setTimeout(() => {
                copyIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');
            }, 3000);
        })
        .catch(() => {
            showErrorToast("Erro ao copiar o código da equipe.");
        });
}

function setTeamData(team) {
    const teamName = document.querySelector('.team-name');
    const teamCode = document.querySelector('input[name="teamCode"]');

    teamName.textContent = team.name;
    teamCode.value = team.code;
}

function teamStartup() {
    getTeamMembers().then();
    getTeamData().then(() => {
        document.querySelector('.copy-button').addEventListener('click', copyTeamCode);
        document.getElementById('generateCode').addEventListener('click', getNewTeamCode);
    });
}