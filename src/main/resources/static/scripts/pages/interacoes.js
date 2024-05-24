// Elementos da página
let buttonAddNewInteraction;
let buttonCloseModalInteraction;
let cancelCloseModalInteraction;
let saveCloseModalInteraction;
let clientSelectInteraction;
let proposalSelectInteraction;
let contactSelectInteraction;
let dateInputInteraction;
let resultSelectInteraction;
let timeInputInteraction;
let durationInputInteraction;
let descriptionInputInteraction;
let tableContainerInteraction;

// Variáveis de interações
let interactionList;
let interactionPage;
let shouldLoadMoreInteractions;
let isLoadingMoreInteractions;

// Buscar todas as interações
async function getInteractions() {
    if (!shouldLoadMoreInteractions || isLoadingMoreInteractions) return;

    isLoadingMoreInteractions = true;

    await fetch(`${URL}/interaction/${interactionPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar interações`);
            }
            return response.json();
        })
        .then(data => {
            if (interactionPage + 1 === data.totalPages) {
                shouldLoadMoreInteractions = false;
            }

            const itemsToAdd = [];
            data.content.forEach((item) => {
                const isDuplicate = interactionList.some((existingItem) => {
                    return existingItem.id === item.id;
                });

                if (!isDuplicate) {
                    itemsToAdd.push(item);
                }
            });

            interactionPage++;
            isLoadingMoreInteractions = false;
            interactionList.push(...itemsToAdd);
            addInteractionRows(itemsToAdd);
        })
        .catch(() => {
            getMainFrameContent('error');
        });
}

// Busca apenas uma interação pelo id
async function getOneInteraction(id, isEditing) {
    await fetch(`${URL}/interaction/byId/${id}`)
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
                    const newRow = createInteractionTableRow(data);
                    oldRow.parentNode.replaceChild(newRow, oldRow);
                }

                const index = interactionList.findIndex(interaction => interaction.id === id);
                if (index !== -1) {
                    interactionList[index] = data;
                }

                addCheckboxesEvents();
            } else {
                interactionList.push(data);
                addInteractionRows([data]);
            }
        })
        .catch(error => {
            console.error(error);
            showErrorToast("Erro ao buscar interação!");
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
            ${rowCheckboxIcon}
        </th>
        <td>${interaction.id}</td>
        <td>${interaction.client.company ? interaction.client.company : interaction.name}</td>
        <td>${getResultDiv(interaction.result)}</td>
        <td>${getContactText(interaction.contact)}</td>
        <td>${interaction.description === "" ? '-' : interaction.description}</td>
        <td>${getDateFormatted(interaction.date) + ' - ' + interaction.time}</td>
        <td>${interaction.duration}</td>
        ${interactionButtons}
    `;

    addInteractionRowButtonEvents(newRow);

    return newRow;
}

// Adiciona os eventos dos botões da linha de um interação
function addInteractionRowButtonEvents(row) {
    const deleteButton = row.querySelector('.delete');
    const editButton = row.querySelector('.edit');

    deleteButton.addEventListener('click', () => {
        deleteInteraction(row).catch(error => {
            console.error(error)
        });
    });

    editButton.addEventListener('click', () => {
        const rowId = parseInt(row.getAttribute('data-row-id'));
        const interaction = interactionList.find(interaction => interaction.id === rowId);
        isEditingInteraction = true;
        resetInteractionFields();
        cleanInvalidClassesInteraction();
        fillFieldsInteraction(interaction);
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

            showSuccessToast("Interação excluída com sucesso!");
        }

    } catch (error) {
        console.error('Erro ao excluir interação: ', error);
        showErrorToast("Erro ao excluir interação!");
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
    clientSelectInteraction = document.querySelector('select[name="client"]');
    proposalSelectInteraction = document.querySelector('select[name="proposal"]');
    contactSelectInteraction = document.querySelector('select[name="contact"]');
    dateInputInteraction = document.querySelector('input[name="date"]');
    resultSelectInteraction = document.querySelector('select[name="result"]');
    timeInputInteraction = document.querySelector('input[name="time"]');
    durationInputInteraction = document.querySelector('input[name="duration"]');
    descriptionInputInteraction = document.querySelector('textarea[name="description"]');
    tableContainerInteraction = document.querySelector('.table-container');
}

// Inicialização da página de interações
function interactionStartup() {
    interactionList = [];
    interactionPage = 0;
    shouldLoadMoreInteractions = true;
    isLoadingMoreInteractions = false;

    getInteractions().then(() => {
        getInteractionElements();
        addNewInteractionEvent(buttonAddNewInteraction);
        addSwitchOverlayEvent(buttonCloseModalInteraction);
        addSwitchOverlayEvent(cancelCloseModalInteraction);
        addSwitchOverlayEvent(buttonCloseModalInteraction);
        addSaveInteractionEvent(saveCloseModalInteraction);

        addSelectedDataEvent(resultSelectInteraction);
        addSelectedDataEvent(contactSelectInteraction);

        getAllClients(clientSelectInteraction).then(() => {
            addSelectedDataEvent(clientSelectInteraction);
        });

        getAllProposals(proposalSelectInteraction).then(() => {
            addSelectedDataEvent(proposalSelectInteraction);
        })

        setContactSelect();
        setResultSelect();
        setInputMasksForInteractions();
        setInfiniteScroll(tableContainerInteraction);
    })
}


