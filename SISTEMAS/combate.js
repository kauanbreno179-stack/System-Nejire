function simularBatalha(nome1 = "Jogador 1", nome2 = "Jogador 2") {
    const forca1 = Math.floor(Math.random() * 100) + 1;
    const forca2 = Math.floor(Math.random() * 100) + 1;
    const vencedor = forca1 >= forca2 ? nome1 : nome2;
    return { forca1, forca2, vencedor };
}

function calcularDano(ataque, defesa) {
    const a = parseFloat(ataque), d = parseFloat(defesa);
    if (!Number.isFinite(a) || !Number.isFinite(d)) return null;
    return Math.max(1, Math.round(a - d * 0.5));
}

module.exports = { simularBatalha, calcularDano };
