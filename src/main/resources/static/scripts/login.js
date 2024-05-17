const toggleButtons = document.querySelectorAll('.toggle-btn');
const formContents = document.querySelectorAll('.form-content');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const form = document.querySelector('#login-register');
const buttonLogar = document.querySelector('#logar');
const buttonCadastrar = document.querySelector('#cadastrar');

const inputEmail = document.querySelector('#email').value;
const inputSenha = document.querySelector('#password').value;

const inputNome = document.querySelector('#nome').value;
const inputTelefone = document.querySelector('#telefone').value;
const RinputEmail = document.querySelector('#Remail').value;
const RinputSenha = document.querySelector('#Rpassword').value;

let data = {
    name: inputNome,
    email: RinputEmail,
    password: RinputSenha,
    phone: inputTelefone
}

let dataLogin = {
    email: inputEmail,
    password: inputSenha
}

function cleanInvalidClasses() {
    inputEmail.classList.remove('invalid');
    inputSenha.classList.remove('invalid');
    inputNome.classList.remove('invalid');
    inputTelefone.classList.remove('invalid');
    RinputEmail.classList.remove('invalid');
    RinputEmail.classList.remove('invalid');
}

function maskInputs(){
    const inputTelefone = document.querySelector('#telefone').value;
    // TODO adicionar mais tipos de telefones compat�veis (internacionais?)
    const cellphoneMask = {
        mask: '00 00000-0000'
    }
    IMask(inputTelefone, cellphoneMask);
}

function validateFormLogin() {
    let isFormValid = true;

    cleanInvalidClasses();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Express�o regular para validar o e-mail
    if (inputEmail.value.trim() !== "") {
        if (emailRegex.test(inputEmail.value.trim())) {
            dataLogin.email = inputEmail.value.trim();
        } else {
            inputEmail.classList.add('invalid');
            isFormValid = false;
        }
    }

    const password = RinputSenha.value;
    if (password.length >= 8){
        dataLogin.password = password;
    } else {
        RinputSenha.classList.add('invalid');
        isFormValid = false;
    }

    return isFormValid;
}

function validateFormRegister(){
    let isFormValid = true;

    cleanInvalidClasses();

    if (inputNome.value.trim() !== "") {
        data.name = inputNome.value;
    } else {
        data.name = null;
        inputNome.classList.add('invalid');
        isFormValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Express�o regular para validar o e-mail
    if (RinputEmail.value.trim() !== "") {
        if (emailRegex.test(RinputEmail.value.trim())) {
            data.email = RinputEmail.value.trim();
        } else {
            RinputEmail.classList.add('invalid');
            isFormValid = false;
        }
    }

    const unmaskedWhatsapp = inputTelefone.value.replace(/\D+/g, '');
    if (unmaskedWhatsapp.length === 11 || unmaskedWhatsapp.length === 0) {
        data.phone = unmaskedWhatsapp;
    } else {
        inputTelefone.classList.add('invalid');
        isFormValid = false;
    }

    const password = RinputSenha.value;
    if (password.length >= 8){
        data.password = password;
    } else {
      RinputSenha.classList.add('invalid');
      isFormValid = false;
    }

    return isFormValid;
}

function login(){
    buttonLogar.addEventListener('click', () => {
        console.log(validateFormLogin())
        if(validateFormLogin()){
            const response = fetch('/user/validation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    console.log(response);
                    localStorage.setItem("logado", true);
                    window.location.href = '/';
                }else{
                    window.location.href = '/login';
                    localStorage.setItem("logado", false);
                }
            })
        } else {
            console.log("ERRO!");
            localStorage.setItem("logado", false);
        }
    })
}

function cadastrar(){
    buttonCadastrar.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateFormRegister()){
            const response = fetch('/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    console.log(response)
                    alert("CADASTRADO COM SUCESSO! REALIZE O LOGIN.")
                    window.location.href = '/login';
                }else{
                    window.location.href = '/login';
                }
            })
        } else {
            console.log("ERRO!");
            localStorage.setItem("logado", false);
        }

    })

}

function toggleButtonClick(){
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
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

function loginStartup(){
    console.log("Login");
    localStorage.setItem("logado", false);
    maskInputs()
    toggleButtonClick();
    login();
    cadastrar();
}

loginStartup();
