const PREFIXOS_ARTISTICO = ["MC", "DJ", "Lil", "Big", "Young", "King", "Queen", "Mr.", "Miss"];
const SUFIXOS_ARTISTICO = ["Fire", "Wave", "Star", "Vibe", "Storm", "Beat", "Flow", "Shine"];
const PREFIXOS_GAMER = ["Shadow", "Dark", "Ghost", "Night", "Silent", "Frost", "Blaze", "Cyber"];
const SUFIXOS_GAMER = ["Wolf", "Hunter", "Killer", "Ninja", "Reaper", "Sniper", "Phantom", "Viper"];

function gerarNomeArtistico() {
    const p = PREFIXOS_ARTISTICO[Math.floor(Math.random() * PREFIXOS_ARTISTICO.length)];
    const s = SUFIXOS_ARTISTICO[Math.floor(Math.random() * SUFIXOS_ARTISTICO.length)];
    return `${p} ${s}`;
}

function gerarNomeGamer() {
    const p = PREFIXOS_GAMER[Math.floor(Math.random() * PREFIXOS_GAMER.length)];
    const s = SUFIXOS_GAMER[Math.floor(Math.random() * SUFIXOS_GAMER.length)];
    const numero = Math.floor(Math.random() * 999);
    return `${p}${s}${numero}`;
}

module.exports = { gerarNomeArtistico, gerarNomeGamer };
