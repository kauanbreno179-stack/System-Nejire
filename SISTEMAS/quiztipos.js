const VERDADES_DESAFIOS = [
    { tipo: "verdade", texto: "qual foi a mentira mais boba que você já contou?" },
    { tipo: "verdade", texto: "qual é a coisa mais estranha que você já comeu?" },
    { tipo: "desafio", texto: "manda um áudio cantando por 10 segundos" },
    { tipo: "desafio", texto: "manda uma foto aleatória da sua galeria" },
    { tipo: "verdade", texto: "qual foi seu maior vacilo em público?" },
    { tipo: "desafio", texto: "fica 5 minutos sem usar emoji no grupo" },
    { tipo: "verdade", texto: "quem é a última pessoa que você stalkeou nas redes?" },
    { tipo: "desafio", texto: "manda um elogio pra próxima pessoa que mandar mensagem" }
];

const WOULD_YOU_RATHER = [
    "ter que gritar tudo que você fala ou sussurrar tudo que você fala?",
    "perder todo seu dinheiro ou todas as suas fotos?",
    "viver sem música ou sem filmes/séries?",
    "poder voar mas devagar ou ser invisível mas só por 10 minutos por dia?",
    "nunca mais comer doce ou nunca mais comer salgado?",
    "ter que dançar toda vez que ouvir seu nome ou cantar toda vez que espirrar?"
];

function sortearVerdadeOuDesafio() {
    return VERDADES_DESAFIOS[Math.floor(Math.random() * VERDADES_DESAFIOS.length)];
}

function sortearVoceprefere() {
    return WOULD_YOU_RATHER[Math.floor(Math.random() * WOULD_YOU_RATHER.length)];
}

module.exports = { sortearVerdadeOuDesafio, sortearVoceprefere };
