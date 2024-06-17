let userNameInput;
let userEmailInput;
let userPhoneInput;
let oldPasswordInput;
let newPasswordInput;
let confirmPasswordInput;
let errorTextWrapper;
let savePasswordButton;

function setUserDataInputs() {
    userNameInput.value = tokenData.name;
    userEmailInput.value = tokenData.email;
    userPhoneInput.value = getPhoneFormatted(tokenData.phone);
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
}

function getProfileElements() {
    userNameInput = document.querySelector('input[name="user-name"]');
    userEmailInput = document.querySelector('input[name="user-email"]');
    userPhoneInput = document.querySelector('input[name="user-phone"]');
    oldPasswordInput = document.querySelector('input[name="old-password"]');
    newPasswordInput = document.querySelector('input[name="new-password"]');
    confirmPasswordInput = document.querySelector('input[name="confirm-password"]');
    errorTextWrapper = document.querySelector('.error-wrapper');
    savePasswordButton = document.querySelector('.save-password-button');
}

async function handleSavePassword() {
    errorTextWrapper.classList.remove('show');
    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
        errorTextWrapper.textContent = 'Preencha todos os campos.';
        errorTextWrapper.classList.add('show');
        return;
    }

    if (newPassword !== confirmPassword) {
        errorTextWrapper.textContent = 'A nova senha e a confirmação da senha não correspondem.';
        errorTextWrapper.classList.add('show');
        return;
    }

    if (newPassword.trim().length < 8) {
        errorTextWrapper.textContent = 'A senha deve conter mais de 8 caracteres.';
        errorTextWrapper.classList.add('show');
        return;
    }

    try {
        const response = await fetch(`${URL}/user/changepassword`, {
            method: 'POST',
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: tokenData.email,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorToast(errorData.message);
            console.error(errorData.message);
            return;
        }

        const result = await response.json();
        setUserDataInputs();
        showSuccessToast('Senha alterada com sucesso');
    } catch (error) {
        console.error(error);
        showErrorToast('Erro ao salvar a senha.');
    }
}

function profileStartup() {
    getProfileElements();
    setUserDataInputs();
    savePasswordButton.addEventListener('click', handleSavePassword);
}