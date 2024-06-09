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
let isConfigPageOpened = false;
let currentPage = 0;
let canChangePage = true;

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
    const tokenString = localStorage.getItem("token");

    // Verifica se o tokenString não está vazio e se é uma string JSON válida
    if (tokenString && typeof tokenString === 'string') {
        try {
            // Tenta analisar o tokenString como um objeto JSON
            const tokenObject = JSON.parse(tokenString);

            // Verifica se o tokenObject é um objeto
            if (typeof tokenObject === 'object' && tokenObject !== null) {
                // Verifica se o tokenObject contém o campo "token"
                if (tokenObject.token) {
                    const token = tokenObject.token;
                    await fetch(`${URL}/page${page}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'text/html'
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
                            canChangePage = true;
                        });
                } else {
                    // Se o campo "token" estiver ausente no objeto, redireciona para a página de login
                    window.location.href = "/login";
                }
            } else {
                // Se o tokenObject não for um objeto, redireciona para a página de login
                window.location.href = "/login";
            }
        } catch (error) {
            // Se ocorrer um erro ao analisar o JSON, redireciona para a página de login
            console.error("Erro ao analisar o token JSON:", error);
            window.location.href = "/login";
        }
    } else {
        // Se o tokenString estiver vazio ou não for uma string, redireciona para a página de login
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

// Inicialização do frame do site
function frameSetup() {
    expandButton.addEventListener("click", expandButtonClicked);

    menuButtons.forEach(button => {
        button.addEventListener("click", menuButtonClicked);
    })

    setupImportButtons();
    helpSidebarButtonSetup();
}

frameSetup();
if (!showError) {
    menuButtons[2].click();

    // TODO fazer a mensagem só exibir uma vez caso venha do login
    setTimeout(() => {
        showSuccessToast("Seja bem vindo!");
    }, 200)
} else {
    getMainFrameContent('error').then();
}
