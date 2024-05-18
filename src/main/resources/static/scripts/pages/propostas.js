document.addEventListener('DOMContentLoaded', function () {
    propostasStartup();  // Chama a função que inicializa a página de propostas.
    anexarEventosDeOrdenacaoTabela();  // Configura os eventos de ordenação para as colunas da tabela.
    anexarManipuladoresDeEventosModal();  // Configura os manipuladores de eventos para os botões do modal.
});

// Inicializa a funcionalidade da página de propostas.
function propostasStartup() {
    console.log("EXECUTOU PROPOSTAS");
    getElementosProposta(); // Captura e loga elementos do DOM específicos da página de propostas.
}

// Captura elementos do DOM relacionados à proposta e loga o botão de adicionar novo.
function getElementosProposta() {
    console.log('Obtendo Elementos do Documento');
    const botaoAdicionarNovo = document.querySelector('.button-add-new'); // Botão para adicionar uma nova proposta
    console.log(botaoAdicionarNovo);
    // Os seletores abaixo capturam os elementos do formulário e botões do modal.
    const botaoFecharModal = document.querySelector('.close-modal-button'); // Botão para fechar o modal
    const botaoCancelarModal = document.querySelector('.cancel-modal-button'); // Botão para cancelar o modal
    const botaoSalvarModal = document.querySelector('.save-modal-button'); // Botão para salvar a proposta
    const selectNomeCliente = document.querySelector('select[name="client-name"]'); // Dropdown para o nome do cliente
    const selectTipoSolucao = document.querySelector('select[name="solution-type"]'); // Dropdown para o tipo de solução
    const inputDataConclusao = document.querySelector('input[name="completion-date"]'); // Input para a data de conclusão
    const selectStatusProposta = document.querySelector('select[name="proposal-status"]'); // Dropdown para o status da proposta
    const inputValores = document.querySelector('input[name="values"]'); // Input para os valores
    const inputAnexarArquivo = document.querySelector('input[name="attachment"]'); // Input para anexar arquivo
    const textareaDescricaoProposta = document.querySelector('textarea[name="proposal-description"]'); // Área de texto para a descrição da proposta

    // Adiciona evento de clique para abrir o modal
    if (botaoAdicionarNovo) {
        botaoAdicionarNovo.addEventListener('click', () => alternarVisibilidadeModal(true));
    }
}

// Configura eventos de clique para colunas ordenáveis da tabela.
function anexarEventosDeOrdenacaoTabela() {
    const cabecalhosOrdenaveis = document.querySelectorAll('.sortable'); // Seleciona todos os cabeçalhos de tabela ordenáveis
    cabecalhosOrdenaveis.forEach((cabecalho, indice) => {
        cabecalho.addEventListener('click', () => {
            sortTable(indice + 1);  // Chama a função de ordenar a tabela baseada na coluna clicada.
        });
    });
}

// Ordena a tabela de propostas com base na coluna especificada.
function sortTable(coluna) {
    var tabela, linhas, trocando, i, x, y, deveTrocar, direcao, contagemTroca = 0;
    tabela = document.querySelector(".table"); // Seleciona a tabela
    trocando = true;
    direcao = "asc"; // Direção inicial de ordenação
    while (trocando) {
        trocando = false;
        linhas = tabela.getElementsByTagName("TR"); // Obtém todas as linhas da tabela
        for (i = 1; i < (linhas.length - 1); i++) {
            deveTrocar = false;
            x = linhas[i].getElementsByTagName("TD")[coluna]; // Célula da linha atual
            y = linhas[i + 1].getElementsByTagName("TD")[coluna]; // Célula da próxima linha
            // Compara as duas linhas com base na direção atual de ordenação
            if (direcao === "asc" ? x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() : x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                deveTrocar = true;
                break;
            }
        }
        if (deveTrocar) {
            linhas[i].parentNode.insertBefore(linhas[i + 1], linhas[i]); // Troca as linhas
            trocando = true;
            contagemTroca++;
        } else if (contagemTroca === 0 && direcao === "asc") {
            direcao = "desc"; // Se nenhuma troca foi feita, muda a direção e repete
            trocando = true;
        }
    }
    atualizarSetas(coluna, direcao); // Atualiza a seta de direção no cabeçalho
}

// Atualiza as setas indicativas de direção da ordenação nas colunas.
function atualizarSetas(coluna, direcao) {
    document.querySelectorAll(".sort-arrow").forEach(seta => {
        seta.style.display = "none";  // Oculta todas as setas primeiro.
    });
    var seta = document.querySelectorAll(".sortable")[coluna - 1].querySelector(".sort-arrow");
    seta.style.display = "inline";  // Exibe a seta na coluna ordenada.
    seta.innerHTML = direcao === "asc" ? "&#9650;" : "&#9660;"; // Atualiza a direção da seta
}

// Configura os manipuladores de eventos para os botões no modal de propostas.
function anexarManipuladoresDeEventosModal() {
    const botaoFecharModal = document.querySelector('.close-modal-button'); // Botão para fechar o modal
    const botaoCancelarModal = document.querySelector('.cancel-modal-button'); // Botão para cancelar o modal
    const botaoSalvarModal = document.querySelector('.save-modal-button'); // Botão para salvar a proposta

    if (botaoFecharModal) botaoFecharModal.addEventListener('click', () => alternarVisibilidadeModal(false)); // Fecha o modal ao clicar
    if (botaoCancelarModal) botaoCancelarModal.addEventListener('click', () => alternarVisibilidadeModal(false)); // Cancela e fecha o modal ao clicar
    if (botaoSalvarModal) botaoSalvarModal.addEventListener('click', () => salvarProposta()); // Salva a proposta ao clicar
}

// Alterna a visibilidade do modal de propostas.
function alternarVisibilidadeModal(visivel) {
    const modal = document.querySelector('.modal-container');
    if (modal) modal.style.display = visivel ? 'block' : 'none'; // Mostra ou oculta o modal com base no parâmetro 'visivel'
}

// Salva a proposta coletando dados dos inputs e possivelmente enviando para um servidor.
function salvarProposta() {
    console.log("Salvando proposta...");
    // Implementação futura para coletar dados de entrada e enviar para o servidor.
}
