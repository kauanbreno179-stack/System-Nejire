const CITACOES_MOTIVACIONAIS = [
    "o único jeito de fazer um excelente trabalho é amar o que você faz",
    "não espere por uma oportunidade perfeita, faça a oportunidade perfeita",
    "grandes coisas nunca vêm da zona de conforto",
    "acredite que você pode e você já está no meio do caminho",
    "o sucesso é a soma de pequenos esforços repetidos dia após dia"
];

const CITACOES_ENGRACADAS = [
    "eu não sou preguiçoso, estou economizando energia",
    "a dieta começa amanhã, hoje é sexta",
    "meu superpoder é procrastinar coisas urgentes",
    "café: porque adultar sem ele é golpe baixo",
    "sou multitarefa: posso ficar entediado de várias formas ao mesmo tempo"
];

function citacaoMotivacional() {
    return CITACOES_MOTIVACIONAIS[Math.floor(Math.random() * CITACOES_MOTIVACIONAIS.length)];
}

function citacaoEngracada() {
    return CITACOES_ENGRACADAS[Math.floor(Math.random() * CITACOES_ENGRACADAS.length)];
}

module.exports = { citacaoMotivacional, citacaoEngracada };
