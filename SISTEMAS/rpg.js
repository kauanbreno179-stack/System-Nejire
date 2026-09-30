const CLASSES_RPG = ["Guerreiro", "Mago", "Arqueiro", "Ladino", "Clérigo", "Bárbaro", "Paladino", "Necromante", "Druida", "Monge"];
const ARMAS_RPG = ["Espada Flamejante", "Cajado Ancestral", "Arco Élfico", "Adaga Sombria", "Machado de Guerra", "Lança Celestial", "Martelo Rúnico", "Foice das Almas"];

function sortearClasseRPG() {
    return CLASSES_RPG[Math.floor(Math.random() * CLASSES_RPG.length)];
}

function sortearArmaRPG() {
    return ARMAS_RPG[Math.floor(Math.random() * ARMAS_RPG.length)];
}

module.exports = { sortearClasseRPG, sortearArmaRPG };
