// Elementos da página
let buttonAddNewinteractions;
let buttonCloseModalinteractions;
let cancelCloseModalInteracitons;
let saveCloseModalInteractons;


// Lista de interacoes
let interactionList = [];

// Buscar todos os interacoes


// Adiciona linhas a tabela de interacoes
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
        <td>${interaction.name}</td>
        <td>${interaction.cnpj ? interaction.cnpj : interaction.cpf}</td>
        <td>${interaction.company}</td>
        <td>${interaction.telephone === "" || interaction.telephone === null ? '-' : interaction.telephone}</td>
        <td>${interaction.email === "" || interaction.email === null ? '-' : interaction.email}</td>
        <td>${interaction.address.city.name} - ${interaction.address.city.state.uf}</td>
        ${interacoesButtons}
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
        isEditing = true;
        resetInteractionFields();
        cleanInvalidClasses();
        fillFieldsInt(interaction);
        switchOverlay();
    });
}

// Remove uma linha da tabela de interacoes
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
        console.error('Erro ao excluir interação: ', error);
    }
}

// Adiciona o evento de salvar um interação no botão de salvar
function addSaveInteractionEvent(button) {
    function saveInteraction() {

    }

    button.addEventListener('click', saveInteraction);
}

// Adiciona o evento de adicionar novo interação no botão de adicionar
function addNewInteractionEvent(button) {
    button.addEventListener('click', () => {
        isEditing = false;
        resetInteractionFields();
        cleanInvalidClasses();
        switchOverlay();
    });
}

// Adiciona o evento de alterar a aparência do select ao selecionar um dado
function addSelectedCityEvent(select) {
    select.addEventListener('change', switchInteractionSelectClass);
}

// Altera a aparência do select ao selecionar um dado
function switchInteractionSelectClass(event) {
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

// Busca os elementos da página e atribui eles as variáveis globais
function getInteractionElements() {
    console.log('getDocumentElements');
    buttonAddNewinteractions = document.querySelector('.button-add-new');
    console.log(buttonAddNewinteractions);
    buttonCloseModalinteractions = document.querySelector('.close-modal-button');
    cancelCloseModalInteracitons = document.querySelector('.cancel-modal-button');
    saveCloseModalInteractons = document.querySelector('.save-modal-button');
}

// Inicialização da página de interacoes
function interacoesStartup() {
    console.log('interacoesStartup')
        getInteractionElements();
        addNewInteractionEvent(buttonAddNewinteractions);
        addSwitchOverlayEvent(buttonCloseModalinteractions);
        addSwitchOverlayEvent(cancelCloseModalInteracitons);
        addSwitchOverlayEvent(buttonCloseModalinteractions);
        addSaveInteractionEvent(saveCloseModalInteractons);

}


