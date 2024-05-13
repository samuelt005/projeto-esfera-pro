// Este arquivo possui funções padrões que podem ser utilizadas em qualquer tabela

// Ícones em formato HTML para uso comum
const errorSmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.199951" width="20" height="20" rx="10" fill="#FF0000"/>
    <path d="M15.2 6.81875L13.3812 5L10.2 8.18125L7.0187 5L5.19995 6.81875L8.3812 10L5.19995 13.1812L7.0187 15L10.2 11.8187L13.3812 15L15.2 13.1812L12.0187 10L15.2 6.81875Z"
          fill="white"/>
</svg>
`

const warningSmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#FF9900"/>
    <path d="M10 16.5C11.7239 16.5 13.3772 15.8152 14.5962 14.5962C15.8152 13.3772 16.5 11.7239 16.5 10C16.5 8.27609 15.8152 6.62279 14.5962 5.40381C13.3772 4.18482 11.7239 3.5 10 3.5C8.27609 3.5 6.62279 4.18482 5.40381 5.40381C4.18482 6.62279 3.5 8.27609 3.5 10C3.5 11.7239 4.18482 13.3772 5.40381 14.5962C6.62279 15.8152 8.27609 16.5 10 16.5ZM14.5 8.5V11.5H5.5V8.5H14.5Z"
          fill="white"/>
</svg>
`

const infoSmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#000AFF"/>
    <path d="M10 3.75C6.55 3.75 3.75 6.55 3.75 10C3.75 13.45 6.55 16.25 10 16.25C13.45 16.25 16.25 13.45 16.25 10C16.25 6.55 13.45 3.75 10 3.75ZM5 10C5 7.2375 7.2375 5 10 5C11.1562 5 12.2188 5.39375 13.0625 6.05625L6.05625 13.0625C5.36985 12.1895 4.99774 11.1106 5 10ZM10 15C8.84375 15 7.78125 14.6062 6.9375 13.9437L13.9437 6.9375C14.6301 7.81054 15.0023 8.88944 15 10C15 12.7625 12.7625 15 10 15Z"
          fill="white"/>
</svg>
`

const okSmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#3BB800"/>
    <path d="M14.7063 6.5062C14.8869 6.67696 14.9923 6.91247 14.9993 7.16094C15.0064 7.4094 14.9144 7.6505 14.7438 7.8312L9.43126 13.4562C9.34516 13.5472 9.24169 13.62 9.12697 13.6704C9.01225 13.7207 8.88861 13.7475 8.76334 13.7493C8.63807 13.751 8.51373 13.7277 8.39765 13.6805C8.28157 13.6334 8.17611 13.5635 8.08751 13.4749L5.27501 10.6625C5.10941 10.4847 5.01925 10.2497 5.02354 10.0068C5.02782 9.76392 5.12621 9.53219 5.29798 9.36042C5.46975 9.18866 5.70148 9.09027 5.94435 9.08598C6.18723 9.0817 6.42229 9.17185 6.60001 9.33745L8.73126 11.4675L13.3813 6.5437C13.552 6.36307 13.7875 6.25765 14.036 6.25062C14.2845 6.24359 14.5256 6.33552 14.7063 6.5062Z"
          fill="white"/>
</svg>
`

const rowCheckboxIcon = `
<div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
    </svg>
</div>
`

// Variável comum para ids selecionados das checkboxes
let selectedIds = [];

// Altera o estado da checkbox e adiciona/remove o id a lista
function checkboxClicked(event) {
    const checkbox = event.currentTarget;
    const id = parseInt(checkbox.dataset.checkboxId);

    const index = selectedIds.indexOf(id);

    if (index !== -1) {
        selectAllCheckbox.classList.remove("selected");
        selectedIds.splice(index, 1);
    } else {
        selectedIds.push(id);
    }

    checkbox.classList.toggle("selected");
}

// Altera o estado da checkbox de selecionar tudo e adiciona/remove todos os ids da lista
function selectAllHandler() {
    if (selectAllCheckbox.classList.contains("selected")) {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            checkbox.classList.remove("selected");
        });
    } else {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            const id = parseInt(checkbox.dataset.checkboxId);
            selectedIds.push(id);
            checkbox.classList.add("selected");
        });
    }

    selectAllCheckbox.classList.toggle("selected");
}

// Adiciona o evento da checkbox em todas as checkboxes
function addCheckboxesEvents() {
    checkboxes = document.querySelectorAll('.row-checkbox');
    selectAllCheckbox = document.querySelector('.select-all-checkbox');

    checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('click', checkboxClicked);
        checkbox.addEventListener('click', checkboxClicked);
    });

    selectAllCheckbox.removeEventListener('click', selectAllHandler);
    selectAllCheckbox.addEventListener('click', selectAllHandler);
}

// Altera a visibilidade do overlay (aonde vai os modais)
function switchOverlay() {
    if (overlay.classList.contains("hidden")) {
        overlay.classList.remove("fade-out");
        overlay.classList.remove("hidden");
    } else {
        overlay.classList.add("fade-out");
        overlay.addEventListener("animationend", function () {
            overlay.classList.add("hidden");
            overlay.classList.remove("fade-out");
        }, {once: true});
    }
}

// Adiciona o evento de alterar a visibilidade do overlay
function addSwitchOverlayEvent(button) {
    button.addEventListener('click', switchOverlay);
}

// Converte tipo date para formato DD/MM/YYYY
function getDateFormatted(dateISO) {
    const dateParts = dateISO.split('T')[0].split('-');
    return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
}

// Converte formato DD/MM/YYYY para tipo date
function getDateISO(date) {
    const dateParts = date.split('/');
    return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
}

// Recebe um id de result e retorna um fragmento de HTML
function getResultDiv(resultId) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-container');

    switch (resultId) {
        case 1:
            resultContainer.innerHTML = `
            ${errorSmallIcon}
           <p>Desligado</p>
            `;
            break;
        case 2:
            resultContainer.innerHTML = `
            ${warningSmallIcon}
           <p>Ocupado</p>
            `;
            break;
        case 3:
            resultContainer.innerHTML = `
            ${infoSmallIcon}
           <p>Cx. Postal</p>
            `;
            break;
        case 4:
            resultContainer.innerHTML = `
            ${okSmallIcon}
           <p>Atendido</p>
            `;
            break;
    }

    return resultContainer.outerHTML;
}

function getContactText(contactId) {
    switch (contactId) {
        case 1:
            return 'Ligação'
        case 2:
            return 'Whatsapp'
        case 3:
            return 'E-mail'
    }
}

// Adiciona o evento de alterar a aparência do select ao selecionar um dado
function addSelectedDataEvent(select) {
    select.addEventListener('change', switchSelectClass);
}

// Altera a aparência do select ao selecionar um dado
function switchSelectClass(event) {
    if (!event.target) {
        return
    }

    const id = event.target.value;

    if (id !== 0) {
        event.target.classList.remove('unselected');
    } else if (!event.target.classList.contains('unselected')) {
        event.target.classList.add('unselected');
    }
}