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
            addRowButtonEvents();
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
                newOption.textContent = data.state_name;
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
        let newTableRow = `<tr id="row-${client.id}">`;
        newTableRow += `
        <th class="row-checkbox" id="checkbox-${client.id}">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>
        </th>`;

        const newRowData = `
            <td>${client.name}</td>
            <td>${client.cpf}</td>
            <td>${client.company}</td>
            <td>${client.zip_code}</td>
            <td>${client.street}</td>
            <td>${client.number}</td>
            <td>${client.city_name}</td>
            <td>${client.state_name}</td>
        `

        newTableRow += newRowData;
        newTableRow += clienteButtons;
        newTableRow += `</tr>`;
        allIds.push(client.id);

        tableContent.innerHTML += newTableRow;
    })
}

function addRowButtonEvents() {
    document.querySelectorAll('.table-buttons').forEach(button => {
        const sendMessageButton = button.querySelector('.send-message');
        const deleteButton = button.querySelector('.delete');
        const editButton = button.querySelector('.edit');

        sendMessageButton.addEventListener('click', () => {
            const rowId = button.closest('tr').id.split('-')[1];
            const cliente = clientList.find(client => client.id === parseInt(rowId));
            // TODO add send message logic
            console.log('Enviar mensagem para cliente: ' + cliente.id)
        });

        deleteButton.addEventListener('click', () => {
            const rowId = button.closest('tr').id.split('-')[1];
            const cliente = clientList.find(client => client.id === parseInt(rowId));

            fetch(`${URL}/client/${cliente.id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao deletar cliente`);
                    } else {
                        console.log('Cliente deletado com sucesso: ' + cliente.id);
                    }
                })
                .catch(error => {
                    console.error('Erro ao criar cliente:', error);
                });
        });

        editButton.addEventListener('click', () => {
            const rowId = button.closest('tr').id.split('-')[1];
            const client = clientList.find(client => client.id === parseInt(rowId));
            fillFields(client);
            switchOverlay();
        });
    });
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
        resetFields();
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

// TODO add editClient async function

async function saveClient() {
    if (checkClientForm()) {
        await fetch(`${URL}/client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientForm),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao criar cliente`);
                }
                return response.json();
            })
            .then(data => {
                addRows([data]);
                // TODO resetar o botão de select-all quando adicionado uma nova linha
                console.log('Cliente criado com sucesso:', [data]);
                switchOverlay();
            })
            .catch(error => {
                console.error('Erro ao criar cliente:', error);
            });
    }
}

// TODO add function to reset table when edit, delete or create an item

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


