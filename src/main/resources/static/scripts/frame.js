// Elementos comuns da página
const mainContent = document.querySelector(".main-content");
const overlay = document.querySelector(".overlay");
const overlayImport = document.querySelector(".overlay-import");
const allStyles = document.getElementById("styles");
const sidebar = document.querySelector(".sidebar");
const expandButton = document.querySelector(".expand-menu");
const menuButtons = document.querySelectorAll(".sidebar-button");
const helpSidebarButton = document.querySelector(".need-help");
const loading = document.querySelector(".loading");
const userNameHeader = document.querySelector(".user-name");
const userTeamHeader = document.querySelector(".user-team");
let isConfigPageOpened = false;
let currentPage = 0;
let canChangePage = true;
let userToken = null;
let tokenData = null;

// Carrega o script específico de cada página ao selecionar um item do menu
function loadSelectedPageScript(page) {
    isSelectAllActive = false;
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
    try {
        await fetch(`${URL}/page${page}`, {
            method: 'GET', headers: {
                'Authorization': userToken, 'Content-Type': 'text/html'
            }
        })
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
                window.location.href = "/login";
                canChangePage = true;
            });
    } catch (error) {
        console.error(error);
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
    const button = event.currentTarget;
    const page = button.getAttribute("page");
    const disabled = button.getAttribute('data-disabled');

    if (disabled || !canChangePage) return;

    canChangePage = false;
    isConfigPageOpened = false;
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

// Inicialização da variável global
function initializeToken() {
    const tokenString = localStorage.getItem("token");

    if (tokenString && typeof tokenString === 'string') {
        try {
            const tokenObject = JSON.parse(tokenString);
            if (typeof tokenObject === 'object' && tokenObject !== null && tokenObject.token) {
                userToken = tokenObject.token;
            } else {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Erro ao analisar o token JSON:", error);
            window.location.href = "/login";
        }
    } else {
        window.location.href = "/login";
    }
}

// Decodificar o token
function decodeToken() {
    try {
        const payload = userToken.split('.')[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const binaryPayload = Uint8Array.from(decodedPayload, c => c.charCodeAt(0));
        const decodedPayloadText = new TextDecoder('utf-8').decode(binaryPayload);

        tokenData = JSON.parse(decodedPayloadText);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        window.location.href = "/login";
    }
}


// Definir o nome e time a partir do token decodificado
function setUserDetails() {
    if (tokenData) {
        const userName = tokenData.name;
        const userTeam = tokenData.team;

        if (userNameHeader && userTeamHeader) {
            userNameHeader.textContent = userName;
            userNameHeader.title = userName;
            userTeamHeader.textContent = userTeam;
            userTeamHeader.title = userTeam;
        }
    }
}

// Inicialização do frame do site
function frameSetup() {
    expandButton.addEventListener("click", expandButtonClicked);

    menuButtons.forEach(button => {
        button.addEventListener("click", menuButtonClicked);
    })

    initializeToken();
    decodeToken();
    setUserDetails();
    setupImportButtons();
    helpSidebarButtonSetup();
}

frameSetup();
if (!showError) {
    // TODO adicionar click no dashboard

    if (localStorage.getItem('welcomeMessageShown') === 'false') {
        setTimeout(() => {
            showSuccessToast("Seja bem vindo " + tokenData.name + "!");

            localStorage.setItem('welcomeMessageShown', 'true');
        }, 200);
    }
} else {
    getMainFrameContent('error').then();
}
