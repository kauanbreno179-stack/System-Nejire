const SUPER_HABILIDADES = ["ler mentes", "controlar o tempo", "falar com animais", "ficar invisível", "teletransporte", "cura instantânea", "super velocidade", "controle de elementos"];
const PODERES_FRAQUEZAS = [
    { poder: "controle do fogo", fraqueza: "água" },
    { poder: "voo", fraqueza: "espaços fechados" },
    { poder: "super força", fraqueza: "kryptonita fictícia" },
    { poder: "telepatia", fraqueza: "ruído alto" },
    { poder: "invisibilidade", fraqueza: "luz ultravioleta" }
];

function sortearSuperHabilidade() {
    return SUPER_HABILIDADES[Math.floor(Math.random() * SUPER_HABILIDADES.length)];
}

function sortearPoderFraqueza() {
    return PODERES_FRAQUEZAS[Math.floor(Math.random() * PODERES_FRAQUEZAS.length)];
}

module.exports = { sortearSuperHabilidade, sortearPoderFraqueza };
