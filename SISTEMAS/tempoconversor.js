function diasParaSegundos(d) {
    const n = parseFloat(d);
    if (!Number.isFinite(n)) return null;
    return n * 86400;
}

function segundosParaDias(s) {
    const n = parseFloat(s);
    if (!Number.isFinite(n)) return null;
    return n / 86400;
}

module.exports = { diasParaSegundos, segundosParaDias };
