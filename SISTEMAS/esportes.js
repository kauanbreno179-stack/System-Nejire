const ESPORTES = ["futebol", "vôlei", "basquete", "natação", "tênis", "skate", "surfe", "handebol", "atletismo", "judô", "ciclismo", "escalada"];
const TIMES_FICTICIOS = ["Furacões Azuis", "Dragões de Ferro", "Águias Douradas", "Tubarões Negros", "Lobos da Serra", "Tempestade Vermelha"];

function sortearEsporte() {
    return ESPORTES[Math.floor(Math.random() * ESPORTES.length)];
}

function sortearTimeFicticio() {
    return TIMES_FICTICIOS[Math.floor(Math.random() * TIMES_FICTICIOS.length)];
}

module.exports = { sortearEsporte, sortearTimeFicticio };
