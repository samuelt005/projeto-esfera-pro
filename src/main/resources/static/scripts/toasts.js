function showToast(message, backgroundColor) {
    Toastify({
        text: message,
        duration: 3000,
        close: false,
        gravity: "top",
        position: "right",
        style: {
            borderRadius: "10px",
            background: backgroundColor,
        }
    }).showToast();
}

function showErrorToast(message) {
    showToast(message, "#FF0000");
}

function showWarningToast(message) {
    showToast(message, "#FF9900");
}

function showInfoToast(message) {
    showToast(message, "#000aff");
}

function showSuccessToast(message) {
    showToast(message, "#3BB800");
}