const clientesList = [];
const allIds = [];

function addRows(times) {
    const tableContent = document.querySelector(".table-content");

    for (let i = 0; i < times; i++) {
        const rowData = {
            id: '1',
            name: 'Ana Almeida',
            cpf: '111.123.123-12',
            company: 'Empresa X',
            zip_code: '85940-000',
            street: 'Rua XYZ',
            city: 'Quatro Pontes',
            state: 'Paraná'
        };

        let newTableRow = `<tr id="row-${i + 1}">`;
        newTableRow += `
        <th class="row-checkbox" id="checkbox-${i + 1}">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>
        </th>`;

        for (const prop in rowData) {
            if (rowData.hasOwnProperty(prop)) {
                if (prop === 'id') {
                    continue;
                }

                newTableRow += `<td>${rowData[prop]}</td>`;
            }
        }

        newTableRow += clienteButtons;
        newTableRow += `</tr>`;
        allIds.push(i + 1);

        tableContent.innerHTML += newTableRow;
    }
}

function clientesStartup() {
    addRows(20);
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const selectAllCheckbox = document.querySelector('.select-all-checkbox');
    const buttonAddNew = document.querySelector('.button-add-new');
    const buttonCloseModal = document.querySelector('.close-modal-button');
    const cancelCloseModal = document.querySelector('.cancel-modal-button');
    const saveCloseModal = document.querySelector('.save-modal-button');
    addCheckboxEvents(checkboxes);
    addSelectAllEvent(selectAllCheckbox, checkboxes);
    addSwitchOverlayEvent(buttonAddNew);
    addSwitchOverlayEvent(buttonCloseModal);
    addSwitchOverlayEvent(cancelCloseModal);
    addSwitchOverlayEvent(buttonCloseModal);
}


