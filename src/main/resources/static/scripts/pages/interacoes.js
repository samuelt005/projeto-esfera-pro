// Elementos da página
let buttonAddNewInteraction;
let buttonCloseModalInteraction;
let cancelCloseModalInteraction;
let saveCloseModalInteraction;
let clientInputInteraction;
let contactSelectInteraction;
let dateInputInteraction;
let resultSelectInteraction;
let timeInputInteraction;
let durationInputInteraction;
let descriptionInputInteraction;


// Lista de interações
let interactionList = [];

// Buscar todas as interações
async function getInteraction() {
    await fetch(`${URL}/interaction`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar interações`);
            }
            return response.json();
        })
        .then(data => {
            interactionList.push(...data);
            addInteractionRows(data);
        })
        .catch(error => {
            getMainFrameContent('error');
        });
}

// Busca todos os clientes
async function getAllClients(clientSelect) {
    await fetch(`${URL}/client`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar clientes`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach((data) => {
                const newOption = document.createElement('option');
                newOption.value = data.id;
                newOption.textContent = data.id + ' - ' + data.name;
                newOption.classList.add('contact-option');

                clientSelect.appendChild(newOption);
            })
            clientSelect.disabled = false;
        })
        .catch(error => {
            console.error(error);
        });
}

// Criar opções do select do tipo de contato
function setContactSelect() {
    const options = [
        {name: 'Ligação', value: 1},
        {name: 'Whatsapp', value: 2},
        {name: 'E-mail', value: 3}
    ]

    options.forEach((option) => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.name;
        newOption.classList.add('contact-option');

        contactSelectInteraction.appendChild(newOption);
    })
}

// Criar opções do select do tipo de resultado
function setResultSelect() {
    const options = [
        {name: 'Desligado', value: 1},
        {name: 'Ocupado', value: 2},
        {name: 'Cx. Postal', value: 3},
        {name: 'Atendido', value: 4}
    ]

    options.forEach((option) => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.name;
        newOption.classList.add('result-option');

        resultSelectInteraction.appendChild(newOption);
    })
}

// Adiciona linhas a tabela de interações
function addInteractionRows(interactions) {
    const tableContent = document.querySelector(".table-content");

    interactions.forEach((interaction) => {
        const newRow = createInteractionTableRow(interaction);
        tableContent.appendChild(newRow);
    });

    addCheckboxesEvents();
}

// Cria um elemento HTML de uma linha da tabela
function createInteractionTableRow(interaction) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', interaction.id);
    newRow.innerHTML = `
        <th class="row-checkbox" data-checkbox-id="${interaction.id}">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>
        </th>
        <td>${interaction.id}</td>
        <td>${interaction.client.company ? interaction.client.company : interaction.name}</td>
        <td>${getResultDiv(interaction.result)}</td>
        <td>${getContactText(interaction.contact)}</td>
        <td class="description">${interaction.description === "" ? '-' : interaction.description}</td>
        <td>${getDataFormatted(interaction.date) + ' - ' + interaction.time}</td>
        <td>${interaction.duration}</td>
        ${interactionButtons}
    `;

    addInteractionRowButtonEvents(newRow);

    return newRow;
}

// Adiciona os eventos dos botões da linha de um interação
function addInteractionRowButtonEvents(row) {
    const sendMessageButton = row.querySelector('.send-message');
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    const rowId = parseInt(row.getAttribute('data-row-id'));
    const interaction = interactionList.find(interaction => interaction.id === rowId);
    if (interaction.whatsapp) {
        sendMessageButton.addEventListener('click', () => {
            const phoneNumber = interaction.whatsapp.replace(/\D/g, '');
            window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`, '_blank');
        });
    } else {
        sendMessageButton.classList.add('disabled');
        sendMessageButton.disabled = true;
    }

    deleteButton.addEventListener('click', () => {
        deleteInteraction(row).catch(error => console.error(error));
    });

    editButton.addEventListener('click', () => {
        const rowId = parseInt(row.getAttribute('data-row-id'));
        const interaction = interactionList.find(interaction => interaction.id === rowId);
        isEditingInteraction = true;
        resetInteractionFields();
        cleanInvalidClassesInteraction();
        fillFieldsInt(interaction);
        switchOverlay();
    });
}

// Remove uma linha da tabela de interações
async function deleteInteraction(row) {
    const id = parseInt(row.getAttribute('data-row-id'));

    const index = interactionList.findIndex(interaction => interaction.id === id);
    if (index !== -1) {
        interactionList.splice(index, 1);
    }

    // TODO adicionar confirmação de exclusão

    try {
        const response = await fetch(`${URL}/interaction/${id}`, {
            method: 'DELETE',
        });

        const responseDataInteraction = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseDataInteraction.message);
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
function addSaveInteractionEvent(button) {
    button.addEventListener('click', saveInteraction);
}

// Adiciona o evento de adicionar nova interação no botão de adicionar
function addNewInteractionEvent(button) {
    button.addEventListener('click', () => {
        isEditingInteraction = false;
        resetInteractionFields();
        cleanInvalidClassesInteraction();
        switchOverlay();
    });
}

// Busca os elementos da página e atribui eles as variáveis globais
function getInteractionElements() {
    buttonAddNewInteraction = document.querySelector('.button-add-new');
    buttonCloseModalInteraction = document.querySelector('.close-modal-button');
    cancelCloseModalInteraction = document.querySelector('.cancel-modal-button');
    saveCloseModalInteraction = document.querySelector('.save-modal-button');
    clientInputInteraction = document.querySelector('select[name="client"]');
    contactSelectInteraction = document.querySelector('select[name="contact"]');
    dateInputInteraction = document.querySelector('input[name="date"]');
    resultSelectInteraction = document.querySelector('select[name="result"]');
    timeInputInteraction = document.querySelector('input[name="time"]');
    durationInputInteraction = document.querySelector('input[name="duration"]');
    descriptionInputInteraction = document.querySelector('input[name="description"]');
}

// Inicialização da página de interações
function interactionStartup() {
    getInteraction().then(() => {
        getInteractionElements();
        addNewInteractionEvent(buttonAddNewInteraction);
        addSwitchOverlayEvent(buttonCloseModalInteraction);
        addSwitchOverlayEvent(cancelCloseModalInteraction);
        addSwitchOverlayEvent(buttonCloseModalInteraction);
        addSaveInteractionEvent(saveCloseModalInteraction);

        getAllClients(clientInputInteraction).then();

        setContactSelect();
        setResultSelect();
        setInputMasksForInteractions();
    })
}


