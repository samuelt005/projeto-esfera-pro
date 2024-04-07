function validadeCnpj(maskedCnpj) {
    let cnpj = maskedCnpj.replace(/\D+/g, '');

    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;

    let size = cnpj.length - 2
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (resultado !== parseInt((digits.charAt(0)))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return resultado === parseInt((digits.charAt(1)));
}