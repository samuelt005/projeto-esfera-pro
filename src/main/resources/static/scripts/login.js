document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const formContents = document.querySelectorAll('.form-content');
    const buttonLogar = document.querySelector('#logar');
    const buttonCadastrar = document.querySelector('#cadastrar');

    const labels = document.querySelectorAll('.error');

    const inputEmail = document.querySelector('#email');
    const inputSenha = document.querySelector('#password');

    const inputNome = document.querySelector('#nome');
    const inputTelefone = document.querySelector('#telefone');
    const RinputEmail = document.querySelector('#Remail');
    const RinputSenha = document.querySelector('#Rpassword');

    let data = {
        name: '', email: '', password: '', phone: ''
    };

    let dataLogin = {
        email: '', password: ''
    };

    function cleanInvalidClasses() {
        labels[0].classList.remove('invalid');
        labels[1].classList.remove('invalid');
        labels[2].classList.remove('invalid');
        labels[3].classList.remove('invalid');
        labels[4].classList.remove('invalid');
        labels[5].classList.remove('invalid');
    }

    function maskInputs() {
        const cellphoneMask = {
            mask: '00 00000-0000'
        }
        IMask(inputTelefone, cellphoneMask);
    }

    function validateFormLogin() {
        let isFormValid = true;
        cleanInvalidClasses();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (inputEmail.value.trim() !== "") {
            if (emailRegex.test(inputEmail.value.trim())) {
                dataLogin.email = inputEmail.value.trim();
            } else {
                labels[0].classList.add('invalid');
                isFormValid = false;
            }
        } else {
            labels[0].classList.add('invalid');
            isFormValid = false;
        }

        if (inputSenha.value.trim().length >= 8) {
            dataLogin.password = inputSenha.value.trim();
        } else {
            labels[1].classList.add('invalid');
            isFormValid = false;
        }

        return isFormValid;
    }

    function validateFormRegister() {
        let isFormValid = true;
        cleanInvalidClasses();


        if (inputNome.value.trim() !== "") {
            data.name = inputNome.value.trim();
        } else {
            labels[2].classList.add('invalid');
            isFormValid = false;
        }

        const unmaskedWhatsapp = inputTelefone.value.replace(/\D+/g, '');
        if (unmaskedWhatsapp.length === 11) {
            data.phone = unmaskedWhatsapp;
        } else {
            labels[3].classList.add('invalid');
            isFormValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = RinputEmail.value.trim();
        if (emailValue !== "") {
            if (emailRegex.test(emailValue)) {
                data.email = emailValue;
            } else {
                labels[4].classList.add('invalid');
                isFormValid = false;
            }
        } else {
            labels[4].classList.add('invalid');
            isFormValid = false;
        }

        if (RinputSenha.value.trim().length >= 8) {
            data.password = RinputSenha.value.trim();
        } else {
            labels[5].classList.add('invalid');
            isFormValid = false;
        }

        return isFormValid;
    }

    function login() {
        buttonLogar.addEventListener('click', (event) => {
            event.preventDefault();
            if (validateFormLogin()) {
                fetch('/user/validation', {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify(dataLogin)
                }).then(response => {
                    if (response.ok) {
                        localStorage.setItem("isLogged", JSON.stringify(true));
                        window.location.href = '/';
                    } else {
                        localStorage.setItem("isLogged", JSON.stringify(false));
                        showErrorToast("Erro ao realizar login");
                    }
                }).catch((error) => {
                    showErrorToast("Erro ao realizar login");
                    console.error(error)
                    localStorage.setItem("isLogged", JSON.stringify(false));
                });
            } else {
                console.error("Erro na validação do login");
                localStorage.setItem("isLogged", JSON.stringify(false));
            }
        });
    }

    function cadastrar() {
        buttonCadastrar.addEventListener('click', (event) => {
            event.preventDefault();
            if (validateFormRegister()) {
                fetch('/user/register', {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify(data)
                }).then(response => {
                    if (response.ok) {
                        showSuccessToast("Usuário cadastrado com sucesso! Você será redirecionado para a página de login.");
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 3000);
                    } else {
                        return response.json();
                    }
                }).then(responseJSON => {
                    showErrorToast(responseJSON.message);
                });
            } else {
                localStorage.setItem("isLogged", JSON.stringify(false));
            }
        });
    }

    function toggleButtonClick() {
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

    function loginStartup() {
        localStorage.setItem("isLogged", JSON.stringify(false));
        maskInputs();
        toggleButtonClick();
        login();
        cadastrar();
    }

    loginStartup();
});
