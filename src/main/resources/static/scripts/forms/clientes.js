let clientForm = {
    name: null,
    cpf: null,
    cnpj: null,
    company: null,
    street: null,
    number: null,
    zip_code: null,
    city_id: null,
    city_name: null,
    state_id: null,
    state_name: null
}

function resetForm() {
    clientForm = {
        name: null,
        cpf: null,
        cnpj: null,
        company: null,
        street: null,
        number: null,
        zip_code: null,
        city_id: null,
        city_name: null,
        state_id: null,
        state_name: null
    }
}

function fillFields(client) {
    nameInput.value = client.name;
    cpfInput.value = client.cpf;
    companyInput.value = client.company;
    cnpjInput.value = client.cnpj;
    streetInput.value = client.street;
    numberInput.value = client.number;
    zipCodeInput.value = client.zip_code;
    stateSelect.value = client.state_id;
    stateSelect.classList.remove('unselected')
    getCitiesByState(client.state_id).then(() => {
        citySelect.value = client.city_id;
        citySelect.disabled = false;
        citySelect.classList.remove('unselected')
    });

    cpfInput.dispatchEvent(new Event('input'));
    cnpjInput.dispatchEvent(new Event('input'));
    numberInput.dispatchEvent(new Event('input'));
    zipCodeInput.dispatchEvent(new Event('input'));
}

function resetFields() {
    nameInput.value = "";
    cpfInput.value = "";
    companyInput.value = "";
    cnpjInput.value = "";
    streetInput.value = "";
    numberInput.value = "";
    zipCodeInput.value = "";
    stateSelect.value = 0;
    stateSelect.classList.add('unselected')
    citySelect.value = 0;
    citySelect.disabled = true;
    citySelect.classList.add('unselected')
}

function checkClientForm() {
    resetForm();
    let isFormValid = true;

    nameInput.parentElement.classList.remove('invalid');
    if (nameInput.value.trim() !== "") {
        clientForm.name = nameInput.value;
    } else {
        clientForm.name = null;
        nameInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    cpfInput.parentElement.classList.remove('invalid');
    const unmaskedCpf = cpfInput.value.replace(/\D+/g, '');
    if (validadeCpf(unmaskedCpf)) {
        clientForm.cpf = unmaskedCpf;
    } else {
        cpfInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    companyInput.parentElement.classList.remove('invalid');
    if (companyInput.value.trim() !== "") {
        clientForm.company = companyInput.value;
    } else {
        companyInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    cnpjInput.parentElement.classList.remove('invalid');
    const unmaskedCnpj = cnpjInput.value.replace(/\D+/g, '');
    if (validadeCnpj(unmaskedCnpj)) {
        clientForm.cnpj = unmaskedCnpj;
    } else {
        cnpjInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    streetInput.parentElement.classList.remove('invalid');
    if (streetInput.value.trim() !== "") {
        clientForm.street = streetInput.value;
    }

    numberInput.parentElement.classList.remove('invalid');
    const numberValue = parseInt(numberInput.value.trim());
    if (!isNaN(numberValue)) {
        clientForm.number = numberValue;
    }

    zipCodeInput.parentElement.classList.remove('invalid');
    const unmaskedZipCode = zipCodeInput.value.replace(/\D+/g, '');
    if (unmaskedZipCode.length === 8) {
        clientForm.zip_code = unmaskedZipCode;
    } else if (unmaskedZipCode.length === 0) {
        clientForm.zip_code = null;
    } else {
        zipCodeInput.parentElement.classList.add('invalid');
    }

    stateSelect.classList.remove('invalid');
    const stateIdValue = parseInt(stateSelect.value.trim());
    if (!isNaN(stateIdValue) && stateIdValue !== 0) {
        clientForm.state_id = stateIdValue;
    } else {
        stateSelect.classList.add('invalid');
        isFormValid = false;
    }

    citySelect.classList.remove('invalid');
    const cityIdValue = parseInt(citySelect.value.trim());
    if (!isNaN(cityIdValue) && cityIdValue !== 0) {
        clientForm.city_id = cityIdValue;
    } else {
        citySelect.classList.add('invalid');
        isFormValid = false;
    }

    return isFormValid;
}

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
    IMask(cpfInput, cpfMask);
    IMask(cnpjInput, cnpjMask);
    IMask(numberInput, numberMask);
    IMask(zipCodeInput, zipCodeMask);
}
