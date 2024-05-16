const toggleButtons = document.querySelectorAll('.toggle-btn');
const formContents = document.querySelectorAll('.form-content');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const form = document.querySelector('#login-register');
const buttonLogar = document.querySelector('#logar');
const buttonCadastrar = document.querySelector('#cadastrar');

function login(){
    buttonLogar.addEventListener('click', (event) => {
        event.preventDefault();
        const inputEmail = document.querySelector('#email').value;
        const inputSenha = document.querySelector('#password').value;

        const data = {
            email: inputEmail,
            password: inputSenha
        }

        console.log(data)

        const response = fetch('/user/validation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                console.log(response)
                window.location.href = '/';
            }else{
                alert("Email ou senha incorretos");
                window.location.href = '/login';
            }
        })
    })
}

function cadastrar(){
    buttonCadastrar.addEventListener('click', (event) => {
        event.preventDefault();
        const inputNome = document.querySelector('#nome').value;
        const inputTelefone = document.querySelector('#telefone').value;
        const inputEmail = document.querySelector('#Remail').value;
        const inputSenha = document.querySelector('#Rpassword').value;

        const data = {
            name: inputNome,
            email: inputEmail,
            password: inputSenha,
            phone: inputTelefone
        }

        console.log(data)

        const response = fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                console.log(response)
                window.location.href = '/login';
            }else{
                alert("Erro ao cadastrar");
                window.location.href = '/login';
            }
        })
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
    toggleButtonClick();
    login();
    cadastrar();
}

loginStartup();
