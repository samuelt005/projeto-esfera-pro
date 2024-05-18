// Elementos da página
let buttonAddNewProposal;
let buttonCloseModalProposal;
let cancelCloseModalProposal;
let saveCloseModalProposal;
let clientSelectProposal;
let serviceTypeSelectProposal;
let offerDateInputProposal;
let statusSelectProposal;
let valueInputProposal;
let descriptionInputProposal;


// Lista de interações
let proposalList = [];

// Buscar todas as interações
async function getProposal() {
    await fetch(`${URL}/proposal`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar propostas`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            proposalList.push(...data);
            addProposalRows(data);
        })
        .catch((e) => {
            getMainFrameContent('error');
        });
}

// Busca apenas uma interação pelo id
async function getOneProposal(id, isEditing) {
    await fetch(`${URL}/proposal/byId/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar interação`);
            }
            return response.json();
        })
        .then(data => {
            if (isEditing) {
                const oldRow = document.querySelector(`tr[data-row-id="${id}"]`);
                if (oldRow) {
                    const newRow = createProposalTableRow(data);
                    oldRow.parentNode.replaceChild(newRow, oldRow);
                }

                const index = proposalList.findIndex(proposal => proposal.id === id);
                if (index !== -1) {
                    proposalList[index] = data;
                }

                addCheckboxesEvents();
            } else {
                proposalList.push(data);
                addProposalRows([data]);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Criar opções do select do tipo de serviço
function setServiceTypeSelect() {
    const options = [
        {name: 'Consultoria', value: 1},
        {name: 'Acompanhamento', value: 2},
        {name: 'Treinamento', value: 3}
    ]

    options.forEach((option) => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.name;
        newOption.classList.add('contact-option');

        serviceTypeSelectProposal.appendChild(newOption);
    })
}

// Criar opções do select do tipo de status
function setStatusSelect() {
    const options = [
        {name: 'Parado', value: 1},
        {name: 'Negociação', value: 2},
        {name: 'Acompanhar', value: 3},
        {name: 'Fechado', value: 4}
    ]

    options.forEach((option) => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.name;
        newOption.classList.add('result-option');

        statusSelectProposal.appendChild(newOption);
    })
}

// Adiciona linhas a tabela de interações
function addProposalRows(proposals) {
    const tableContent = document.querySelector(".table-content");

    proposals.forEach((proposal) => {
        const newRow = createProposalTableRow(proposal);
        tableContent.appendChild(newRow);
    });

    addCheckboxesEvents();
}

// Cria um elemento HTML de uma linha da tabela
function createProposalTableRow(proposal) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', proposal.id);
    newRow.innerHTML = `
        <th class="row-checkbox" data-checkbox-id="${proposal.id}">
            ${rowCheckboxIcon}
        </th>
        <td>${proposal.id}</td>
        <td>${proposal.client.company ? proposal.client.company : proposal.name}</td>
        <td>${getServiceTypeText(proposal.serviceType)}</td>
        <td>${getStatusDiv(proposal.status)}</td>
        <td class="description">${proposal.description === "" ? '-' : proposal.description}</td>
        <td>${getDateFormatted(proposal.offerDate)}</td>
        <td>${formatCurrency(proposal.value)}</td>
        ${proposalButtons}
    `;

    addProposalRowButtonEvents(newRow);

    return newRow;
}

// Adiciona os eventos dos botões da linha de um interação
function addProposalRowButtonEvents(row) {
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    deleteButton.addEventListener('click', () => {
        deleteProposal(row).catch(error => console.error(error));
    });

    editButton.addEventListener('click', () => {
        const rowId = parseInt(row.getAttribute('data-row-id'));
        const proposal = proposalList.find(proposal => proposal.id === rowId);
        isEditingProposal = true;
        resetProposalFields();
        cleanInvalidClassesProposal();
        fillFieldsProposal(proposal);
        switchOverlay();
    });
}

// Remove uma linha da tabela de interações
async function deleteProposal(row) {
    const id = parseInt(row.getAttribute('data-row-id'));

    const index = proposalList.findIndex(proposal => proposal.id === id);
    if (index !== -1) {
        proposalList.splice(index, 1);
    }

    // TODO adicionar confirmação de exclusão

    try {
        const response = await fetch(`${URL}/proposal/${id}`, {
            method: 'DELETE',
        });

        const responseDataProposal = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseDataProposal.message);
        } else {
            row.remove();
            addCheckboxesEvents();

            const index = selectedIds.findIndex(selectedId => selectedId === id);
            if (index !== -1) {
                selectedIds.splice(index, 1);
            }
        }

    } catch (error) {
        console.error('Erro ao excluir interação: ', error);
    }
}

// Adiciona o evento de salvar uma interação no botão de salvar
function addSaveProposalEvent(button) {
    button.addEventListener('click', saveProposal);
}

// Adiciona o evento de adicionar nova interação no botão de adicionar
function addNewProposalEvent(button) {
    button.addEventListener('click', () => {
        isEditingProposal = false;
        resetProposalFields();
        cleanInvalidClassesProposal();
        switchOverlay();
    });
}

// Busca os elementos da página e atribui eles as variáveis globais
function getProposalElements() {
    buttonAddNewProposal = document.querySelector('.button-add-new');
    buttonCloseModalProposal = document.querySelector('.close-modal-button');
    cancelCloseModalProposal = document.querySelector('.cancel-modal-button');
    saveCloseModalProposal = document.querySelector('.save-modal-button');
    clientSelectProposal = document.querySelector('select[name="client"]');
    serviceTypeSelectProposal = document.querySelector('select[name="serviceType"]');
    offerDateInputProposal = document.querySelector('input[name="offerDate"]');
    statusSelectProposal = document.querySelector('select[name="status"]');
    valueInputProposal = document.querySelector('input[name="value"]');
    descriptionInputProposal = document.querySelector('textarea[name="description"]');
}

// Inicialização da página de interações
function propostasStartup() {
    getProposal().then(() => {
        getProposalElements();
        addNewProposalEvent(buttonAddNewProposal);
        addSwitchOverlayEvent(buttonCloseModalProposal);
        addSwitchOverlayEvent(cancelCloseModalProposal);
        addSwitchOverlayEvent(buttonCloseModalProposal);
        addSaveProposalEvent(saveCloseModalProposal);

        getAllClients(clientSelectProposal).then(() => {
            addSelectedDataEvent(clientSelectProposal);
            addSelectedDataEvent(statusSelectProposal);
            addSelectedDataEvent(serviceTypeSelectProposal);
        });

        setServiceTypeSelect();
        setStatusSelect();
        setInputMasksForProposals();
    })
}


