const importModalTitle = document.querySelector(".import-modal-title");
const buttonCloseModalImport = document.querySelector(".close-modal-import-button");
const cancelCloseModalImport = document.querySelector(".cancel-modal-import-button");
const buttonImportModal = document.querySelector(".import-modal-button");
const FinishModalImport = document.querySelector(".finish-button");
const fileInputDiv = document.querySelector(".no-file-wrapper");
const selectedFileDiv = document.querySelector(".selected-file");
const importSuccess = document.querySelector(".import-success");
const selectedFileName = document.querySelector(".file-name");
const selectedFileTotalLines = document.querySelector(".text-total-lines");
const modelFileButton = document.querySelector(".model-file-container");
const successMessage = document.querySelector(".success-message");

let importingObjects = [];

// Define o título do modal baseado na página atual
function setModalImportTitle() {
    switch (currentPage) {
        case 2:
            importModalTitle.textContent = 'Importar clientes';
            break;
        case 3:
            importModalTitle.textContent = 'Importar propostas';
            break;
        case 4:
            importModalTitle.textContent = 'Importar interações';
            break;
        default:
            importModalTitle.textContent = 'Importar';
            break;
    }
}

// Reinicia os dados da página de importação
function resetImportingScreen() {
    buttonImportModal.classList.add('disabled');
    document.getElementById('csvFileInput').value = "";

    fileInputDiv.classList.remove('hidden');
    modelFileButton.classList.remove('hidden');
    cancelCloseModalImport.classList.remove("hidden");
    buttonImportModal.classList.remove("hidden");
    selectedFileDiv.classList.add("hidden");
    importSuccess.classList.add('hidden');
    FinishModalImport.classList.add('hidden');

    importingObjects = [];
    selectedFileName.textContent = "";
}

// Altera a visibilidade do overlay de importação
function switchOverlayImport() {
    if (overlayImport.classList.contains("hidden")) {
        overlayImport.classList.remove("fade-out");
        overlayImport.classList.remove("hidden");
        importSetup();
    } else {
        overlayImport.classList.add("fade-out");
        overlayImport.addEventListener("animationend", function () {
            overlayImport.classList.add("hidden");
            overlayImport.classList.remove("fade-out");
            resetImportingScreen();
        }, {once: true});
    }
}

// Adiciona o evento de input a div de no-file-wrapper
function addFileInputEvent() {
    fileInputDiv.addEventListener('click', function () {
        document.getElementById('csvFileInput').click();
    });
}

// Adiciona o evento de mudança ao input de arquivo
function addFileInputChangeEvent() {
    const fileInput = document.getElementById('csvFileInput');
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            readCSVFile(selectedFile);

            fileInputDiv.classList.add('hidden');
            selectedFileDiv.classList.remove("hidden");

            selectedFileName.textContent = selectedFile.name;

            console.log('Arquivo selecionado:', selectedFile);
        }
    });
}

// Ler conteúdo do arquivo CSV
function readCSVFile(file) {
    importingObjects = [];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const columns = line.split(';');

            console.log(columns.length)

            if (columns.length === 11) {
                const obj = {};

                importingObjects.push(createImportingObject(columns));
            }
        }

        if (importingObjects.length === 0) {
            resetImportingScreen();
            return;
        }

        selectedFileTotalLines.textContent = importingObjects.length.toString();
        buttonImportModal.classList.remove('disabled');
        console.log(importingObjects);
    };

    reader.readAsText(file);
}

function createImportingObject(columns) {
    switch (currentPage) {
        case 2:
            return {
                id: null,
                name: columns[0].trim(),
                cpf: columns[1].trim(),
                company: columns[2].trim(),
                cnpj: columns[3].trim(),
                email: columns[4].trim(),
                whatsapp: columns[5].trim(),
                cellphone: columns[6].trim(),
                telephone: columns[7].trim(),
                inactive: false,
                address: {
                    id: null,
                    number: columns[8].trim(),
                    street: columns[9].trim(),
                    zip_code: columns[10].trim(),
                    city: {
                        id: 5610
                    }
                }
            }
        case 3:
            return {}
        case 4:
            return {}
    }
}

// Adiciona o evento de alterar a visibilidade do overlay
function addSwitchOverlayImportEvent(button) {
    button.addEventListener('click', switchOverlayImport);
}

function addGetModelFileEvent(button) {
    button.addEventListener('click', getImportingFile);
}

async function getImportingFile() {
    try {
        const response = await fetch(`${URL}/getClientsModel`);
        if (!response.ok) {
            throw new Error('Erro ao obter o arquivo modelo.');
        }
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileBlob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
        const blobUrl = window.URL.createObjectURL(fileBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'modelo_importacao_clientes.xlsm';
        downloadLink.click();

        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Erro durante a solicitação do arquivo modelo:', error);
        showErrorToast("Não foi possível buscar o arquivo modelo!");
    }
}

async function importData() {
    if (importingObjects.length > 0) {
        console.log("Dados a serem importados:", importingObjects);
        try {
            const response = await fetch(`${URL}/client/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(importingObjects)
            });

            if (!response.ok) {
                throw new Error('Erro ao importar os dados.');
            }

            successMessage.innerHTML = await response.text();
            cancelCloseModalImport.classList.add("hidden");
            buttonImportModal.classList.add("hidden");
            selectedFileDiv.classList.add("hidden");
            modelFileButton.classList.add("hidden");
            FinishModalImport.classList.remove("hidden");
            importSuccess.classList.remove("hidden");
        } catch (error) {
            console.error('Erro ao importar os dados:', error);
            showErrorToast("Erro ao importar dados!");
        }
    } else {
        console.log("Não há dados para importar.");
    }
}


function setupImportButtons() {
    resetImportingScreen();
    addSwitchOverlayImportEvent(buttonCloseModalImport);
    addSwitchOverlayImportEvent(cancelCloseModalImport);
    addSwitchOverlayImportEvent(FinishModalImport);
    buttonImportModal.addEventListener('click', importData);
    addGetModelFileEvent(modelFileButton);
    addFileInputEvent();
    addFileInputChangeEvent();
}

function importSetup() {
    setModalImportTitle();
}