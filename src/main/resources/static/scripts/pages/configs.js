let configsButtons;
let helpPage;
let profilePage;
let teamPage;
let goalsPage;

function showConfigPage(page) {
    helpPage.classList.add('hidden');
    profilePage.classList.add('hidden');
    teamPage.classList.add('hidden');
    goalsPage.classList.add('hidden');

    switch (page) {
        case 'profile':
            profilePage.classList.remove('hidden');
            profileStartup();
            break;
        case 'team':
            teamPage.classList.remove('hidden');
            teamStartup();
            break;
        case 'goals':
            goalsPage.classList.remove('hidden');
            break;
        case 'help':
            helpPage.classList.remove('hidden');
            helpPageStartup();
            break;
    }
}

function changeSelectedButton(button) {
    configsButtons.forEach(button => {
        button.classList.remove('selected');
    })
    button.classList.add('selected');
}

function handleMenuButtonClicked(event) {
    const button = event.currentTarget;

    if (button.classList.contains('disabled')) return;

    const page = button.getAttribute('data-page');
    changeSelectedButton(button);
    showConfigPage(page);
}

function setupConfigHeaderButtons() {
    configsButtons.forEach(button => {
        button.addEventListener("click", handleMenuButtonClicked);
    })
}

function getConfigElements() {
    configsButtons = document.querySelectorAll(".header-option");
    helpPage = document.querySelector(".help-page");
    profilePage = document.querySelector(".profile-page");
    teamPage = document.querySelector(".team-page");
    goalsPage = document.querySelector(".goals-page");
}

function configsStartup() {
    getConfigElements();
    setupConfigHeaderButtons();

    isConfigPageOpened = true;

    menuButtons.forEach(button => {
        button.classList.add("inactive");
        button.classList.remove("active");
    });
}