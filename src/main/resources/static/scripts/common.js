// Este arquivo possui funções padrões que podem ser utilizadas em qualquer tabela

// Ícones em formato HTML para uso comum
const errorSmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.199951" width="20" height="20" rx="10" fill="#FF0000"/>
    <path d="M15.2 6.81875L13.3812 5L10.2 8.18125L7.0187 5L5.19995 6.81875L8.3812 10L5.19995 13.1812L7.0187 15L10.2 11.8187L13.3812 15L15.2 13.1812L12.0187 10L15.2 6.81875Z"
          fill="white"/>
</svg>
`

const warning1SmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#FF9900"/>
    <path d="M10 16.5C11.7239 16.5 13.3772 15.8152 14.5962 14.5962C15.8152 13.3772 16.5 11.7239 16.5 10C16.5 8.27609 15.8152 6.62279 14.5962 5.40381C13.3772 4.18482 11.7239 3.5 10 3.5C8.27609 3.5 6.62279 4.18482 5.40381 5.40381C4.18482 6.62279 3.5 8.27609 3.5 10C3.5 11.7239 4.18482 13.3772 5.40381 14.5962C6.62279 15.8152 8.27609 16.5 10 16.5ZM14.5 8.5V11.5H5.5V8.5H14.5Z"
          fill="white"/>
</svg>
`

const warning2SmallIcon = `
<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_253_1558)">
        <rect x="0.199951" width="20" height="20" rx="10" fill="#FF9900"/>
        <path d="M11.02 4.16083C11.0198 3.97981 11.0786 3.80365 11.1874 3.659C11.2962 3.51434 11.4492 3.40906 11.6232 3.35907C11.7972 3.30908 11.9827 3.3171 12.1517 3.38191C12.3207 3.44673 12.4641 3.56482 12.56 3.71833L14.8 5.95833C14.8774 6.03576 14.9387 6.12766 14.9806 6.2288C15.0224 6.32994 15.044 6.43833 15.0439 6.54779C15.0439 6.65725 15.0223 6.76563 14.9804 6.86674C14.9384 6.96785 14.877 7.05971 14.7996 7.13708C14.7222 7.21445 14.6303 7.27581 14.5291 7.31767C14.428 7.35952 14.3196 7.38104 14.2101 7.381C14.1007 7.38096 13.9923 7.35936 13.8912 7.31744C13.7901 7.27552 13.6982 7.21409 13.6208 7.13666L12.6875 6.2025V12.4942C12.6875 12.7152 12.5997 12.9271 12.4434 13.0834C12.2871 13.2397 12.0752 13.3275 11.8542 13.3275C11.6332 13.3275 11.4212 13.2397 11.2649 13.0834C11.1086 12.9271 11.0208 12.7152 11.0208 12.4942L11.02 4.16083ZM9.38 15.8392C9.38018 16.0202 9.32141 16.1963 9.21258 16.341C9.10375 16.4857 8.95078 16.5909 8.7768 16.6409C8.60282 16.6909 8.41729 16.6829 8.24827 16.6181C8.07925 16.5533 7.93594 16.4352 7.84 16.2817L5.6 14.0417C5.44374 13.8853 5.356 13.6733 5.35608 13.4522C5.35616 13.2311 5.44405 13.0192 5.60041 12.8629C5.75678 12.7067 5.96882 12.6189 6.18988 12.619C6.41093 12.6191 6.62291 12.707 6.77916 12.8633L7.7125 13.7975V7.50583C7.7125 7.28482 7.80029 7.07286 7.95658 6.91658C8.11286 6.76029 8.32482 6.6725 8.54583 6.6725C8.76685 6.6725 8.97881 6.76029 9.13509 6.91658C9.29137 7.07286 9.37916 7.28482 9.37916 7.50583L9.38 15.8392Z"
              fill="white"/>
    </g>
    <defs>
        <clipPath id="clip0_253_1558">
            <rect x="0.199951" width="20" height="20" rx="10" fill="white"/>
        </clipPath>
    </defs>
</svg>
`

const info1SmallIcon = `
<svg width="20" height="20" class="small-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#000AFF"/>
    <path d="M10 3.75C6.55 3.75 3.75 6.55 3.75 10C3.75 13.45 6.55 16.25 10 16.25C13.45 16.25 16.25 13.45 16.25 10C16.25 6.55 13.45 3.75 10 3.75ZM5 10C5 7.2375 7.2375 5 10 5C11.1562 5 12.2188 5.39375 13.0625 6.05625L6.05625 13.0625C5.36985 12.1895 4.99774 11.1106 5 10ZM10 15C8.84375 15 7.78125 14.6062 6.9375 13.9437L13.9437 6.9375C14.6301 7.81054 15.0023 8.88944 15 10C15 12.7625 12.7625 15 10 15Z"
          fill="white"/>
</svg>
`

const info2SmallIcon = `
<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.199951" width="20" height="20" rx="10" fill="#000AFF"/>
    <path d="M10.2 3.75C6.76245 3.75 3.94995 6.5625 3.94995 10C3.94995 13.4375 6.76245 16.25 10.2 16.25C13.6375 16.25 16.45 13.4375 16.45 10C16.45 6.5625 13.6375 3.75 10.2 3.75ZM12.4187 12.375L9.8687 10.8063C9.6812 10.6937 9.5687 10.4937 9.5687 10.275V7.34375C9.57495 7.0875 9.78745 6.875 10.0437 6.875C10.3 6.875 10.5125 7.0875 10.5125 7.34375V10.125L12.9125 11.5688C13.1375 11.7063 13.2125 12 13.075 12.225C12.9375 12.4438 12.6437 12.5125 12.4187 12.375Z"
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

// Recebe um double e converte para o formato de reais
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
            ${warning1SmallIcon}
           <p>Ocupado</p>
            `;
            break;
        case 3:
            resultContainer.innerHTML = `
            ${info1SmallIcon}
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

// Converte o id de contact em texto
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


// Recebe um id de result e retorna um fragmento de HTML
function getStatusDiv(resultId) {
    const serviceTypeContainer = document.createElement('div');
    serviceTypeContainer.classList.add('service-type-container');

    switch (resultId) {
        case 1:
            serviceTypeContainer.innerHTML = `
            ${errorSmallIcon}
           <p>Parado</p>
            `;
            break;
        case 2:
            serviceTypeContainer.innerHTML = `
            ${warning2SmallIcon}
           <p>Negociação</p>
            `;
            break;
        case 3:
            serviceTypeContainer.innerHTML = `
            ${info2SmallIcon}
           <p>Acompanhar</p>
            `;
            break;
        case 4:
            serviceTypeContainer.innerHTML = `
            ${okSmallIcon}
           <p>Fechado</p>
            `;
            break;
    }

    return serviceTypeContainer.outerHTML;
}

// Converte o id de service em texto
function getServiceTypeText(contactId) {
    switch (contactId) {
        case 1:
            return 'Consultoria'
        case 2:
            return 'Acompanhamento'
        case 3:
            return 'Treinamento'
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

// Busca todos os clientes
async function getAllClients(clientSelect) {
    await fetch(`${URL}/client`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar clientes`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach((data) => {
                const newOption = document.createElement('option');
                newOption.value = data.id;
                newOption.textContent = data.id + ' - ' + data.name;
                newOption.classList.add('contact-option');

                clientSelect.appendChild(newOption);
            })
            clientSelect.disabled = false;
        })
        .catch(error => {
            console.error(error);
        });
}