function rolarDados(qtd, lados) {
    const q = Math.min(Math.max(parseInt(qtd) || 1, 1), 20);
    const l = Math.min(Math.max(parseInt(lados) || 6, 2), 100);
    const rolagens = [];
    let total = 0;
    for (let i = 0; i < q; i++) {
        const r = Math.floor(Math.random() * l) + 1;
        rolagens.push(r);
        total += r;
    }
    return { rolagens, total };
}

function rolarD20() {
    return Math.floor(Math.random() * 20) + 1;
}

module.exports = { rolarDados, rolarD20 };
