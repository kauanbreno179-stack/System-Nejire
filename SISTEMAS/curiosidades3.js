const CURIOSIDADES_CIENCIA = [
    "o corpo humano tem cerca de 37 trilhões de células",
    "a luz do sol demora cerca de 8 minutos pra chegar até a Terra",
    "os tubarões existem há mais tempo que as árvores",
    "o DNA humano é 60% igual ao de uma banana",
    "existe um tipo de água-viva que é biologicamente imortal"
];

const CURIOSIDADES_TECH = [
    "o primeiro mouse de computador era feito de madeira",
    "o termo 'bug' em programação vem de um inseto de verdade encontrado num computador antigo",
    "a Nokia 3310 é famosa até hoje pela bateria absurda de durar dias",
    "o primeiro e-mail da história foi enviado em 1971",
    "o Wi-Fi não significa 'wireless fidelity', é só um nome comercial"
];

function curiosidadeCiencia() {
    return CURIOSIDADES_CIENCIA[Math.floor(Math.random() * CURIOSIDADES_CIENCIA.length)];
}

function curiosidadeTecnologia() {
    return CURIOSIDADES_TECH[Math.floor(Math.random() * CURIOSIDADES_TECH.length)];
}

module.exports = { curiosidadeCiencia, curiosidadeTecnologia };
