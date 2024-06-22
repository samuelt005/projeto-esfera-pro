async function getTeamData() {
    if (tokenData.profile !== "admin") return;

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
            document.querySelector('.copy-button').addEventListener('click', copyTeamCode);
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

async function getNewTeamCode(event) {
    if (event.target.classList.contains('disabled')) return;

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

// Adiciona linhas a tabela da equipe
function addTeamMemberRows(members) {
    const tableContent = document.querySelector(".table-members-content");

    tableContent.innerHTML = '';

    members.forEach((client) => {
        const newRow = createTeamMemberTableRow(client);
        tableContent.appendChild(newRow);
    });
}

// Remove uma linha da tabela da equipe
async function disableTeamMember(row) {
    const id = parseInt(row.getAttribute('data-row-id'));

    // TODO adicionar confirmação de exclusão

    try {
        const response = await fetch(`${URL}/user/disableuser/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': userToken, 'Content-Type': 'text/html'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseData.message);
        } else {
            row.remove();
            showSuccessToast("Usuário desativado com sucesso!");
        }

    } catch (error) {
        console.error('Erro ao desativar usuário: ', error);
        showErrorToast("Erro ao desativar usuário!");
    }
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
        <td>${member.status ? 'Ativo' : 'Desativado'}</td>
        ${memberButtons}
    `;

    const deleteButton = newRow.querySelector('.delete');

    if (member.profile !== 'admin') {
        deleteButton.addEventListener('click', () => {
            if (deleteButton.classList.contains('disabled')) return;

            disableTeamMember(newRow).catch(error => {
                console.error(error)
            });
        });
    } else {
        deleteButton.classList.add('disabled');
    }

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

function checkIfIsAdmin() {
    if (tokenData.profile !== "admin") {
        const allDeleteButtons = document.querySelectorAll('.button-table.delete');
        allDeleteButtons.forEach(button => {
            if (!button.classList.contains('disabled')) {
                button.classList.add('disabled')
            }
        })

        document.querySelector('.team-code-wrapper').remove();
    } else {
        document.querySelector('.team-code-wrapper').classList.remove('hidden');
        document.getElementById('generateCode').addEventListener('click', getNewTeamCode);
    }
}

function teamStartup() {
    getTeamMembers().then(() => {
        getTeamData().then(() => {
            checkIfIsAdmin();
        });
    });
}