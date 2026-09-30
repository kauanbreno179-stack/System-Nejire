const GENEROS_FILME = ["terror", "comédia", "ação", "romance", "ficção científica", "drama", "suspense", "animação", "documentário", "fantasia"];
const SUGESTOES_FILME = [
    "um clássico dos anos 90 que você provavelmente já esqueceu",
    "aquele filme que todo mundo recomenda mas você nunca assistiu",
    "uma comédia leve pra descontrair",
    "um suspense que vai te prender do início ao fim",
    "uma animação que serve pra qualquer idade",
    "um documentário sobre algo que você nunca imaginou ser interessante"
];

function sortearGeneroFilme() {
    return GENEROS_FILME[Math.floor(Math.random() * GENEROS_FILME.length)];
}

function sortearFilmeParaAssistir() {
    return SUGESTOES_FILME[Math.floor(Math.random() * SUGESTOES_FILME.length)];
}

module.exports = { sortearGeneroFilme, sortearFilmeParaAssistir };
