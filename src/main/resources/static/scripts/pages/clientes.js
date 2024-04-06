let clientes = [];

function addRows(times) {
    const tableContent = document.querySelector(".table-content");

    for (let i = 0; i < times; i++) {
        const rowData = {
            id: '1',
            nome: 'Ana Almeida',
            cpfCnpj: '111.123.123-12',
            categoria: 'Consultoria',
            status: 'Negociação',
            descricao: 'Lorem Ipsum',
            data: '01/01/2024',
            valor: 'R$ 130,00'
        };

        let newTableRow = `<tr id="${rowData.id}">`;

        for (const prop in rowData) {
            if (rowData.hasOwnProperty(prop)) {
                newTableRow += `<td>${rowData[prop]}</td>`;
            }
        }

        newTableRow += clienteButtons;
        newTableRow += `</tr>`;

        // Adicionar a nova linha à tabela
        tableContent.innerHTML += newTableRow;
    }
}

function clientesStartup() {
    addRows(20);
}


