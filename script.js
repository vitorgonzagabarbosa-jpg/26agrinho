// Estado Global do Jogo
let saldo = 100;
let valorSafra = 30;
let temUpgradeVelocidade = false;

// Estado interno de cada um dos 4 lotes da fazenda
let campos = [
    { fase: "vazio", progresso: 0 },
    { fase: "vazio", progresso: 0 },
    { fase: "vazio", progresso: 0 },
    { fase: "vazio", progresso: 0 }
];

// Função disparada ao clicar nos botões dos lotes
function processarCliqueLote(index) {
    let lote = campos[index];

    if (lote.fase === "vazio") {
        if (saldo >= 10) {
            saldo -= 10;
            lote.fase = "crescendo";
            lote.progresso = 0;
            enviarLog(`Lote ${index + 1}: Sementes de soja plantadas com sucesso.`);
        } else {
            enviarLog("❌ Saldo insuficiente para investir em sementes!");
        }
    } 
    else if (lote.fase === "colheita") {
        saldo += valorSafra;
        lote.fase = "vazio";
        lote.progresso = 0;
        enviarLog(`🎉 Sucesso! Produção do Lote ${index + 1} vendida por $${valorSafra}.`);
    }
    renderizarMudancas();
}

// Lógica de compra do upgrade tecnológico
function comprarUpgrade() {
    if (saldo >= 150) {
        saldo -= 150;
        temUpgradeVelocidade = true;
        
        let btnUpgrade = document.getElementById("upgrade-bio");
        btnUpgrade.disabled = true;
        btnUpgrade.innerText = "Adquirido ✔️";
        
        enviarLog("🛰️ Tecnologia aplicada! O tempo de cultivo foi reduzido pela metade.");
        renderizarMudancas();
    } else {
        enviarLog("❌ Fundos insuficientes para adquirir maquinário/tecnologia.");
    }
}

// Atualiza o DOM (HTML) com base nas variáveis do JavaScript
function renderizarMudancas() {
    document.getElementById("carteira").innerText = saldo;
    document.getElementById("preco-mercado").innerText = valorSafra;

    campos.forEach((lote, index) => {
        let visorEmoji = document.getElementById(`emoji-${index}`);
        let botaoLote = document.getElementById(`btn-${index}`);

        if (lote.fase === "vazio") {
            visorEmoji.innerText = "🟫";
            botaoLote.innerText = "Plantar ($10)";
            botaoLote.className = "btn-lote";
            botaoLote.disabled = false;
        } 
        else if (lote.fase === "crescendo") {
            visorEmoji.innerText = "🌱";
            botaoLote.innerText = "Cultivando...";
            botaoLote.disabled = true;
        } 
        else if (lote.fase === "colheita") {
            visorEmoji.innerText = "🌾";
            botaoLote.innerText = "Colher!";
            botaoLote.className = "btn-lote btn-colheita";
            botaoLote.disabled = false;
        }
    });
}

// Imprime mensagens no painel inferior de logs
function enviarLog(mensagem) {
    let caixaLogs = document.getElementById("logs");
    caixaLogs.innerHTML = `> ${mensagem}<br>` + caixaLogs.innerHTML;
}

// Game Loop: Executado de forma contínua a cada 1 segundo (1000 milissegundos)
setInterval(() => {
    // Processa o crescimento do plantio ativo
    campos.forEach((lote, index) => {
        if (lote.fase === "crescendo") {
            lote.progresso += temUpgradeVelocidade ? 2 : 1;
            
            if (lote.progresso >= 5) {
                lote.fase = "colheita";
                enviarLog(`🌾 Lote ${index + 1} atingiu o ponto ideal de colheita.`);
            }
        }
    });

    // Oscilação econômica do mercado (15% de chance de mudar a cada ciclo)
    if (Math.random() > 0.85) {
        valorSafra = Math.floor(Math.random() * (50 - 20 + 1)) + 20; // Preço flutua entre $20 e $50
        enviarLog(`📊 Mercado modificado! Valor atual da saca de grãos: $${valorSafra}.`);
    }

    renderizarMudancas();
}, 1000);

// Execução inicial para desenhar a interface no carregamento da página
renderizarMudancas();
