function gerarNumerosUnicos(qtd, min, max) {
    const numeros = new Set();
    while (numeros.size < qtd) numeros.add(Math.floor(Math.random() * (max - min + 1)) + min);
    return [...numeros].sort((a, b) => a - b);
}

function gerarJogoMegaSena() {
    return gerarNumerosUnicos(6, 1, 60);
}

function gerarJogoLotofacil() {
    return gerarNumerosUnicos(15, 1, 25);
}

module.exports = { gerarJogoMegaSena, gerarJogoLotofacil };
