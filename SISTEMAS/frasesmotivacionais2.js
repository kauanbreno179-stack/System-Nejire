const FRASES_HOJE = [
    "hoje é um ótimo dia pra recomeçar algo",
    "um passo pequeno hoje ainda é um passo à frente",
    "não desista de coisas boas só porque estão sendo difíceis agora",
    "você é mais capaz do que imagina",
    "respira, organiza, e vai com calma — vai dar certo"
];

const FRASES_ESTUDOS = [
    "estudar um pouco todo dia vale mais que estudar tudo de uma vez",
    "erro também é aprendizado, não trava por causa dele",
    "faça pausas, seu cérebro também precisa descansar",
    "revisar é tão importante quanto aprender pela primeira vez",
    "constância vence intensidade quando o assunto é estudo"
];

function fraseParaHoje() {
    return FRASES_HOJE[Math.floor(Math.random() * FRASES_HOJE.length)];
}

function fraseParaEstudos() {
    return FRASES_ESTUDOS[Math.floor(Math.random() * FRASES_ESTUDOS.length)];
}

module.exports = { fraseParaHoje, fraseParaEstudos };
