function ehQuadradoPerfeito(n) {
    const num = parseInt(n);
    if (!Number.isFinite(num) || num < 0) return null;
    const raiz = Math.sqrt(num);
    return Number.isInteger(raiz);
}

function ehPalindromoNumerico(n) {
    const str = String(parseInt(n));
    if (str === "NaN") return null;
    return str === str.split("").reverse().join("");
}

module.exports = { ehQuadradoPerfeito, ehPalindromoNumerico };
