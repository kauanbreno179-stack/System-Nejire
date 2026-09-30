const NAIPES = ["♠️", "♥️", "♦️", "♣️"];
const VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function gerarBaralho() {
    const baralho = [];
    for (const naipe of NAIPES) for (const valor of VALORES) baralho.push(`${valor}${naipe}`);
    return baralho;
}

function sortearCarta() {
    const baralho = gerarBaralho();
    return baralho[Math.floor(Math.random() * baralho.length)];
}

function sortearMao(qtd = 5) {
    const n = Math.min(Math.max(parseInt(qtd) || 5, 1), 10);
    const baralho = gerarBaralho();
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
    return baralho.slice(0, n);
}

module.exports = { sortearCarta, sortearMao };
