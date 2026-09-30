const CORES_ROLETA = ["🔴 vermelho", "⚫ preto", "🟢 verde"];

function girarRoletaCores() {
    const sorte = Math.random();
    if (sorte < 0.02) return CORES_ROLETA[2];
    return CORES_ROLETA[Math.random() < 0.5 ? 0 : 1];
}

function girarRoletaNumeros() {
    return Math.floor(Math.random() * 37);
}

module.exports = { girarRoletaCores, girarRoletaNumeros };
