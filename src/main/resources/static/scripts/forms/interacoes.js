let interactionForm = {
    id: null, name: "", cpf: "", cnpj: "", company: "", inactive: false, address: {
        id: null, street: "", zip_code: "", number: null, city: {
            id: null
        }
    }
}
let isEditingInteraction = false;

// Restaura o formul�rio para o padr�o
function resetFormInt() {
    interactionForm = {
        id: null,
        name: "",
        cpf: "",
        cnpj: "",
        company: "",
        email: "",
        whatsapp: "",
        cellphone: "",
        telephone: "",
        inactive: false,
        address: {
            id: null, street: "", zip_code: "", number: null, city: {
                id: null
            }
        }
    }
}

// Preenche os campos do modal com os dados do interação a ser editado
function fillFieldsInt(interaction) {
    resetFormInt();
    interactionForm.id = interaction.id;
    interactionForm.address.id = interaction.address.id;
    cpfInput.value = interaction.cpf;
    companyInput.value = interaction.company;
    cnpjInput.value = interaction.cnpj;
    emailInput.value = interaction.email;
    whatsappInput.value = interaction.whatsapp;
    telephoneInput.value = interaction.telephone;
    streetInput.value = interaction.address.street;
    numberInput.value = interaction.address.number;
    zipCodeInput.value = interaction.address.zip_code;
    stateSelect.value = interaction.address.city.state.id;
    stateSelect.classList.remove('unselected')

    cpfInput.dispatchEvent(new Event('input'));
    cnpjInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('input'));
    whatsappInput.dispatchEvent(new Event('input'));
    telephoneInput.dispatchEvent(new Event('input'));
    numberInput.dispatchEvent(new Event('input'));
    zipCodeInput.dispatchEvent(new Event('input'));
}

// Limpa os avisos de erro dos campos do modal
function cleanInvalidClassesInteraction() {
}

// Reinicia os campos do modal
function resetInteractionFields() {
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

    var timeInput = IMask(timeInputInteraction, hourMask);
    var duration = IMask(durationInputInteraction, hourMask);
}

// Valida os inputs do modal de interacoes
function validateInteractionForm() {
    cleanInvalidClassesInteraction();
    let isFormValid = true;

    if (nameInputInteraction.value.trim() !== "") {
        interactionForm.name = nameInputInteraction.value;
    } else {
        interactionForm.name = null;
        nameInputInteraction.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const unmaskedCpf = cpfInput.value.replace(/\D+/g, '');
    if (validadeCpf(unmaskedCpf)) {
        interactionForm.cpf = unmaskedCpf;
    } else {
        cpfInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    if (companyInput.value.trim() !== "") {
        interactionForm.company = companyInput.value;
    } else {
        companyInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const unmaskedCnpj = cnpjInput.value.replace(/\D+/g, '');
    if (validadeCnpj(unmaskedCnpj)) {
        interactionForm.cnpj = unmaskedCnpj;
    } else {
        cnpjInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Express�o regular para validar o e-mail
    if (emailInput.value.trim() !== "") {
        if (emailRegex.test(emailInput.value.trim())) {
            interactionForm.email = emailInput.value.trim();
        } else {
            emailInput.parentElement.classList.add('invalid');
            isFormValid = false;
        }
    }

    const unmaskedWhatsapp = whatsappInput.value.replace(/\D+/g, '');
    if (unmaskedWhatsapp.length === 11 || unmaskedWhatsapp.length === 0) {
        interactionForm.whatsapp = unmaskedWhatsapp;
    } else {
        whatsappInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    if (streetInput.value.trim() !== "") {
        interactionForm.address.street = streetInput.value;
    }

    const numberValue = parseInt(numberInput.value.trim());
    if (!isNaN(numberValue)) {
        interactionForm.address.number = numberValue;
    }

    const unmaskedZipCode = zipCodeInput.value.replace(/\D+/g, '');
    if (unmaskedZipCode.length === 8) {
        interactionForm.address.zip_code = unmaskedZipCode;
    } else if (unmaskedZipCode.length === 0) {
        interactionForm.address.zip_code = null;
    } else {
        zipCodeInput.parentElement.classList.add('invalid');
    }

    const stateIdValue = parseInt(stateSelect.value.trim());
    if (stateIdValue === null || stateIdValue === 0) {
        stateSelect.classList.add('invalid');
        isFormValid = false;
    }

    const cityIdValue = parseInt(citySelect.value.trim());
    if (cityIdValue === null || cityIdValue === 0) {
        citySelect.classList.add('invalid');
        isFormValid = false;
    } else {
        interactionForm.address.city.id = cityIdValue;
    }

    return isFormValid;
}

// Salva um novo interação ou sua edi��o
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
