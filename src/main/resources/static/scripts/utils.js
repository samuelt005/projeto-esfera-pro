// Converte um CPF no formato padrão para exibição
function getCpfFormatted(cpfString) {
    cpfString = cpfString.replace(/\D/g, '');
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Converte um CNPJ no formato padrão para exibição
function getCnpjFormatted(cnpjString) {
    cnpjString = cnpjString.replace(/\D/g, '');
    return cnpjString.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// Converte tipo date para formato DD/MM/YYYY
function getDateFormatted(dateISO) {
    const dateParts = dateISO.split('T')[0].split('-');
    return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
}

// Converte tipo date para formato DD/MM/YYYY
function getPhoneFormatted(phoneISO) {
    const DDD = phoneISO.slice(0, 2);
    const part1 = phoneISO.slice(2, 7);
    const part2 = phoneISO.slice(7);

    return DDD + ' ' + part1 + '-' + part2;
}

// Converte formato DD/MM/YYYY para tipo date
function getDateISO(date) {
    const dateParts = date.split('/');
    return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
}

// Converte um double para o formato de reais
function formatCurrency(value) {
    const valueParts = String(value).split('.');
    let formattedValue = valueParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (valueParts.length > 1) {
        let decimalPart = valueParts[1].padEnd(2, '0').slice(0, 2);
        formattedValue += ',' + decimalPart;
    } else {
        formattedValue += ',00';
    }

    formattedValue = 'R$ ' + formattedValue;

    return formattedValue;
}

// Converte número de anotação cientifica para HH:MM
function convertNumberToHours(valor) {
    // Converte o valor para um número
    var numero = parseFloat(valor.replace(",", "."));

    // Calcula as horas e minutos
    var horas = Math.floor(numero * 24);
    var minutos = Math.round((numero * 24 - horas) * 60);

    // Formatação para HH:MM
    var horaFormatada = horas.toString().padStart(2, '0');
    var minutosFormatados = minutos.toString().padStart(2, '0');

    // Retorna a hora formatada
    return horaFormatada + ":" + minutosFormatados;
}