let selectedIds = [];
let isSelectAllActive = false;

// Altera o estado da checkbox e adiciona/remove o id a lista
function checkboxClicked(event) {
    const checkbox = event.currentTarget;
    const id = parseInt(checkbox.dataset.checkboxId);

    const index = selectedIds.indexOf(id);

    if (index !== -1) {
        selectAllCheckbox.classList.remove("selected");
        selectedIds.splice(index, 1);
        isSelectAllActive = false;
    } else {
        selectedIds.push(id);
    }

    checkbox.classList.toggle("selected");
}

// Altera o estado da checkbox de selecionar tudo e adiciona/remove todos os ids da lista
function selectAllHandler() {
    if (selectAllCheckbox.classList.contains("selected")) {
        selectedIds = [];
        isSelectAllActive = false;
        checkboxes.forEach((checkbox) => {
            checkbox.classList.remove("selected");
        });
    } else {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            const id = parseInt(checkbox.dataset.checkboxId);
            selectedIds.push(id);
            isSelectAllActive = true;
            checkbox.classList.add("selected");
        });
    }

    selectAllCheckbox.classList.toggle("selected");
}

// Adiciona o evento da checkbox em todas as checkboxes
function addCheckboxesEvents() {
    checkboxes = document.querySelectorAll('.row-checkbox');
    selectAllCheckbox = document.querySelector('.select-all-checkbox');

    checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('click', checkboxClicked);
        checkbox.addEventListener('click', checkboxClicked);
    });

    selectAllCheckbox.removeEventListener('click', selectAllHandler);
    selectAllCheckbox.addEventListener('click', selectAllHandler);
}

// Adiciona o evento de exportar ao botão de cada tela
function addExportEvent(button) {
    selectedIds = [];

    button.addEventListener('click', async () => {
        if (selectedIds.length === 0 && !isSelectAllActive) return;

        if (isSelectAllActive) {
            async function fetchData(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Erro ao recuperar dados`);
                    }
                    const data = await response.json();
                    downloadCSV(data);
                } catch (error) {
                    console.error(error);
                    showErrorToast("Erro ao buscar dados!");
                }
            }

            switch (currentPage) {
                case 2:
                    await fetchData(`${URL}/client/all`);
                    break;
                case 3:
                    await fetchData(`${URL}/proposal/all`);
                    break;
                case 4:
                    await fetchData(`${URL}/interaction/all`);
                    break;
            }
        } else {
            selectedIds.sort((a, b) => b - a);

            switch (currentPage) {
                case 2:
                    const filteredClientList = clientList.filter(item => selectedIds.includes(item.id));
                    downloadCSV(filteredClientList);
                    break;
                case 3:
                    const filteredProposalList = proposalList.filter(item => selectedIds.includes(item.id));
                    downloadCSV(filteredProposalList);
                    break;
                case 4:
                    const filteredInteractionList = interactionList.filter(item => selectedIds.includes(item.id));
                    downloadCSV(filteredInteractionList);
                    break;
            }
        }
    });
}

// Converte os dados para csv
function convertToCSV(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '';
    }

    let csvContent = '';

    switch (currentPage) {
        case 2:
            csvContent = generateClientCSV(data);
            break;
        case 3:
            csvContent = generateProposalCSV(data);
            break;
        case 4:
            csvContent = generateInteractionCSV(data);
            break;
    }

    return csvContent;
}

// Gera as linhas de clientes
function generateClientCSV(data) {
    const headers = ['Nome', 'CPF', 'Empresa', 'CNPJ', 'Email', 'WhatsApp', 'Celular', 'Telefone', 'Rua', 'CEP', 'Cidade', 'Estado'];
    const lines = data.map(createClientCSVLine);

    let csvContent = headers.join(';') + '\n';
    csvContent += lines.join('\n');

    return csvContent;
}

// Gera as linhas de propostas
function generateProposalCSV(data) {
    const headers = ['ID Cliente', 'Data da Oferta', 'Tipo de Serviço', 'Status', 'Valor', 'Descrição'];
    const lines = data.map(createProposalCSVLine);

    let csvContent = headers.join(';') + '\n';
    csvContent += lines.join('\n');

    return csvContent;
}

// Gera as linhas de interações
function generateInteractionCSV(data) {
    const headers = ['ID Cliente', 'ID Proposta', 'Data', 'Hora', 'Duração', 'Resultado', 'Contato', 'Descrição'];
    const lines = data.map(createInteractionCSVLine);

    let csvContent = headers.join(';') + '\n';
    csvContent += lines.join('\n');

    return csvContent;
}

// Função para criar uma linha de csv de cliente
function createClientCSVLine(client) {
    const name = client.name || '';
    const cpf = client.cpf || '';
    const company = client.company || '';
    const cnpj = client.cnpj || '';
    const email = client.email || '';
    const whatsapp = client.whatsapp || '';
    const cellphone = client.cellphone || '';
    const telephone = client.telephone || '';
    const street = client.address ? client.address.street || '' : '';
    const cep = client.address ? client.address.zip_code || '' : '';

    const city = client.address ? client.address.city.name || '' : '';
    const state = client.address ? client.address.city.state.uf || '' : '';

    return `${name};${cpf};${company};${cnpj};${email};${whatsapp};${cellphone};${telephone};${street};${cep};${city};${state}`;
}

// Função para criar uma linha de csv de proposta
function createProposalCSVLine(offer) {
    const clientId = offer.client ? offer.client.id || '' : '';
    const offerDate = offer.offerDate ? new Date(offer.offerDate).toLocaleDateString('pt-BR') : '';
    const serviceType = getServiceType(offer.serviceType);
    const status = getStatus(offer.status);
    const value = offer.value ? offer.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : '';
    const description = offer.description || '';

    return `${clientId};${offerDate};${serviceType};${status};${value};${description}`;
}

// Função para criar uma linha de csv de interação
function createInteractionCSVLine(meeting) {
    const clientId = meeting.proposal ? meeting.proposal.client.id : '';
    const proposalId = meeting.proposal ? meeting.proposal.id : '';
    const date = meeting.date ? new Date(meeting.date).toLocaleDateString('pt-BR') : '';
    const time = meeting.time || '';
    const duration = meeting.duration || '';
    const result = getResult(meeting.result);
    const contact = getContact(meeting.contact);
    const description = meeting.description || '';

    return `${clientId};${proposalId};${date};${time};${duration};${result};${contact};${description}`;
}

// Função auxiliar para obter o tipo de serviço
function getServiceType(type) {
    switch (type) {
        case 1:
            return 'Consultoria';
        case 2:
            return 'Acompanhamento';
        case 3:
            return 'Treinamento';
        default:
            return '';
    }
}

// Função auxiliar para obter o status
function getStatus(status) {
    switch (status) {
        case 1:
            return 'Parado';
        case 2:
            return 'Negociacao';
        case 3:
            return 'Acompanhar';
        case 4:
            return 'Fechado';
        default:
            return '';
    }
}

// Função auxiliar para obter o resultado
function getResult(result) {
    switch (result) {
        case 1:
            return 'Desligado';
        case 2:
            return 'Ocupado';
        case 3:
            return 'Cx. Postal';
        case 4:
            return 'Atendido';
        default:
            return '';
    }
}

// Função auxiliar para obter o tipo de contato
function getContact(contact) {
    switch (contact) {
        case 1:
            return 'Ligacao';
        case 2:
            return 'Whatsapp';
        case 3:
            return 'Email';
        default:
            return '';
    }
}

// Função para baixar os dados em csv
function downloadCSV(data, currentPage) {
    const csvContent = convertToCSV(data, currentPage);

    const filename = generateFilename();

    const csvBlob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(csvBlob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

// Define o nome do arquivo para baixar
function generateFilename() {
    switch (currentPage) {
        case 2:
            return 'clientes.csv';
        case 3:
            return 'propostas.csv';
        case 4:
            return 'interacoes.csv';
        default:
            return 'export.csv';
    }
}
