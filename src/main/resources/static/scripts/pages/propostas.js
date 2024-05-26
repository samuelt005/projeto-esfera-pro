// Elementos da página
let buttonAddNewProposal;
let buttonCloseModalProposal;
let cancelCloseModalProposal;
let saveCloseModalProposal;
let importOpenModalProposal;
let clientSelectProposal;
let serviceTypeSelectProposal;
let offerDateInputProposal;
let statusSelectProposal;
let valueInputProposal;
let descriptionInputProposal;
let tableContainerProposal;
let searchInputProposal;
let searchButtonProposal;
let searchCleanButtonProposal;

// Variáveis de filtros
let openFiltersButtonProposal;
let cleanFiltersButtonProposal;
let applyFiltersButtonProposal;
let filtersMenuProposal;
let statusFilterSelect;
let serviceTypeFilterSelect;
let currentStatusIdFilter = 0;
let currentServiceTypeIdFilter = 0;

// Variáveis de propostas
let proposalList;
let proposalPage;
let shouldLoadMoreProposals;
let isLoadingMoreProposals;
let currentSearchTermProposal = null;

// Limpa a listagem de clientes
function cleanAllProposals() {
    document.querySelector('.table-content').innerHTML = "";
    proposalList = [];
    proposalPage = 0;
    shouldLoadMoreProposals = true;
    currentSearchTermProposal = null;
}

// Buscar todas as propostas
async function getProposals(searchTerm = "") {
    if (!shouldLoadMoreProposals || isLoadingMoreProposals) return;

    isLoadingMoreProposals = true;

    let fetchUrl = `${URL}/proposal/${proposalPage}`;
    if (currentSearchTermProposal !== null) {
        fetchUrl += `?searchTerm=${encodeURIComponent(currentSearchTermProposal)}`;
    } else if (searchTerm !== "" || searchTerm !== null) {
        currentSearchTermProposal = searchTerm;
        fetchUrl += `?searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    if (currentStatusIdFilter !== 0) {
        if (fetchUrl.includes('?')) {
            fetchUrl += `&statusId=${encodeURIComponent(currentStatusIdFilter)}`;
        } else {
            fetchUrl += `?statusId=${encodeURIComponent(currentStatusIdFilter)}`;
        }
    }

    if (currentServiceTypeIdFilter !== 0) {
        if (fetchUrl.includes('?')) {
            fetchUrl += `&serviceTypeId=${encodeURIComponent(currentServiceTypeIdFilter)}`;
        } else {
            fetchUrl += `?serviceTypeId=${encodeURIComponent(currentServiceTypeIdFilter)}`;
        }
    }

    await fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar propostas`);
            }
            return response.json();
        })
        .then(data => {
            if (proposalPage + 1 === data.totalPages) {
                shouldLoadMoreProposals = false;
            }

            const itemsToAdd = [];
            data.content.forEach((item) => {
                const isDuplicate = proposalList.some((existingItem) => {
                    return existingItem.id === item.id;
                });

                if (!isDuplicate) {
                    itemsToAdd.push(item);
                }
            });

            proposalPage++;
            isLoadingMoreProposals = false;
            proposalList.push(...itemsToAdd);
            addProposalRows(itemsToAdd);
        })
        .catch((e) => {
            getMainFrameContent('error');
        });
}

// Busca apenas uma proposta pelo id
async function getOneProposal(id, isEditing) {
    await fetch(`${URL}/proposal/byId/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar proposta`);
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
            showErrorToast("Erro ao buscar proposta!");
        });
}

// Criar opções do select do tipo de serviço
function setServiceTypeSelect() {
    const selectElements = [serviceTypeSelectProposal, serviceTypeFilterSelect];
    const options = [
        {name: 'Consultoria', value: 1},
        {name: 'Acompanhamento', value: 2},
        {name: 'Treinamento', value: 3}
    ];

    options.forEach(option => {
        selectElements.forEach(select => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.name;
            newOption.classList.add('service-type-option');
            select.appendChild(newOption);
        });
    });
}

// Criar opções do select do tipo de status
function setStatusSelect() {
    const selectElements = [statusSelectProposal, statusFilterSelect];
    const options = [
        {name: 'Parado', value: 1},
        {name: 'Negociação', value: 2},
        {name: 'Acompanhar', value: 3},
        {name: 'Fechado', value: 4}
    ];

    options.forEach(option => {
        selectElements.forEach(select => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.name;
            newOption.classList.add('status-option');
            select.appendChild(newOption);
        });
    });
}

// Adiciona linhas a tabela de propostas
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
        <td>${proposal.client.name ? proposal.client.name : '-'}</td>
        <td>${getServiceTypeText(proposal.serviceType)}</td>
        <td>${getStatusDiv(proposal.status)}</td>
        <td>${proposal.description === "" ? '-' : proposal.description}</td>
        <td>${getDateFormatted(proposal.offerDate)}</td>
        <td>${formatCurrency(proposal.value)}</td>
        ${proposalButtons}
    `;

    addProposalRowButtonEvents(newRow);

    return newRow;
}

// Adiciona os eventos dos botões da linha de um proposta
function addProposalRowButtonEvents(row) {
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    deleteButton.addEventListener('click', () => {
        deleteProposal(row).catch(error => {
            console.error(error)
        });
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

// Remove uma linha da tabela de propostas
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

            showSuccessToast("Proposta excluída com sucesso!");
        }

    } catch (error) {
        console.error('Erro ao excluir proposta: ', error);
        showErrorToast("Erro ao excluir proposta!");
    }
}

// Adiciona o evento de salvar uma proposta no botão de salvar
function addSaveProposalEvent(button) {
    button.addEventListener('click', saveProposal);
}

// Adiciona o evento de adicionar nova proposta no botão de adicionar
function addNewProposalEvent(button) {
    button.addEventListener('click', () => {
        isEditingProposal = false;
        resetProposalFields();
        cleanInvalidClassesProposal();
        switchOverlay();
    });
}

// Adiciona o evento de limpar os filtros de propostas
function cleanAllProposalFilters(button) {
    button.addEventListener('click', () => {
        if (parseInt(statusFilterSelect.value) !== 0 || parseInt(serviceTypeFilterSelect.value) !== 0) {
            statusFilterSelect.value = 0;
            serviceTypeFilterSelect.value = 0;
            currentStatusIdFilter = 0;
            currentServiceTypeIdFilter = 0;
            openFiltersButtonProposal.classList.remove('active');
            if (!statusFilterSelect.classList.contains('unselected')) {
                statusFilterSelect.classList.add('unselected');
            }
            if (!serviceTypeFilterSelect.classList.contains('unselected')) {
                serviceTypeFilterSelect.classList.add('unselected');
            }
            cleanAllProposals();
            getProposals().then();
        }
    });
}

// Adiciona o evento para aplicar os filtros de cliente
function applyProposalFilters(button) {
    button.addEventListener('click', () => {
        if (parseInt(statusFilterSelect.value) !== 0 || parseInt(serviceTypeFilterSelect.value) !== 0) {
            currentStatusIdFilter = parseInt(statusFilterSelect.value);
            currentServiceTypeIdFilter = parseInt(serviceTypeFilterSelect.value);
            filtersMenuProposal.classList.toggle('hidden');
            openFiltersButtonProposal.classList.add('active');
            cleanAllProposals();
            getProposals().then();
        }
    });
}

// Busca os elementos da página e atribui eles as variáveis globais
function getProposalElements() {
    buttonAddNewProposal = document.querySelector('.button-add-new');
    buttonCloseModalProposal = document.querySelector('.close-modal-button');
    cancelCloseModalProposal = document.querySelector('.cancel-modal-button');
    saveCloseModalProposal = document.querySelector('.save-modal-button');
    importOpenModalProposal = document.querySelector('#import');
    clientSelectProposal = document.querySelector('select[name="client"]');
    serviceTypeSelectProposal = document.querySelector('select[name="serviceType"]');
    offerDateInputProposal = document.querySelector('input[name="offerDate"]');
    statusSelectProposal = document.querySelector('select[name="status"]');
    valueInputProposal = document.querySelector('input[name="value"]');
    descriptionInputProposal = document.querySelector('textarea[name="description"]');
    tableContainerProposal = document.querySelector('.table-container');
    searchInputProposal = document.querySelector('#search');
    searchButtonProposal = document.querySelector('#searchButton');
    searchCleanButtonProposal = document.querySelector('#searchCleanButton');
    openFiltersButtonProposal = document.querySelector('#filter');
    cleanFiltersButtonProposal = document.querySelector('.clean-filters-button');
    applyFiltersButtonProposal = document.querySelector('.apply-filters-button');
    filtersMenuProposal = document.querySelector('.filter-menu');
    statusFilterSelect = document.querySelector('select[name="status-filter"]');
    serviceTypeFilterSelect = document.querySelector('select[name="service-type-filter"]');
}

// Inicialização da página de propostas
function propostasStartup() {
    proposalList = [];
    proposalPage = 0;
    shouldLoadMoreProposals = true;
    isLoadingMoreProposals = false;
    currentSearchTermProposal = null;
    currentStatusIdFilter = 0;
    currentServiceTypeIdFilter = 0;

    getProposals().then(() => {
        getProposalElements();
        addNewProposalEvent(buttonAddNewProposal);
        addSwitchOverlayEvent(buttonCloseModalProposal);
        addSwitchOverlayEvent(cancelCloseModalProposal);
        addSwitchOverlayEvent(buttonCloseModalProposal);
        addSwitchOverlayImportEvent(importOpenModalProposal);
        addSaveProposalEvent(saveCloseModalProposal);
        addSwitchFilterMenuEvent(openFiltersButtonProposal, filtersMenuProposal);
        cleanAllProposalFilters(cleanFiltersButtonProposal);
        applyProposalFilters(applyFiltersButtonProposal);
        addSelectedDataEvent(statusFilterSelect);
        addSelectedDataEvent(serviceTypeFilterSelect);

        getAllClients(clientSelectProposal).then(() => {
            addSelectedDataEvent(clientSelectProposal);
            addSelectedDataEvent(statusSelectProposal);
            addSelectedDataEvent(serviceTypeSelectProposal);
        });

        setServiceTypeSelect();
        setStatusSelect();
        setInputMasksForProposals();
        setInfiniteScroll(tableContainerProposal, getProposals);
        setSearchInputEvent(searchInputProposal, searchButtonProposal, searchCleanButtonProposal, cleanAllProposals, getProposals);
    })
}


