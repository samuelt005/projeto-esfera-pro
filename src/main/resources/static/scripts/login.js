// Elementos da página
const toggleButtons = document.querySelectorAll('.toggle-btn');
const formContents = document.querySelectorAll('.form-content');
const logInButton = document.querySelector('#log-in-button');
const singUpButton = document.querySelector('#sing-up-button');

const errorLabels = document.querySelectorAll('.error');

const logInEmail = document.querySelector('#log-in-email');
const logInPassword = document.querySelector('#log-in-password');

const singUpName = document.querySelector('#sing-up-name');
const singUpPhone = document.querySelector('#sing-up-phone');
const singUpEmail = document.querySelector('#sing-up-email');
const singUpPassword = document.querySelector('#sing-up-password');
const singUpCode = document.querySelector('#sing-up-code');

// Variáveis de login
let singUpData = {
    name: '', email: '', password: '', phone: '', team: ''
};
let loginData = {
    email: '', password: ''
};

// Esconde todos os labels de erro
function cleanInvalidClasses() {
    errorLabels.forEach(label => label.classList.remove('invalid'));
}

// Adiciona máscara nos inputs
function maskInputs() {
    const cellphoneMask = {
        mask: '00 00000-0000'
    }
    IMask(singUpPhone, cellphoneMask);
}

// Valida o form de login
function validateFormLogin() {
    let isFormValid = true;
    cleanInvalidClasses();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (logInEmail.value.trim() !== "") {
        if (emailRegex.test(logInEmail.value.trim())) {
            loginData.email = logInEmail.value.trim();
        } else {
            loginData.email = "";
            errorLabels[0].classList.add('invalid');
            isFormValid = false;
        }
    } else {
        loginData.email = "";
        errorLabels[0].classList.add('invalid');
        isFormValid = false;
    }

    if (logInPassword.value.trim().length >= 8) {
        loginData.password = logInPassword.value.trim();
    } else {
        loginData.password = "";
        errorLabels[1].classList.add('invalid');
        isFormValid = false;
    }

    return isFormValid;
}

// Valida o form de signup
function validateFormSingUp() {
    let isFormValid = true;
    cleanInvalidClasses();


    if (singUpName.value.trim() !== "") {
        singUpData.name = singUpName.value.trim();
    } else {
        errorLabels[2].classList.add('invalid');
        isFormValid = false;
    }

    const unmaskedWhatsapp = singUpPhone.value.replace(/\D+/g, '');
    if (unmaskedWhatsapp.length === 11) {
        singUpData.phone = unmaskedWhatsapp;
    } else {
        errorLabels[3].classList.add('invalid');
        isFormValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = singUpEmail.value.trim();
    if (emailValue !== "") {
        if (emailRegex.test(emailValue)) {
            singUpData.email = emailValue;
        } else {
            errorLabels[4].classList.add('invalid');
            isFormValid = false;
        }
    } else {
        errorLabels[4].classList.add('invalid');
        isFormValid = false;
    }

    if (singUpPassword.value.trim().length >= 8) {
        singUpData.password = singUpPassword.value.trim();
    } else {
        errorLabels[5].classList.add('invalid');
        isFormValid = false;
    }

    if (singUpCode.value.trim() !== "") {
        singUpData.team = singUpCode.value.trim();
    } else {
        errorLabels[6].classList.add('invalid');
        isFormValid = false;
    }

    return isFormValid;
}

// Limpa os campos do sing-up
function resetSignUpForm() {
    singUpName.value = '';
    singUpPhone.value = '';
    singUpEmail.value = '';
    singUpPassword.value = '';
    singUpCode.value = '';
}

// Adiciona o evento de login ao botão
function addLoginEvent() {
    logInButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateFormLogin()) {
            fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => {
                        throw new Error(error.message || "Erro ao realizar login");
                    });
                }
            }).then(responseJSON => {
                localStorage.setItem('welcomeMessageShown', 'false');
                localStorage.setItem("token", JSON.stringify(responseJSON));
                window.location.href = '/';
            }).catch(error => {
                showErrorToast(error.message);
                console.error(error);
                localStorage.setItem("token", JSON.stringify(null));
            });
        } else {
            if (loginData.email === "" || loginData.password === "") {
                showErrorToast("Por favor preencha o e-mail e a senha");
            } else {
                showErrorToast("Erro na validação do login");
            }
        }
    });
}

// Adiciona o evento de sing-up ao botão
function addSingUpEvent() {
    singUpButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateFormSingUp()) {
            fetch('/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(singUpData)
            }).then(response => {
                if (response.ok) {
                    showSuccessToast("Usuário cadastrado com sucesso!");
                    toggleButtons[0].click();
                    resetSignUpForm();
                } else {
                    return response.json().then(responseJSON => {
                        throw new Error(responseJSON.message);
                    });
                }
            }).catch(error => {
                console.error(error.message)
                showErrorToast('Não foi possível efetuar o cadastro!');
            });
        } else {
            localStorage.setItem("token", JSON.stringify(null));
        }
    });
}

// Adiciona o evento de alterar o menu
function toggleMenuButtonClick() {
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const target = button.getAttribute('data-target');
            formContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
            toggleButtons.forEach(btn => {
                if (btn === button) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    });
}

// Inicialização da página de login
function loginStartup() {
    localStorage.setItem("token", JSON.stringify(null));
    maskInputs();
    toggleMenuButtonClick();
    addLoginEvent();
    addSingUpEvent();
}

loginStartup();