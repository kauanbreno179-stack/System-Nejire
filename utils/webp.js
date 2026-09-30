//fg
function uint24(buf, off) {
    return buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16);
}

function limparFundoEntreQuadros(webp) {
    if (!Buffer.isBuffer(webp) || webp.length < 30) return webp;
    if (webp.toString("ascii", 0, 4) !== "RIFF" || webp.toString("ascii", 8, 12) !== "WEBP") return webp;

    const buf = Buffer.from(webp);
    let off = 12;
    let canvasW = 0, canvasH = 0;
    const quadros = [];

    while (off + 8 <= buf.length) {
        const id = buf.toString("ascii", off, off + 4);
        const tam = buf.readUInt32LE(off + 4);

        if (id === "VP8X") {
            canvasW = uint24(buf, off + 8 + 4) + 1;
            canvasH = uint24(buf, off + 8 + 7) + 1;
        } else if (id === "ANMF") {
            const larg = uint24(buf, off + 8 + 6) + 1;
            const alt = uint24(buf, off + 8 + 9) + 1;
            quadros.push({ flagsPos: off + 8 + 15, cheio: larg === canvasW && alt === canvasH });
        }

        off += 8 + tam + (tam & 1);
    }

    if (!quadros.length || !canvasW || !quadros.every(q => q.cheio)) return webp;

    for (const q of quadros) buf[q.flagsPos] |= 0x01;
    return buf;
}

module.exports = { limparFundoEntreQuadros };
