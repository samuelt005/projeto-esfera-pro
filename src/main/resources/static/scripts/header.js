const headerDropdownMenuButton = document.querySelector('.user-profile');
const headerMenu = document.querySelector('.header-menu');
const settingsButton = document.querySelector('.settings-button');
const profileConfigsButton = document.querySelector('.profile-configs');
const emailConfigsButton = document.querySelector('.email-configs');
const teamConfigsButton = document.querySelector('.team-configs');
const logOutButton = document.querySelector('.log-out');
const helpConfigsButton = document.querySelector('.help-configs');

function headerMenuSetup() {
    headerDropdownMenuButton.addEventListener("click", (event) => {
        headerMenu.classList.toggle('hidden');
        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        const isClickedInsideHeader =
            headerDropdownMenuButton.contains(event.target) ||
            headerMenu.contains(event.target);

        if (!isClickedInsideHeader) {
            headerMenu.classList.add('hidden');
        }
    });
}

function openConfigsScreen(page) {
    if (isConfigPageOpened) {
        configsButtons[page].click();
    } else {
        getMainFrameContent('configs').then(() => {
            configsButtons[page].click();
        });
    }
}

function settingsButtonSetup() {
    settingsButton.addEventListener("click", () => {
        openConfigsScreen(0);
    });
}

function profileConfigsButtonSetup() {
    profileConfigsButton.addEventListener("click", () => {
        openConfigsScreen(0);
    });
}

function emailConfigsButtonSetup() {
    emailConfigsButton.addEventListener("click", () => {
        openConfigsScreen(0);
    });
}

function teamConfigsButtonSetup() {
    teamConfigsButton.addEventListener("click", () => {
        openConfigsScreen(1);
    });
}

function logOutButtonSetup() {
    logOutButton.addEventListener("click", () => {
        localStorage.setItem("token", JSON.stringify(null));
        window.location.href = "/login";
    });
}

function helpConfigsButtonSetup() {
    helpConfigsButton.addEventListener("click", () => {
        openConfigsScreen(3);
    });
}

headerMenuSetup();
settingsButtonSetup();
profileConfigsButtonSetup();
emailConfigsButtonSetup();
teamConfigsButtonSetup();
logOutButtonSetup();
helpConfigsButtonSetup();