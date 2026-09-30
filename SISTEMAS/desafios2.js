const DESAFIOS_24H = [
    "não reclamar de nada por 24 horas",
    "elogiar 3 pessoas diferentes hoje",
    "beber 2 litros de água hoje",
    "ficar 1 hora sem celular",
    "mandar uma mensagem pra alguém que você não fala há tempos",
    "arrumar um cômodo da casa hoje",
    "aprender uma palavra nova em outro idioma"
];

const MISSOES_DIARIAS = [
    "responda 5 mensagens no grupo hoje",
    "use um comando novo que você nunca usou antes",
    "compartilhe uma curiosidade com alguém",
    "ajude alguém do grupo com uma dúvida",
    "poste uma figurinha engraçada no grupo"
];

function sortearDesafio24h() {
    return DESAFIOS_24H[Math.floor(Math.random() * DESAFIOS_24H.length)];
}

function sortearMissaoDiaria() {
    return MISSOES_DIARIAS[Math.floor(Math.random() * MISSOES_DIARIAS.length)];
}

module.exports = { sortearDesafio24h, sortearMissaoDiaria };
