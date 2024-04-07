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

function addCheckboxEvents(checkboxes) {
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', checkboxClicked);
    });
}

function addSelectAllEvent(selectAllCheckbox, otherCheckboxes) {
    selectAllCheckbox.addEventListener('click', () => {
        if (selectAllCheckbox.classList.contains("selected")) {
            selectedIds = [];
            otherCheckboxes.forEach((checkbox) => {
                checkbox.classList.remove("selected");
            });
        } else {
            selectedIds = [];
            selectedIds.push(...allIds);
            otherCheckboxes.forEach((checkbox) => {
                checkbox.classList.add("selected");
            });
        }

        selectAllCheckbox.classList.toggle("selected");
    });
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