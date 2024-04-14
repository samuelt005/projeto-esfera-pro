// Este arquivo possui funções padrões que podem ser utilizadas em qualquer tabela

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