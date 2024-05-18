const importModalTitle = document.querySelector(".import-modal-title");
const buttonCloseModalImport = document.querySelector(".close-modal-import-button");
const cancelCloseModalImport = document.querySelector(".cancel-modal-import-button");
const fileInputDiv = document.querySelector(".no-file-wrapper");
const selectedFileDiv = document.querySelector(".selected-file");
const selectedFileName = document.querySelector(".file-name");
const selectedFileTotalLines = document.querySelector(".text-total-lines");
const modelButton = document.querySelector(".model-container");
const buttonImportModal = document.querySelector(".import-modal-button");

let importingObjects = [];

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
    document.getElementById('csvFileInput').value = "";

    fileInputDiv.classList.remove('hidden');
    selectedFileDiv.classList.add("hidden");

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

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const columns = line.split(';');

            if (columns.length === 4) {
                const obj = {};

                importingObjects.push(createImportingObject(columns));
            }
        }

        selectedFileTotalLines.textContent = importingObjects.length.toString();
        console.log(importingObjects);
    };

    reader.readAsText(file);
}

function createImportingObject(columns) {
    switch (currentPage) {
        case 2:
            return {
                id: null,
                name: columns[1].trim(),
                cpf: columns[2].trim(),
                cnpj: columns[3].trim(),
                company: columns[4].trim(),
                email: columns[5].trim(),
                whatsapp: columns[6].trim(),
                cellphone: columns[7].trim(),
                telephone: columns[8].trim(),
                inactive: false,
                address: {
                    id: null,
                    street: columns[9].trim(),
                    zip_code: columns[10].trim(),
                    number: columns[11].trim(),
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
    }
}

function setupImportButtons() {
    addSwitchOverlayImportEvent(buttonCloseModalImport);
    addSwitchOverlayImportEvent(cancelCloseModalImport);
    addGetModelFileEvent(modelButton);
    addFileInputEvent();
    addFileInputChangeEvent();
}

function importSetup() {
    console.log('page: ' + currentPage);
    setModalImportTitle();
}