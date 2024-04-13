let selectedIds = [];

function extractId(stringId) {
    const parts = stringId.split('-');
    return parseInt(parts[1]);
}

function checkboxClicked(event) {
    const checkbox = event.currentTarget;
    const stringId = checkbox.getAttribute("id");
    const id = extractId(stringId);

    const index = selectedIds.indexOf(id);

    if (index !== -1) {
        selectedIds.splice(index, 1);
    } else {
        selectedIds.push(id);
    }

    checkbox.classList.toggle("selected");
}

function selectAllHandler() {
    if (selectAllCheckbox.classList.contains("selected")) {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            checkbox.classList.remove("selected");
        });
    } else {
        selectedIds = [];
        checkboxes.forEach((checkbox) => {
            const id = checkbox.id.split('-')[1];
            selectedIds.push(parseInt(id));
            checkbox.classList.add("selected");
        });
    }

    selectAllCheckbox.classList.toggle("selected");
}


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

function addSwitchOverlayEvent(button) {
    button.addEventListener('click', switchOverlay);
}