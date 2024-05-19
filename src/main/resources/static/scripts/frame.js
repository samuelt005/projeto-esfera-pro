// Elementos comuns da página
const mainContent = document.querySelector(".main-content");
const overlay = document.querySelector(".overlay");
const header = document.querySelector(".main")
const allStyles = document.getElementById("styles");
const sidebar = document.querySelector(".sidebar");
const expandButton = document.querySelector(".expand-menu");
const menuButtons = document.querySelectorAll(".sidebar-button");
const helpSidebarButton = document.querySelector(".need-help");
const loading = document.querySelector(".loading");
let isConfigPageOpened = false;
let currentPage = 0;
let canChangePage = true;

// Carrega o script específico de cada página ao selecionar um item do menu
function loadSelectedPageScript(page) {
    let timeout = 1000;

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
            interactionStartup();
            break;

        case 'configs':
            configsStartup();
            break;

        case 'error':
            timeout = 200;
            errorStartup();
            break;
    }

    setTimeout(() => {
        loading.classList.add("hidden");
        mainContent.classList.remove("hidden");
        canChangePage = true;
    }, timeout);
}

// Busca o HTML da página selecionada no menu lateral
async function getMainFrameContent(page) {
    if (logado === 'true') {
    await fetch(`${URL}/page${page}`)
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
                const modalDiv = tempElement.querySelector('modal');
                const stylesDiv = tempElement.querySelector('styles');


                if (modalDiv) {
                    overlay.innerHTML = modalDiv.innerHTML;
                }

                if (stylesDiv) {
                    allStyles.innerHTML = stylesDiv.innerHTML;
                }

                if (contentDiv) {
                    mainContent.innerHTML = contentDiv.innerHTML;
                }

                loadSelectedPageScript(page);
            })
            .catch(error => {
                console.error(error);
                loading.classList.add("hidden");
                mainContent.classList.add("hidden");
                canChangePage = true;
            });
    }else{
        window.location.href = "/login";
    }
}

// Expande o menu lateral
function expandButtonClicked() {
    if (sidebar.classList.contains("expanded")) {
        sidebar.classList.remove("expanded");
    } else {
        sidebar.classList.add("expanded");
    }
}

// Modifica os botões laterais ao clicar em um deles
function menuButtonClicked(event) {
    if (!canChangePage) return;

    canChangePage = false;
    isConfigPageOpened = false;
    const button = event.currentTarget;
    const page = button.getAttribute("page");
    currentPage = Array.from(menuButtons).findIndex((btn) => btn.getAttribute("page") === page);

    showError = false;

    if (button.classList.contains("active")) return;

    mainContent.classList.add("hidden");
    loading.classList.remove("hidden");

    menuButtons.forEach(button => {
        button.classList.add("inactive");
        button.classList.remove("active");
    });

    button.classList.remove("inactive");
    button.classList.add("active");

    getMainFrameContent(page).then();
}

// Definição do evento quando clica no botão de ajuda
function helpSidebarButtonSetup() {
    helpSidebarButton.addEventListener("click", () => {
        if (isConfigPageOpened) {
            configsButtons[3].click();
        } else {
            getMainFrameContent('configs').then(() => {
                configsButtons[3].click();
            });
        }
    });
}

// Inicialização do frame do site
function frameSetup() {
    expandButton.addEventListener("click", expandButtonClicked);

    menuButtons.forEach(button => {
        button.addEventListener("click", menuButtonClicked);
    })

    helpSidebarButtonSetup();
}

frameSetup();
if (!showError) { // TODO temporary setup to test
    menuButtons[0].click();
} else {
    getMainFrameContent('error').then();
}
