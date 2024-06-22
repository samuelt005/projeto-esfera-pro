const overlayConfirm = document.querySelector(".overlay-confirm");
const confirmationMessageElement = document.querySelector('.confirm-text');
const confirmationWarningElement = document.querySelector('.confirm-warning');

function showOverlayConfirm() {
    overlayConfirm.classList.remove("fade-out");
    overlayConfirm.classList.remove("hidden");
}

function hideOverlayConfirm() {
    overlayConfirm.classList.add("fade-out");
    overlayConfirm.addEventListener("animationend", function () {
        overlayConfirm.classList.add("hidden");
        overlayConfirm.classList.remove("fade-out");
    }, {once: true});
}

function showConfirmationModal(messageText, warningText) {
    return new Promise((resolve, reject) => {
        showOverlayConfirm();

        if (messageText) {
            confirmationMessageElement.textContent = messageText;
        } else {
            confirmationMessageElement.textContent = "Você tem certeza de que deseja prosseguir com esta ação?";
        }

        if (warningText) {
            confirmationWarningElement.textContent = warningText;
        } else {
            confirmationWarningElement.textContent = "Esta operação não poderá ser desfeita.";
        }

        function handleConfirm() {
            hideOverlayConfirm();
            cleanup();
            resolve(true);
        }

        function handleCancel() {
            hideOverlayConfirm();
            cleanup();
            resolve(false);
        }

        function cleanup() {
            document.querySelector('.confirm-confirmation').removeEventListener('click', handleConfirm);
            document.querySelector('.cancel-confirmation').removeEventListener('click', handleCancel);
            document.querySelector('.close-confirmation').removeEventListener('click', handleCancel);
        }

        document.querySelector('.confirm-confirmation').addEventListener('click', handleConfirm);
        document.querySelector('.cancel-confirmation').addEventListener('click', handleCancel);
        document.querySelector('.close-confirmation').addEventListener('click', handleCancel);
    });
}
