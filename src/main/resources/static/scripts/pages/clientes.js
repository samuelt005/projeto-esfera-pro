// Page Elements
let checkboxes;
let selectAllCheckbox;
let buttonAddNew;
let buttonCloseModal;
let cancelCloseModal;
let saveCloseModal;
let nameInput;
let cpfInput;
let companyInput;
let cnpjInput;
let streetInput;
let numberInput;
let zipCodeInput;
let stateSelect;
let citySelect;

// Page Global Variables
let clientList = [];
let allIds = [];

// Page Functions
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
            addRows(data);
        })
        .catch(error => {
            console.error(error);
        });
}

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
                const rowId = `row-${id}`;
                const oldRow = document.getElementById(rowId);
                if (oldRow) {
                    const newRow = createTableRow(data);
                    oldRow.parentNode.replaceChild(newRow, oldRow);
                }

                const index = clientList.findIndex(client => client.id === id);
                if (index !== -1) {
                    clientList[index] = data;
                }
            } else {
                clientList.push(data);
                addRows([data]);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

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

function addRows(clients) {
    const tableContent = document.querySelector(".table-content");

    clients.forEach((client) => {
        const newRow = createTableRow(client);
        tableContent.appendChild(newRow);
    });
}

function createTableRow(client) {
    const newRow = document.createElement('tr');
    newRow.id = `row-${client.id}`;
    newRow.innerHTML = `
        <th class="row-checkbox" id="checkbox-${client.id}">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>
        </th>
        <td>${client.name}</td>
        <td>${client.cnpj ? client.cnpj : client.cpf}</td>
        <td>${client.company}</td>
        <td>${client.address.zip_code !== null ? client.address.zip_code : '-'}</td>
        <td>${client.address.street !== '' ? client.address.street : '-'}</td>
        <td>${client.address.number !== null ? client.address.number : '-'}</td>
        <td>${client.address.city.name}</td>
        <td>${client.address.city.state.name}</td>
        ${clienteButtons}
    `;

    addRowButtonEvents(newRow);

    return newRow;
}

function addRowButtonEvents(row) {
    const sendMessageButton = row.querySelector('.send-message');
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    sendMessageButton.addEventListener('click', () => {
        const rowId = row.id.split('-')[1];
        const client = clientList.find(client => client.id === parseInt(rowId));
        // TODO adicionar lógica de enviar mensagem
        console.log('Enviar mensagem para cliente: ' + client.id);
    });

    deleteButton.addEventListener('click', deleteClient);

    editButton.addEventListener('click', () => {
        const rowId = row.id.split('-')[1];
        const client = clientList.find(client => client.id === parseInt(rowId));
        isEditing = true;
        resetFields();
        cleanInvalidClasses();
        fillFields(client);
        switchOverlay();
    });
}

async function deleteClient() {
    const rowId = this.closest('tr').id;
    const id = rowId.split('-')[1];

    const index = clientList.findIndex(client => client.id === parseInt(id));
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
            this.closest('tr').remove();
        }

    } catch (error) {
        console.error('Erro ao excluir cliente: ', error);
    }
}

function addSaveClientEvent(button) {
    button.addEventListener('click', saveClient);
}

function addSelectedStateEvent(select) {
    select.addEventListener('change', (event) => {
        getCitiesByState(event.target.value, event);
    });
}

function addNewItemEvent(button) {
    button.addEventListener('click', () => {
        isEditing = false;
        resetFields();
        cleanInvalidClasses();
        switchOverlay();
    });
}

function addSelectedCityEvent(select) {
    select.addEventListener('change', switchSelectClass);
}

function switchSelectClass(event) {
    if (!event.target) {
        return
    }

    const id = event.target.value;

    if (id !== 0) {
        event.target.classList.remove('unselected');
    } else if (!event.target.classList.contains('unselected')) {
        event.target.classList.add('unselected');
    }
}

// TODO Add function to reset table when edit, delete or create an item
// TODO Maybe use an observer?

function getDocumentElements() {
    checkboxes = document.querySelectorAll('.row-checkbox');
    selectAllCheckbox = document.querySelector('.select-all-checkbox');
    buttonAddNew = document.querySelector('.button-add-new');
    buttonCloseModal = document.querySelector('.close-modal-button');
    cancelCloseModal = document.querySelector('.cancel-modal-button');
    saveCloseModal = document.querySelector('.save-modal-button');
    nameInput = document.querySelector('input[name="name"]');
    cpfInput = document.querySelector('input[name="cpf"]');
    companyInput = document.querySelector('input[name="company"]');
    cnpjInput = document.querySelector('input[name="cnpj"]');
    streetInput = document.querySelector('input[name="street"]');
    numberInput = document.querySelector('input[name="number"]');
    zipCodeInput = document.querySelector('input[name="zip_code"]');
    stateSelect = document.querySelector('select[name="state"]');
    citySelect = document.querySelector('select[name="city"]');
}

function clientesStartup() {
    getClients().then(() => {
            getDocumentElements();
            addCheckboxEvents(checkboxes);
            addSelectAllEvent(selectAllCheckbox, checkboxes);
            addNewItemEvent(buttonAddNew);
            addSwitchOverlayEvent(buttonCloseModal);
            addSwitchOverlayEvent(cancelCloseModal);
            addSwitchOverlayEvent(buttonCloseModal);
            addSaveClientEvent(saveCloseModal);

            getStates(stateSelect).then(() => {
                addSelectedStateEvent(stateSelect);
                addSelectedCityEvent(citySelect);
                setInputMasks();
            });
        }
    );
}


