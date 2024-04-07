let clientForm = {
    name: "", cpf: "", cnpj: "", company: "", street: "", number: "", zip_code: "", city_id: null, state_id: null
}

function checkClientForm() {
    let isFormValid = true;

    nameInput.parentElement.classList.remove('invalid');
    if (nameInput.value.trim() !== "") {
        clientForm.name = nameInput.value;
    } else {
        nameInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    cpfInput.parentElement.classList.remove('invalid');
    const unmaskedCpf = cpfInput.value.replace(/\D+/g, '');
    if (cpfInput.value.trim() !== "" && validadeCpf(unmaskedCpf)) {
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
    if (cnpjInput.value.trim() !== "" && validadeCnpj(unmaskedCnpj)) {
        clientForm.cnpj = unmaskedCnpj;
    } else {
        cnpjInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    streetInput.parentElement.classList.remove('invalid');
    if (streetInput.value.trim() !== "") {
        clientForm.street = streetInput.value;
    } else {
        streetInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    numberInput.parentElement.classList.remove('invalid');
    const numberValue = parseInt(numberInput.value.trim());
    if (!isNaN(numberValue)) {
        clientForm.number = numberValue;
    } else {
        numberInput.parentElement.classList.add('invalid');
        isFormValid = false;
    }

    zipCodeInput.parentElement.classList.remove('invalid');
    const unmaskedZipCode = zipCodeInput.value.replace(/\D+/g, '');
    if (zipCodeInput.value.trim() !== "" && unmaskedZipCode.length === 8) {
        clientForm.zip_code = unmaskedZipCode;
    } else {
        zipCodeInput.parentElement.classList.add('invalid');
        isFormValid = false;
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
