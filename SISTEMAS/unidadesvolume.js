function litrosParaGaloes(l) {
    const n = parseFloat(l);
    if (!Number.isFinite(n)) return null;
    return n * 0.264172;
}

function galoesParaLitros(g) {
    const n = parseFloat(g);
    if (!Number.isFinite(n)) return null;
    return n / 0.264172;
}

module.exports = { litrosParaGaloes, galoesParaLitros };
