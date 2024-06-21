// Elementos da página
let checkboxes;
let selectAllCheckbox;
let buttonAddNew;
let buttonCloseModal;
let cancelCloseModal;
let saveCloseModal;
let importOpenModal;
let exportItemsButton;
let nameInput;
let clientTypeSelect;
let cpfInput;
let cpfWrapper;
let cnpjInput;
let cnpjWrapper;
let emailInput;
let whatsappInput;
let cellphoneInput;
let telephoneInput;
let streetInput;
let numberInput;
let zipCodeInput;
let stateSelect;
let citySelect;
let tableContainerClient;
let searchInputClient;
let searchButtonClient;
let searchCleanButtonClient;

// Variáveis de filtros
let openFiltersButtonClient;
let cleanFiltersButtonClient;
let applyFiltersButtonClient;
let filtersMenuClient;
let stateFilterSelect;
let currentStateIdFilter = 0;

// Variáveis de clientes
let clientList;
let clientPage;
let shouldLoadMoreClient;
let isLoadingMoreClient;
let currentSearchTermClient = null;

// Limpa a listagem de clientes
function cleanAllClients() {
    document.querySelector('.table-content').innerHTML = "";
    clientList = [];
    clientPage = 0;
    shouldLoadMoreClient = true;
    currentSearchTermClient = null;
}

// Buscar todos os clientes
async function getClients(searchTerm = "") {
    if (!shouldLoadMoreClient || isLoadingMoreClient) return;

    isLoadingMoreClient = true;

    let fetchUrl = `${URL}/client/${clientPage}`;
    if (currentSearchTermClient !== null) {
        fetchUrl += `?searchTerm=${encodeURIComponent(currentSearchTermClient)}`;
    } else if (searchTerm !== "" || searchTerm !== null) {
        currentSearchTermClient = searchTerm;
        fetchUrl += `?searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    if (currentStateIdFilter !== 0) {
        if (fetchUrl.includes('?')) {
            fetchUrl += `&stateId=${encodeURIComponent(currentStateIdFilter)}`;
        } else {
            fetchUrl += `?stateId=${encodeURIComponent(currentStateIdFilter)}`;
        }
    }

    await fetch(fetchUrl, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar clientes`);
            }
            return response.json();
        })
        .then(data => {
            if (clientPage + 1 === data.totalPages) {
                shouldLoadMoreClient = false;
            }

            const itemsToAdd = [];
            data.content.forEach((item) => {
                const isDuplicate = clientList.some((existingItem) => {
                    return existingItem.id === item.id;
                });

                if (!isDuplicate) {
                    itemsToAdd.push(item);
                }
            });

            if (isSelectAllActive) {
                itemsToAdd.forEach((item) => {
                    selectedIds.push(item.id)
                })
            }

            clientPage++;
            isLoadingMoreClient = false;
            clientList.push(...itemsToAdd);
            addClientRows(itemsToAdd, false);
        })
        .catch(() => {
            getMainFrameContent('error');
            showErrorToast("Erro ao buscar clientes!");
        });
}

// Busca apenas um cliente pelo id
async function getOneClient(id, isEditing) {
    await fetch(`${URL}/client/byId/${id}`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao recuperar cliente`);
        }
        return response.json();
    }).then(data => {
        if (isEditing) {
            const oldRow = document.querySelector(`tr[data-row-id="${id}"]`);
            if (oldRow) {
                const newRow = createClientTableRow(data);
                oldRow.parentNode.replaceChild(newRow, oldRow);
            }

            const index = clientList.findIndex(client => client.id === id);
            if (index !== -1) {
                clientList[index] = data;
            }

            addCheckboxesEvents();
        } else {
            clientList.push(data);
            addClientRows([data], true);
        }
    })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar cliente!");
        });
}

// Busca todos os estados
async function getStates(stateSelect, stateFilterSelect) {
    await fetch(`${URL}/state`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao recuperar estados`);
        }
        return response.json();
    }).then(data => {
        stateSelect.querySelectorAll('.state-option').forEach(option => option.remove());
        stateSelect.selectedIndex = 0;

        data.forEach((data) => {
            const newOptionModal = document.createElement('option');
            newOptionModal.value = data.id;
            newOptionModal.textContent = data.name;
            newOptionModal.classList.add('state-option');

            stateSelect.appendChild(newOptionModal);

            const newOptionFilter = document.createElement('option');
            newOptionFilter.value = data.id;
            newOptionFilter.textContent = data.name;
            newOptionFilter.classList.add('state-option');
            stateFilterSelect.appendChild(newOptionFilter);
        })
        stateSelect.disabled = false;
    }).catch(error => {
        console.error(error);
        showErrorToast("Erro ao buscar estados!");
    });
}

// Busca cidades pelo ID do estado
async function getCitiesByState(state_id, event) {
    if (event?.target) {
        switchSelectClass(event);
    }

    if (!citySelect.classList.contains('unselected')) {
        citySelect.classList.add('unselected')
    }

    await fetch(`${URL}/city/byState/${state_id}`, {
        method: 'GET', headers: {
            'Authorization': userToken, 'Content-Type': 'text/html'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao recuperar cidades`);
        }
        return response.json();
    }).then(data => {
        citySelect.querySelectorAll('.state-option').forEach(option => option.remove());
        citySelect.selectedIndex = 0;

        data.forEach((data) => {
            const newOption = document.createElement('option');
            newOption.value = data.id;
            newOption.textContent = data.name;
            newOption.classList.add('state-option');

            citySelect.appendChild(newOption);
        })
        citySelect.disabled = false;
    }).catch(error => {
        console.error(error);
        showErrorToast("Erro ao buscar cidades!");
    });
}

// Criar opções do select do tipo de resultado
function setClientTypeSelect() {
    const selectElements = [clientTypeSelect];
    const options = [{name: 'Pessoa jurídica', value: 1}, {name: 'Pessoa física', value: 2}]

    options.forEach((option) => {
        selectElements.forEach(select => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.name;
            newOption.classList.add('client-type-option');
            select.appendChild(newOption);
        });
    })
}

// Adiciona linhas a tabela de clientes
function addClientRows(clients, insertAtStart) {
    const tableContent = document.querySelector(".table-content");

    clients.forEach((client) => {
        const newRow = createClientTableRow(client);

        if (insertAtStart) {
            tableContent.insertBefore(newRow, tableContent.firstChild);
        } else {
            tableContent.appendChild(newRow);
        }
    });

    addCheckboxesEvents();
}

// Cria um elemento HTML de uma linha da tabela
function createClientTableRow(client) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', client.id);
    newRow.innerHTML = `
        <td class="row-checkbox ${isSelectAllActive ? 'selected' : ''}" data-checkbox-id="${client.id}">
            ${rowCheckboxIcon}
        </td>
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.cnpj ? getCnpjFormatted(client.cnpj) : getCpfFormatted(client.cpf)}</td>
        <td>${client.telephone === "" || client.telephone === null ? '-' : getPhoneFormatted(client.telephone)}</td>
        <td>${client.email === "" || client.email === null ? '-' : client.email}</td>
        <td>${client.address.city.name} - ${client.address.city.state.uf}</td>
        ${clienteButtons}
    `;

    addClientRowButtonEvents(newRow);

    return newRow;
}

// Adiciona os eventos dos botões da linha de um cliente
function addClientRowButtonEvents(row) {
    const sendMessageButton = row.querySelector('.send-message');
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    const rowId = parseInt(row.getAttribute('data-row-id'));
    const client = clientList.find(client => client.id === rowId);
    if (client.whatsapp) {
        sendMessageButton.addEventListener('click', () => {
            const phoneNumber = client.whatsapp.replace(/\D/g, '');
            window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`, '_blank');
        });
    } else {
        sendMessageButton.classList.add('disabled');
        sendMessageButton.disabled = true;
    }

    deleteButton.addEventListener('click', () => {
        deleteClient(row).catch(error => {
            console.error(error)
        });
    });

    editButton.addEventListener('click', () => {
        const rowId = parseInt(row.getAttribute('data-row-id'));
        const client = clientList.find(client => client.id === rowId);
        isEditing = true;
        resetFields();
        cleanInvalidClasses();
        fillFields(client);
        switchOverlay();
    });
}

// Remove uma linha da tabela de clientes
async function deleteClient(row) {
    const id = parseInt(row.getAttribute('data-row-id'));

    const index = clientList.findIndex(client => client.id === id);
    if (index !== -1) {
        clientList.splice(index, 1);
    }

    // TODO adicionar confirmação de exclusão

    try {
        const response = await fetch(`${URL}/client/${id}`, {
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
            addCheckboxesEvents();

            const index = selectedIds.findIndex(selectedId => selectedId === id);
            if (index !== -1) {
                selectedIds.splice(index, 1);
            }

            showSuccessToast("Cliente excluído com sucesso!");
        }

    } catch (error) {
        console.error('Erro ao excluir cliente: ', error);
        showErrorToast("Erro ao excluir cliente!");
    }
}

// Adiciona o evento de salvar um cliente no botão de salvar
function addSaveClientEvent(button) {
    button.addEventListener('click', saveClient);
}

// Adiciona o evento de buscar cidades ao select de estados
function addSelectedStateEvent(select) {
    select.addEventListener('change', (event) => {
        getCitiesByState(event.target.value, event)
            .catch(error => console.error(error));
    });
}

// Adiciona o evento de trocar entre cpf e cnpj ao selecionar o tipo do cliente
function addSelectedClientTypeEvent(select) {
    select.addEventListener('change', (event) => {
        const clientType = event.target.value;
        if (clientType === '1') {
            cpfInput.value = "";
            cpfInput.parentElement.classList.remove('invalid');
            cpfWrapper.classList.add('hidden')
            cnpjWrapper.classList.remove('hidden')
        } else {
            cnpjInput.value = "";
            cnpjInput.parentElement.classList.remove('invalid');
            cpfWrapper.classList.remove('hidden')
            cnpjWrapper.classList.add('hidden')
        }
    });
}

// Adiciona o evento de adicionar novo cliente no botão de adicionar
function addNewClientEvent(button) {
    button.addEventListener('click', () => {
        isEditing = false;
        resetFields();
        cleanInvalidClasses();
        switchOverlay();
    });
}

// Adiciona o evento de limpar os filtros de cliente
function cleanAllClientFilters(button) {
    button.addEventListener('click', () => {
        if (parseInt(stateFilterSelect.value) !== 0) {
            stateFilterSelect.value = 0;
            currentStateIdFilter = 0;
            openFiltersButtonClient.classList.remove('active');
            if (!stateFilterSelect.classList.contains('unselected')) {
                stateFilterSelect.classList.add('unselected');
            }
            cleanAllClients();
            getClients().then();
        }
    });
}

// Adiciona o evento para aplicar os filtros de cliente
function applyClientFilters(button) {
    button.addEventListener('click', () => {
        if (parseInt(stateFilterSelect.value) !== 0) {
            currentStateIdFilter = parseInt(stateFilterSelect.value);
            filtersMenuClient.classList.toggle('hidden');
            openFiltersButtonClient.classList.add('active');
            cleanAllClients();
            getClients().then();
        }
    });
}

// Busca os elementos da página e atribui eles as variáveis globais
function getClientElements() {
    buttonAddNew = document.querySelector('.button-add-new');
    buttonCloseModal = document.querySelector('.close-modal-button');
    cancelCloseModal = document.querySelector('.cancel-modal-button');
    saveCloseModal = document.querySelector('.save-modal-button');
    importOpenModal = document.querySelector('#import');
    exportItemsButton = document.querySelector('#export');
    nameInput = document.querySelector('input[name="name"]');
    clientTypeSelect = document.querySelector('select[name="client-type"]');
    cpfInput = document.querySelector('input[name="cpf"]');
    cpfWrapper = document.querySelector('.cpf-wrapper');
    cnpjInput = document.querySelector('input[name="cnpj"]');
    cnpjWrapper = document.querySelector('.cnpj-wrapper');
    emailInput = document.querySelector('input[name="email"]');
    whatsappInput = document.querySelector('input[name="whatsapp"]');
    cellphoneInput = document.querySelector('input[name="cellphone"]');
    telephoneInput = document.querySelector('input[name="telephone"]');
    streetInput = document.querySelector('input[name="street"]');
    numberInput = document.querySelector('input[name="number"]');
    zipCodeInput = document.querySelector('input[name="zip_code"]');
    stateSelect = document.querySelector('select[name="state"]');
    citySelect = document.querySelector('select[name="city"]');
    tableContainerClient = document.querySelector('.table-container');
    searchInputClient = document.querySelector('#search');
    searchButtonClient = document.querySelector('#searchButton');
    searchCleanButtonClient = document.querySelector('#searchCleanButton');
    openFiltersButtonClient = document.querySelector('#filter');
    cleanFiltersButtonClient = document.querySelector('.clean-filters-button');
    applyFiltersButtonClient = document.querySelector('.apply-filters-button');
    filtersMenuClient = document.querySelector('.filter-menu');
    stateFilterSelect = document.querySelector('select[name="state-filter"]');
}

// Inicialização da página de clientes
function clientesStartup() {
    clientList = [];
    clientPage = 0;
    shouldLoadMoreClient = true;
    isLoadingMoreClient = false;
    currentSearchTermClient = null;
    currentStateIdFilter = 0;

    getClients().then(() => {
        getClientElements();
        addNewClientEvent(buttonAddNew);
        addSwitchOverlayEvent(buttonCloseModal);
        addSwitchOverlayEvent(cancelCloseModal);
        addSwitchOverlayEvent(buttonCloseModal);
        addSwitchOverlayImportEvent(importOpenModal);
        addExportEvent(exportItemsButton);
        addSwitchFilterMenuEvent(openFiltersButtonClient, filtersMenuClient);
        cleanAllClientFilters(cleanFiltersButtonClient);
        applyClientFilters(applyFiltersButtonClient);
        addSaveClientEvent(saveCloseModal);

        getStates(stateSelect, stateFilterSelect).then(() => {
            setClientTypeSelect();
            addSelectedClientTypeEvent(clientTypeSelect);
            addSelectedStateEvent(stateSelect);
            addSelectedDataEvent(citySelect);
            addSelectedDataEvent(stateFilterSelect);
            setInputMasks();
        });

        setInfiniteScroll(tableContainerClient, getClients);
        setSearchInputEvent(searchInputClient, searchButtonClient, searchCleanButtonClient, cleanAllClients, getClients);
    });
}


