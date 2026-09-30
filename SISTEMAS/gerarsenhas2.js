const PALAVRAS_SENHA = ["nuvem", "onda", "raiz", "farol", "brisa", "vulcao", "cristal", "trilha", "girassol", "neblina", "coral", "estrela", "cometa", "bosque", "orvalho"];

function gerarSenhaMemoravel() {
    const p1 = PALAVRAS_SENHA[Math.floor(Math.random() * PALAVRAS_SENHA.length)];
    const p2 = PALAVRAS_SENHA[Math.floor(Math.random() * PALAVRAS_SENHA.length)];
    const numero = Math.floor(Math.random() * 90) + 10;
    const simbolos = ["!", "#", "$", "%", "&", "*"];
    const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
    return `${p1[0].toUpperCase()}${p1.slice(1)}${p2}${numero}${simbolo}`;
}

function gerarPin(digitos = 4) {
    const n = Math.min(Math.max(parseInt(digitos) || 4, 3), 12);
    let pin = "";
    for (let i = 0; i < n; i++) pin += Math.floor(Math.random() * 10);
    return pin;
}

module.exports = { gerarSenhaMemoravel, gerarPin };
