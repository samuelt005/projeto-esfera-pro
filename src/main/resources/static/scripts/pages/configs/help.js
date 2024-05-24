let dropdownsFaq;

function handleDropdownHelpButtonClicked(event) {
    const dropdownHeader = event.currentTarget;
    const button = dropdownHeader.parentNode;

    if (button.classList.contains('expanded')) {
        button.classList.remove('expanded');
    } else {
        dropdownsFaq.forEach(dropdown => {
            dropdown.classList.remove('expanded');
        });

        button.classList.add('expanded');
    }
}

function setupFaqButtons() {
    dropdownsFaq.forEach(button => {
        const dropdownHeader = button.querySelector('.dropdown-header');
        dropdownHeader.addEventListener("click", handleDropdownHelpButtonClicked);
    })
}

function getHelpElements() {
    dropdownsFaq = document.querySelectorAll(".dropdown1");
}

function helpPageStartup() {
    getHelpElements();
    setupFaqButtons();
}