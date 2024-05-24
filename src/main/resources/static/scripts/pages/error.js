let buttonReload;
let buttonDashboard;

function reloadPage() {
    if (currentPage !== -1) {
        menuButtons[currentPage].click();
    } else {
        location.reload();
    }
}

function redirectDashboard(){
    menuButtons[0].click();
    showError = false;
}

function getDocumentElements(){
    buttonReload = document.querySelector(".reload");
    buttonDashboard = document.querySelector(".dashboard");

    if(showError) {
        buttonReload.classList.add('hidden');
    }
}

function addEvents(buttonReload, buttonDashboard, reloadPage, redirectDashboard){
    buttonReload.addEventListener("click", reloadPage);
    buttonDashboard.addEventListener("click", redirectDashboard);
}

function errorStartup() {
    getDocumentElements();
    menuButtons.forEach(button => {
        button.classList.add("inactive");
        button.classList.remove("active");
    });
    addEvents(buttonReload, buttonDashboard, reloadPage, redirectDashboard);
}