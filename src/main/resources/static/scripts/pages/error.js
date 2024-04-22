let buttonReload;
let buttonDashboard;

function reloadPage() {
    location.reload();
}

function redirectDashboard(){
    getMainFrameContent("dashboard");
}

function getDocumentElements(){
    buttonReload = document.querySelector(".reload");
    buttonDashboard = document.querySelector(".dashboard");
}

function addEvents(buttonReload, buttonDashboard, reloadPage, redirectDashboard){
    buttonReload.addEventListener("click", reloadPage);
    buttonDashboard.addEventListener("click", redirectDashboard);
}

function errorStartup() {
    console.log("EXECUTOU ERROR");
    getDocumentElements();
    addEvents(buttonReload, buttonDashboard, reloadPage, redirectDashboard);
}