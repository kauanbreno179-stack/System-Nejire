function sortearNumeroEntre(min, max) {
    const a = parseInt(min), b = parseInt(max);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a >= b) return null;
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function sortearVariosNumeros(qtd, min, max) {
    const q = Math.min(Math.max(parseInt(qtd) || 1, 1), 20);
    const a = parseInt(min), b = parseInt(max);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a >= b) return null;
    const numeros = [];
    for (let i = 0; i < q; i++) numeros.push(Math.floor(Math.random() * (b - a + 1)) + a);
    return numeros;
}

module.exports = { sortearNumeroEntre, sortearVariosNumeros };
