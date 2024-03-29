// FUNCTIONS
const URL = "http://localhost:8080";
const mainContent = document.querySelector(".main-content");
const allStyles = document.getElementById("allStyles");
const sidebar = document.querySelector(".sidebar");
const expandButton = document.querySelector(".expand-menu");
const menuButtons = document.querySelectorAll(".sidebar-button");
const loading = document.querySelector(".loading");

function loadSelectedPageScript(page) {
    switch (page) {
        case 'dashboard':
            dashboardStartup();
            break;

        case 'calendario':
            calendarioStartup();
            break;

        case 'clientes':
            clientesStartup();
            break;

        case 'propostas':
            propostasStartup();
            break;

        case 'interacoes':
            interacoesStartup();
            break;
    }

    loading.classList.add("hidden");
    mainContent.classList.remove("hidden");
}

function getMainFrameContent(page) {
    fetch(`${URL}/page${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao recuperar tela: ${page}`);
            }
            return response.text();
        })
        .then(data => {
            const tempElement = document.createElement("div");
            tempElement.innerHTML = data;

            const contentDiv = tempElement.querySelector('content');
            const stylesDiv = tempElement.querySelector('styles');

            if (contentDiv) {
                mainContent.innerHTML = contentDiv.innerHTML;
                loadSelectedPageScript(page);
            }

            if (stylesDiv) {
                allStyles.innerHTML = stylesDiv.innerHTML;
            }
        })
        .catch(error => {
            console.error(error);
            loading.classList.add("hidden");
            mainContent.classList.add("hidden");
        });
}

function expandButtonClicked() {
    if (sidebar.classList.contains("expanded")) {
        sidebar.classList.remove("expanded");
    } else {
        sidebar.classList.add("expanded");
    }
}

function menuButtonClicked(event) {
    const button = event.currentTarget;
    const page = button.getAttribute("page");

    if (button.classList.contains("active")) {
        return;
    }

    mainContent.classList.add("hidden");
    loading.classList.remove("hidden");

    menuButtons.forEach(button => {
        button.classList.add("inactive");
        button.classList.remove("active");
    });

    button.classList.remove("inactive");
    button.classList.add("active");

    getMainFrameContent(page);
}

function frameSetup() {
    expandButton.addEventListener("click", expandButtonClicked);

    menuButtons.forEach(button => {
        button.addEventListener("click", menuButtonClicked);
    })
}

frameSetup();