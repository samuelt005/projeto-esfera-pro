let interactionForm = {
    id: null,
    date: "",
    time: "",
    duration: "",
    result: null,
    contact: null,
    description: "",
    inactive: false,
    client: {
        id: null
    }
}
let isEditingInteraction = false;

// Restaura o formulário para o padrão
function resetFormInteraction() {
    interactionForm = {
        id: null,
        date: "",
        time: "",
        duration: "",
        result: null,
        contact: null,
        description: "",
        inactive: false,
        client: {
            id: null
        }
    }
}

// Preenche os campos do modal com os dados de interação a ser editado
function fillFieldsInteraction(interaction) {
    resetFormInteraction();

    interactionForm.id = interaction.id;
    clientSelectInteraction.value = interaction.client.id;
    contactSelectInteraction.value = interaction.contact;
    resultSelectInteraction.value = interaction.result;
    dateInputInteraction.value = getDateFormatted(interaction.date);
    timeInputInteraction.value = interaction.time;
    durationInputInteraction.value = interaction.duration;
    descriptionInputInteraction.value = interaction.description;

    clientSelectInteraction.classList.remove('unselected');
    contactSelectInteraction.classList.remove('unselected');
    resultSelectInteraction.classList.remove('unselected');

    dateInputInteraction.dispatchEvent(new Event('input'));
    timeInputInteraction.dispatchEvent(new Event('input'));
    durationInputInteraction.dispatchEvent(new Event('input'));
}

// Limpa os avisos de erro dos campos do modal
function cleanInvalidClassesInteraction() {
    clientSelectInteraction.classList.remove('invalid');
    contactSelectInteraction.classList.remove('invalid');
    resultSelectInteraction.classList.remove('invalid');
    dateInputInteraction.parentElement.classList.remove('invalid');
    timeInputInteraction.parentElement.classList.remove('invalid');
    durationInputInteraction.parentElement.classList.remove('invalid');
    descriptionInputInteraction.parentElement.classList.remove('invalid');
}

// Reinicia os campos do modal
function resetInteractionFields() {
    clientSelectInteraction.value = 0;
    contactSelectInteraction.value = 0;
    resultSelectInteraction.value = 0;
    dateInputInteraction.value = "";
    timeInputInteraction.value = "";
    durationInputInteraction.value = "";
    descriptionInputInteraction.value = "";

    clientSelectInteraction.classList.add('unselected')
    contactSelectInteraction.classList.add('unselected')
    resultSelectInteraction.classList.add('unselected')
}

// Coloca máscaras nos inputs do modal
function setInputMasksForInteractions() {
    const hourMask = {
        mask: 'HH:MM',
        blocks: {
            HH: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 23,
                maxLength: 2,
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59,
                maxLength: 2,
            }
        },
        lazy: false
    };

    const dateMask = {
        mask: 'DD/MM/YYYY',
        blocks: {
            DD: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2,
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2,
            },
            YYYY: {
                mask: IMask.MaskedRange,
                from: 2000,
                to: 3000,
                maxLength: 4,
            }
        },
        lazy: false
    };

    const dateInput = IMask(dateInputInteraction, dateMask);
    const timeInput = IMask(timeInputInteraction, hourMask);
    const durationInput = IMask(durationInputInteraction, hourMask);
}

// Valida os inputs do modal de interações
function validateInteractionForm() {
    cleanInvalidClassesInteraction();
    let isFormValid = true;

    const clientIdValue = parseInt(clientSelectInteraction.value.trim());
    if (clientIdValue === null || clientIdValue === 0) {
        clientSelectInteraction.classList.add('invalid');
        isFormValid = false;
    } else {
        interactionForm.client.id = clientIdValue;
    }

    const contactIdValue = parseInt(contactSelectInteraction.value.trim());
    if (contactIdValue === null || contactIdValue === 0) {
        contactSelectInteraction.classList.add('invalid');
        isFormValid = false;
    } else {
        interactionForm.contact = contactIdValue;
    }

    if (dateInputInteraction.value.trim() !== "") {
        interactionForm.date = getDateISO(dateInputInteraction.value);
    } else {
        interactionForm.date = "";
        dateInputInteraction.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const resultIdValue = parseInt(resultSelectInteraction.value.trim());
    if (resultIdValue === null || resultIdValue === 0) {
        resultSelectInteraction.classList.add('invalid');
        isFormValid = false;
    } else {
        interactionForm.result = resultIdValue;
    }

    if (timeInputInteraction.value.trim() !== "") {
        interactionForm.time = timeInputInteraction.value;
    } else {
        interactionForm.time = "";
        timeInputInteraction.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    if (durationInputInteraction.value.trim() !== "") {
        interactionForm.duration = durationInputInteraction.value;
    } else {
        interactionForm.duration = "";
        durationInputInteraction.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    if (descriptionInputInteraction.value.trim() !== "") {
        interactionForm.description = descriptionInputInteraction.value;
    } else {
        interactionForm.description = "";
    }

    return isFormValid;
}

// Salva uma nova interação ou sua edição
async function saveInteraction() {
    if (!validateInteractionForm()) return;

    try {
        const response = await fetch(`${URL}/interaction`, {
            method: isEditingInteraction ? 'PUT' : 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(interactionForm),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseData.message);
            return;
        } else {
            await getOneInteraction(responseData.id, isEditingInteraction);
        }

        switchOverlay();
    } catch (error) {
        console.error(isEditingInteraction ? 'Erro ao editar interação:' : 'Erro ao criar interação:', error);
    }
}
