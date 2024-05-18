let proposalForm = {
    id: null,
    offerDate: "",
    value: 0,
    serviceType: null,
    status: null,
    description: "",
    inactive: false,
    client: {
        id: null
    }
}

let isEditingProposal = false;

// Restaura o formulário para o padrão
function resetFormProposal() {
    proposalForm = {
        id: null,
        offerDate: "",
        value: 0,
        serviceType: null,
        status: null,
        description: "",
        inactive: false,
        client: {
            id: null
        }
    }
}

// Preenche os campos do modal com os dados de interação a ser editado
function fillFieldsProposal(proposal) {
    resetFormProposal();

    proposalForm.id = proposal.id;
    clientSelectProposal.value = proposal.client.id;
    serviceTypeSelectProposal.value = proposal.contact;
    statusSelectProposal.value = proposal.result;
    offerDateInputProposal.value = getDateFormatted(proposal.date);
    valueInputProposal.value = proposal.time;
    descriptionInputProposal.value = proposal.description;

    clientSelectProposal.classList.remove('unselected');
    serviceTypeSelectProposal.classList.remove('unselected');
    statusSelectProposal.classList.remove('unselected');

    offerDateInputProposal.dispatchEvent(new Event('input'));
    valueInputProposal.dispatchEvent(new Event('input'));
}

// Limpa os avisos de erro dos campos do modal
function cleanInvalidClassesProposal() {
    clientSelectProposal.classList.remove('invalid');
    serviceTypeSelectProposal.classList.remove('invalid');
    statusSelectProposal.classList.remove('invalid');
    offerDateInputProposal.parentElement.classList.remove('invalid');
    valueInputProposal.parentElement.classList.remove('invalid');
    descriptionInputProposal.parentElement.classList.remove('invalid');
}

// Reinicia os campos do modal
function resetProposalFields() {
    clientSelectProposal.value = 0;
    serviceTypeSelectProposal.value = 0;
    statusSelectProposal.value = 0;
    offerDateInputProposal.value = "";
    valueInputProposal.value = "";
    descriptionInputProposal.value = "";

    clientSelectProposal.classList.add('unselected')
    serviceTypeSelectProposal.classList.add('unselected')
    statusSelectProposal.classList.add('unselected')
}

// Coloca máscaras nos inputs do modal
function setInputMasksForProposals() {
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

    const dateInput = IMask(offerDateInputProposal, dateMask);
}

// Valida os inputs do modal de interações
function validateProposalForm() {
    cleanInvalidClassesProposal();
    let isFormValid = true;

    const clientIdValue = parseInt(clientSelectProposal.value.trim());
    if (clientIdValue === null || clientIdValue === 0) {
        clientSelectProposal.classList.add('invalid');
        isFormValid = false;
    } else {
        proposalForm.client.id = clientIdValue;
    }

    const contactIdValue = parseInt(serviceTypeSelectProposal.value.trim());
    if (contactIdValue === null || contactIdValue === 0) {
        serviceTypeSelectProposal.classList.add('invalid');
        isFormValid = false;
    } else {
        proposalForm.contact = contactIdValue;
    }

    if (offerDateInputProposal.value.trim() !== "") {
        proposalForm.date = getDateISO(offerDateInputProposal.value);
    } else {
        proposalForm.date = "";
        offerDateInputProposal.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const resultIdValue = parseInt(statusSelectProposal.value.trim());
    if (resultIdValue === null || resultIdValue === 0) {
        statusSelectProposal.classList.add('invalid');
        isFormValid = false;
    } else {
        proposalForm.result = resultIdValue;
    }

    if (valueInputProposal.value.trim() !== "") {
        proposalForm.time = valueInputProposal.value;
    } else {
        proposalForm.time = "";
        valueInputProposal.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    if (descriptionInputProposal.value.trim() !== "") {
        proposalForm.description = descriptionInputProposal.value;
    } else {
        proposalForm.description = "";
    }

    return isFormValid;
}

// Salva uma nova interação ou sua edição
async function saveProposal() {
    if (!validateProposalForm()) return;

    console.log(proposalForm)

    try {
        const response = await fetch(`${URL}/proposal`, {
            method: isEditingProposal ? 'PUT' : 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(proposalForm),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseData.message);
            return;
        } else {
            await getOneProposal(responseData.id, isEditingProposal);
        }

        switchOverlay();
    } catch (error) {
        console.error(isEditingProposal ? 'Erro ao editar interação:' : 'Erro ao criar interação:', error);
    }
}
