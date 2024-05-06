let interactionForm = {
    id: null, name: "", cpf: "", cnpj: "", company: "", inactive: false, address: {
        id: null, street: "", zip_code: "", number: null, city: {
            id: null
        }
    }
}
let isEditing = false;

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
    nameInput.value = interaction.name;
    cpfInput.value = interaction.cpf;
    companyInput.value = interaction.company;
    cnpjInput.value = interaction.cnpj;
    emailInput.value = interaction.email;
    whatsappInput.value = interaction.whatsapp;
    cellphoneInput.value = interaction.cellphone;
    telephoneInput.value = interaction.telephone;
    streetInput.value = interaction.address.street;
    numberInput.value = interaction.address.number;
    zipCodeInput.value = interaction.address.zip_code;
    stateSelect.value = interaction.address.city.state.id;
    stateSelect.classList.remove('unselected')
    getCitiesByState(interaction.address.city.state.id).then(() => {
        citySelect.value = interaction.address.city.id;
        citySelect.disabled = false;
        citySelect.classList.remove('unselected')
    });

    cpfInput.dispatchEvent(new Event('input'));
    cnpjInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('input'));
    whatsappInput.dispatchEvent(new Event('input'));
    cellphoneInput.dispatchEvent(new Event('input'));
    telephoneInput.dispatchEvent(new Event('input'));
    numberInput.dispatchEvent(new Event('input'));
    zipCodeInput.dispatchEvent(new Event('input'));
}

// Limpa os avisos de erro dos campos do modal
function cleanInvalidClasses() {
    nameInput.parentElement.classList.remove('invalid');
    cpfInput.parentElement.classList.remove('invalid');
    companyInput.parentElement.classList.remove('invalid');
    cnpjInput.parentElement.classList.remove('invalid');
    emailInput.parentElement.classList.remove('invalid');
    whatsappInput.parentElement.classList.remove('invalid');
    cellphoneInput.parentElement.classList.remove('invalid');
    telephoneInput.parentElement.classList.remove('invalid');
    streetInput.parentElement.classList.remove('invalid');
    numberInput.parentElement.classList.remove('invalid');
    zipCodeInput.parentElement.classList.remove('invalid');
    stateSelect.classList.remove('invalid');
    citySelect.classList.remove('invalid');
}

// Reinicia os campos do modal
function resetInteractionFields() {
    nameInput.value = "";
    cpfInput.value = "";
    companyInput.value = "";
    cnpjInput.value = "";
    emailInput.value = "";
    whatsappInput.value = "";
    cellphoneInput.value = "";
    telephoneInput.value = "";
    streetInput.value = "";
    numberInput.value = "";
    zipCodeInput.value = "";
    stateSelect.value = 0;
    stateSelect.classList.add('unselected')
    citySelect.value = 0;
    citySelect.disabled = true;
    citySelect.classList.add('unselected')
}

// Coloca m�scaras nos inputs do modal
function setInputMasks() {
    const cpfMask = {
        mask: '000.000.000-00'
    };
    const cnpjMask = {
        mask: '00.000.000/0000-00'
    }
    const numberMask = {
        mask: '0000000'
    }
    const zipCodeMask = {
        mask: '00000-000'
    }
    // TODO adicionar mais tipos de telefones compat�veis (internacionais?)
    const cellphoneMask = {
        mask: '00 00000-0000'
    }
    IMask(cpfInput, cpfMask);
    IMask(cnpjInput, cnpjMask);
    IMask(numberInput, numberMask);
    IMask(zipCodeInput, zipCodeMask);
    IMask(whatsappInput, cellphoneMask);
    IMask(cellphoneInput, cellphoneMask);
    IMask(telephoneInput, cellphoneMask);
}

// Valida os inputs do modal de interacoes
function validateInteractionForm() {
    cleanInvalidClasses();
    let isFormValid = true;

    if (nameInput.value.trim() !== "") {
        interactionForm.name = nameInput.value;
    } else {
        interactionForm.name = null;
        nameInput.parentElement.classList.add('invalid');
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

    const unmaskedCellphone = cellphoneInput.value.replace(/\D+/g, '');
    if (unmaskedCellphone.length === 11 || unmaskedCellphone.length === 0) {
        interactionForm.cellphone = unmaskedCellphone;
    } else {
        cellphoneInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    const unmaskedTelephone = telephoneInput.value.replace(/\D+/g, '');
    if (unmaskedTelephone.length === 11 || unmaskedTelephone.length === 0) {
        interactionForm.telephone = unmaskedTelephone;
    } else {
        telephoneInput.parentElement.classList.add('invalid');
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
            method: isEditing ? 'PUT' : 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(interactionForm),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro: ' + responseData.message);
            return;
        } else {
            await getOneInteraction(responseData.id, isEditing);
        }

        switchOverlay();
    } catch (error) {
        console.error(isEditing ? 'Erro ao editar interação:' : 'Erro ao criar interação:', error);
    }
}
