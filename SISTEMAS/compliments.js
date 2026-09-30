const ELOGIOS_CRIATIVOS = [
    "você tem um jeito de deixar as coisas mais leves só de estar por perto",
    "sua forma de pensar é rara, não perde isso",
    "você inspira mais gente do que imagina",
    "seu esforço não passa despercebido, mesmo quando parece que sim",
    "você é o tipo de pessoa que faz falta quando não está por perto"
];

const ELOGIOS_AMIGO = [
    "que sorte a minha ter um amigo assim",
    "você faz até os dias ruins ficarem mais fáceis",
    "amizade dessas é pra guardar com carinho",
    "obrigado(a) por existir do jeitinho que você é",
    "você é daquelas pessoas que a gente sente falta rapidinho"
];

function elogioCriativo() {
    return ELOGIOS_CRIATIVOS[Math.floor(Math.random() * ELOGIOS_CRIATIVOS.length)];
}

function elogioAmigo() {
    return ELOGIOS_AMIGO[Math.floor(Math.random() * ELOGIOS_AMIGO.length)];
}

module.exports = { elogioCriativo, elogioAmigo };
