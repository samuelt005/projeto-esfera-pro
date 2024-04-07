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

// const clientesList = [];
const allIds = [];

function getStates(stateSelect) {
    fetch(`${URL}/state`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar estados`);
            }
            return response.json();
        })
        .then(data => {
            addSelectOptions(data, stateSelect);
        })
        .catch(error => {
            console.error(error);
        });
}

function getCitiesByState(event) {
    if (!event.target) {
        return
    }

    switchSelectClass(event);

    if (!citySelect.classList.contains('unselected')) {
        citySelect.classList.add('unselected')
    }

    const state_id = event.target.value;

    fetch(`${URL}/city/byState/${state_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar cidades`);
            }
            return response.json();
        })
        .then(data => {
            addSelectOptions(data, citySelect)
            citySelect.disabled = false;
        })
        .catch(error => {
            console.error(error);
        });
}

function addSelectOptions(dataArray, select) {
    select.querySelectorAll('.state-option').forEach(option => option.remove());
    select.selectedIndex = 0;

    dataArray.forEach((data) => {
        const newOption = document.createElement('option');
        newOption.value = data.id;
        newOption.textContent = data.name;
        newOption.classList.add('state-option');

        select.appendChild(newOption);
    })
}

function addRows(times) {
    const tableContent = document.querySelector(".table-content");

    for (let i = 0; i < times; i++) {
        const rowData = {
            id: '1',
            name: 'Ana Almeida',
            cpf: '111.123.123-12',
            company: 'Empresa X',
            zip_code: '85940-000',
            street: 'Rua XYZ',
            city: 'Quatro Pontes',
            state: 'Paraná'
        };

        let newTableRow = `<tr id="row-${i + 1}">`;
        newTableRow += `
        <th class="row-checkbox" id="checkbox-${i + 1}">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>
        </th>`;

        for (const prop in rowData) {
            if (rowData.hasOwnProperty(prop)) {
                if (prop === 'id') {
                    continue;
                }

                newTableRow += `<td>${rowData[prop]}</td>`;
            }
        }

        newTableRow += clienteButtons;
        newTableRow += `</tr>`;
        allIds.push(i + 1);

        tableContent.innerHTML += newTableRow;
    }
}

function addSaveClientEvent(button) {
    button.addEventListener('click', saveClient);
}

function addSelectedStateEvent(select) {
    select.addEventListener('change', getCitiesByState);
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

function saveClient() {
    checkClientForm();
    // switchOverlay();
}

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
    addRows(20);
    getDocumentElements();

    addCheckboxEvents(checkboxes);
    addSelectAllEvent(selectAllCheckbox, checkboxes);
    addSwitchOverlayEvent(buttonAddNew);
    addSwitchOverlayEvent(buttonCloseModal);
    addSwitchOverlayEvent(cancelCloseModal);
    addSwitchOverlayEvent(buttonCloseModal);
    addSaveClientEvent(saveCloseModal);

    getStates(stateSelect);
    getCitiesByState(2);
    addSelectedStateEvent(stateSelect);
    addSelectedCityEvent(citySelect);

    setInputMasks();
}


