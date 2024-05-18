// Elementos da página
let checkboxes;
let selectAllCheckbox;
let buttonAddNew;
let buttonCloseModal;
let cancelCloseModal;
let saveCloseModal;
let importOpenModal;
let nameInput;
let cpfInput;
let companyInput;
let cnpjInput;
let emailInput;
let whatsappInput;
let cellphoneInput;
let telephoneInput;
let streetInput;
let numberInput;
let zipCodeInput;
let stateSelect;
let citySelect;

// Lista de clientes
let clientList = [];

// Buscar todos os clientes
async function getClients() {
    await fetch(`${URL}/client`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar clientes`);
            }
            return response.json();
        })
        .then(data => {
            clientList.push(...data);
            addClientRows(data);
        })
        .catch(() => {
            getMainFrameContent('error');
        });
}

// Busca apenas um cliente pelo id
async function getOneClient(id, isEditing) {
    await fetch(`${URL}/client/byId/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar cliente`);
            }
            return response.json();
        })
        .then(data => {
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
                addClientRows([data]);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Busca todos os estados
async function getStates(stateSelect) {
    await fetch(`${URL}/state`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar estados`);
            }
            return response.json();
        })
        .then(data => {
            stateSelect.querySelectorAll('.state-option').forEach(option => option.remove());
            stateSelect.selectedIndex = 0;

            data.forEach((data) => {
                const newOption = document.createElement('option');
                newOption.value = data.id;
                newOption.textContent = data.name;
                newOption.classList.add('state-option');

                stateSelect.appendChild(newOption);
            })
            stateSelect.disabled = false;
        })
        .catch(error => {
            console.error(error);
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

    await fetch(`${URL}/city/byState/${state_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar cidades`);
            }
            return response.json();
        })
        .then(data => {
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
        })
        .catch(error => {
            console.error(error);
        });
}

// Adiciona linhas a tabela de clientes
function addClientRows(clients) {
    const tableContent = document.querySelector(".table-content");

    clients.forEach((client) => {
        const newRow = createClientTableRow(client);
        tableContent.appendChild(newRow);
    });

    addCheckboxesEvents();
}

// Cria um elemento HTML de uma linha da tabela
function createClientTableRow(client) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', client.id);
    newRow.innerHTML = `
        <th class="row-checkbox" data-checkbox-id="${client.id}">
            ${rowCheckboxIcon}
        </th>
        <td>${client.name}</td>
        <td>${client.cnpj ? getCnpjFormatted(client.cnpj) : getCpfFormatted(client.cpf)}</td>
        <td>${client.company}</td>
        <td>${client.telephone === "" || client.telephone === null ? '-' : getTelephoneFormated(client.telephone)}</td>
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
        deleteClient(row).catch(error => console.error(error));
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
        }

    } catch (error) {
        console.error('Erro ao excluir cliente: ', error);
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

// Adiciona o evento de adicionar novo cliente no botão de adicionar
function addNewClientEvent(button) {
    button.addEventListener('click', () => {
        isEditing = false;
        resetFields();
        cleanInvalidClasses();
        switchOverlay();
    });
}

// Busca os elementos da página e atribui eles as variáveis globais
function getClientElements() {
    buttonAddNew = document.querySelector('.button-add-new');
    buttonCloseModal = document.querySelector('.close-modal-button');
    cancelCloseModal = document.querySelector('.cancel-modal-button');
    saveCloseModal = document.querySelector('.save-modal-button');
    importOpenModal = document.querySelector('#import');
    nameInput = document.querySelector('input[name="name"]');
    cpfInput = document.querySelector('input[name="cpf"]');
    companyInput = document.querySelector('input[name="company"]');
    cnpjInput = document.querySelector('input[name="cnpj"]');
    emailInput = document.querySelector('input[name="email"]');
    whatsappInput = document.querySelector('input[name="whatsapp"]');
    cellphoneInput = document.querySelector('input[name="cellphone"]');
    telephoneInput = document.querySelector('input[name="telephone"]');
    streetInput = document.querySelector('input[name="street"]');
    numberInput = document.querySelector('input[name="number"]');
    zipCodeInput = document.querySelector('input[name="zip_code"]');
    stateSelect = document.querySelector('select[name="state"]');
    citySelect = document.querySelector('select[name="city"]');
}

// Inicialização da página de clientes
function clientesStartup() {
    getClients().then(() => {
        getClientElements();
        addNewClientEvent(buttonAddNew);
        addSwitchOverlayEvent(buttonCloseModal);
        addSwitchOverlayEvent(cancelCloseModal);
        addSwitchOverlayEvent(buttonCloseModal);
        addSaveClientEvent(saveCloseModal);
        addSwitchOverlayImportEvent(importOpenModal);

        getStates(stateSelect).then(() => {
            addSelectedStateEvent(stateSelect);
            addSelectedDataEvent(citySelect);
            setInputMasks();
        });
    });
}


