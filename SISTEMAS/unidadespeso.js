function oncasParaGramas(oz) {
    const n = parseFloat(oz);
    if (!Number.isFinite(n)) return null;
    return n * 28.3495;
}

function gramasParaOncas(g) {
    const n = parseFloat(g);
    if (!Number.isFinite(n)) return null;
    return n / 28.3495;
}

module.exports = { oncasParaGramas, gramasParaOncas };
