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

let modalToGet;
let fileName;
let tableToInsert;
let lineLength;
let hasImportedData;

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
    hasImportedData = false;
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

    checkPageVariables();
}

function checkPageVariables() {
    switch (currentPage) {
        case 2:
            modalToGet = 'getClientsModel';
            fileName = 'modelo_importacao_clientes.xlsm';
            tableToInsert = 'client';
            lineLength = 10;
            break;
        case 3:
            modalToGet = 'getProposalsModel';
            fileName = 'modelo_importacao_propostas.xlsm';
            tableToInsert = 'proposal';
            lineLength = 6;
            break;
        case 4:
            modalToGet = 'getInteractionsModel';
            fileName = 'modelo_importacao_interacoes.xlsm';
            tableToInsert = 'interaction';
            lineLength = 7;
            break;
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

            if (columns.length === lineLength) {
                importingObjects.push(createImportingObject(columns));
            }
        }

        if (importingObjects.length === 0) {
            resetImportingScreen();
            return;
        }

        selectedFileTotalLines.textContent = importingObjects.length.toString();
        buttonImportModal.classList.remove('disabled');
    };

    reader.readAsText(file, 'ISO-8859-1');
}

// Cria os objetos de importação
function createImportingObject(columns) {
    switch (currentPage) {
        case 2:
            const cleanedCpf = columns[1].trim().replace(/\D/g, '');
            let cpf = null;
            if (cleanedCpf.length === 9) {
                cpf = "0" + "0" + cleanedCpf
            } else if (cleanedCpf.length === 10) {
                cpf = "0" + cleanedCpf
            } else if (cleanedCpf.length === 11) {
                cpf = cleanedCpf
            }

            let cnpj = null;
            const cleanedCnpj = columns[2].trim().replace(/\D/g, '');
            if (cleanedCnpj.length === 13) {
                cnpj = "0" + cleanedCnpj
            } else if (cleanedCnpj.length === 14) {
                cnpj = cleanedCnpj
            }

            return {
                id: null,
                name: columns[0].trim(),
                cpf: cpf,
                cnpj: cnpj,
                email: columns[3].trim(),
                whatsapp: columns[4].trim(),
                cellphone: columns[5].trim(),
                telephone: columns[6].trim(),
                inactive: false,
                address: {
                    id: null,
                    number: columns[7].trim(),
                    street: columns[8].trim(),
                    zip_code: columns[9].trim(),
                    city: {
                        id: 5595
                    }
                }
            }
        case 3:
            let serviceType;
            let status;

            switch (columns[2].trim()) {
                case "Consultoria":
                    serviceType = 1;
                    break;
                case "Acompanhamento":
                    serviceType = 2;
                    break;
                case "Treinamento":
                    serviceType = 3;
                    break;
                default:
                    serviceType = 1;
                    break;
            }

            switch (columns[3].trim()) {
                case "Parado":
                    status = 1;
                    break;
                case "Negociacao":
                    status = 2;
                    break;
                case "Acompanhar":
                    status = 3;
                    break;
                case "Fechado":
                    status = 4;
                    break;
                default:
                    status = 1;
                    break;
            }

            return {
                offerDate: new Date(getDateISO(columns[1].trim())),
                value: parseFloat(columns[4].trim().replace(",", ".")),
                serviceType: serviceType,
                status: status,
                description: columns[5].trim(),
                inactive: false,
                client: {
                    id: parseInt(columns[0].trim())
                }
            }
        case 4:
            let contact;
            let result;

            switch (columns[2].trim()) {
                case "Ligacao":
                    contact = 1;
                    break;
                case "Whatsapp":
                    contact = 2;
                    break;
                case "Email":
                    contact = 3;
                    break;
                default:
                    contact = 1;
                    break;
            }

            switch (columns[3].trim()) {
                case "Desligado":
                    result = 1;
                    break;
                case "Ocupado":
                    result = 2;
                    break;
                case "Cx. Postal":
                    result = 3;
                    break;
                case "Atendido":
                    result = 4;
                    break;
                default:
                    result = 1;
                    break;
            }

            return {
                date: new Date(getDateISO(columns[1].trim())),
                time: convertNumberToHours(columns[4].trim()),
                duration: convertNumberToHours(columns[5].trim()),
                result: result,
                contact: contact,
                description: columns[6].trim(),
                inactive: false,
                proposal: {
                    id: parseInt(columns[0].trim())
                }
            }
    }
}

// Adiciona o evento de alterar a visibilidade do overlay
function addSwitchOverlayImportEvent(button) {
    button.addEventListener('click', switchOverlayImport);
}

function addFinishImportButtonEvent(button) {
    button.addEventListener('click', () => {
        if (hasImportedData) {

            switch (currentPage) {
                case 2:
                    cleanAllClients();
                    getClients().then();
                    break;
                case 3:
                    cleanAllProposals();
                    getProposals().then();
                    break;
                case 4:
                    cleanAllInteractions();
                    getInteractions().then();
                    break;
            }

            switchOverlayImport();
            hasImportedData = false;
        } else {
            switchOverlayImport();
        }
    })
}

// Adiciona o evento de input de arquivo a div
function addGetModelFileEvent(button) {
    button.addEventListener('click', getImportingFile);
}

// Buscar o arquivo modelo xlsx no backend
async function getImportingFile() {
    try {

        if (modalToGet === "") throw new Error('Erro ao obter o arquivo modelo.');

        const response = await fetch(`${URL}/${modalToGet}`, {
            method: 'GET', headers: {
                'Authorization': userToken, 'Content-Type': 'text/html'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao obter o arquivo modelo.');
        }

        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileBlob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
        const blobUrl = window.URL.createObjectURL(fileBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        downloadLink.click();

        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Erro durante a solicitação do arquivo modelo:', error);
        showErrorToast("Não foi possível buscar o arquivo modelo!");
    }
}

// Salva os dados no banco
async function saveData() {
    if (importingObjects.length > 0) {
        try {
            const response = await fetch(`${URL}/${tableToInsert}/bulk`, {
                method: 'POST',
                headers: {
                    'Authorization': userToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(importingObjects)
            });

            if (!response.ok) {
                throw new Error('Erro ao importar os dados.');
            }

            hasImportedData = true;
            successMessage.innerHTML = await response.text();
            cancelCloseModalImport.classList.add("hidden");
            buttonImportModal.classList.add("hidden");
            selectedFileDiv.classList.add("hidden");
            modelFileButton.classList.add("hidden");
            FinishModalImport.classList.remove("hidden");
            importSuccess.classList.remove("hidden");
            showSuccessToast("Dados importados com sucesso!");
        } catch (error) {
            console.error('Erro ao importar os dados:', error);
            showErrorToast("Erro ao importar dados!");
        }
    }
}

// Adiciona os comportamentos aos botões do modal
function setupImportButtons() {
    resetImportingScreen();
    addSwitchOverlayImportEvent(cancelCloseModalImport);
    addFinishImportButtonEvent(buttonCloseModalImport);
    addFinishImportButtonEvent(FinishModalImport);

    buttonImportModal.addEventListener('click', saveData);
    addGetModelFileEvent(modelFileButton);
    addFileInputEvent();
    addFileInputChangeEvent();
}

// Inicia o componente de importação
function importSetup() {
    setModalImportTitle();
}