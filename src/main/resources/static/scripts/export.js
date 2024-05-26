let selectedIds = [];
let isSelectAllActive = false;

// Altera o estado da checkbox e adiciona/remove o id a lista
function checkboxClicked(event) {
    const checkbox = event.currentTarget;
    const id = parseInt(checkbox.dataset.checkboxId);

    const index = selectedIds.indexOf(id);

    if (index !== -1) {
        selectAllCheckbox.classList.remove("selected");
        selectedIds.splice(index, 1);
        isSelectAllActive = false;
    } else {
        selectedIds.push(id);
    }

    checkbox.classList.toggle("selected");
}

// Altera o estado da checkbox de selecionar tudo e adiciona/remove todos os ids da lista
function selectAllHandler() {
    if (selectAllCheckbox.classList.contains("selected")) {
        selectedIds = [];
        isSelectAllActive = false;
        checkboxes.forEach((checkbox) => {
            checkbox.classList.remove("selected");
        });
    } else {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            const id = parseInt(checkbox.dataset.checkboxId);
            selectedIds.push(id);
            isSelectAllActive = true;
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

// Adiciona o evento de exportar ao botão de cada tela
function addExportEvent(button) {
    selectedIds = [];

    button.addEventListener('click', () => {
        if (isSelectAllActive) {
            console.log('export all');

        } else {
            selectedIds.sort((a, b) => b - a);
            console.log(selectedIds);

        }
    });
}