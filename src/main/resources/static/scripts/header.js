const headerDropdownMenuButton = document.querySelector('.user-profile');
const dropdownMenu = document.querySelector('.header-menu');

function headerDropdownMenuClicked() {
    dropdownMenu.classList.toggle('hidden');
}

function headerMenuSetup() {
    headerDropdownMenuButton.addEventListener("click", headerDropdownMenuClicked);
}

headerMenuSetup();