const VALORES_ROMANOS = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
];

function paraRomano(numero) {
    let n = parseInt(numero);
    if (!Number.isFinite(n) || n <= 0 || n > 3999) return null;
    let resultado = "";
    for (const [valor, simbolo] of VALORES_ROMANOS) {
        while (n >= valor) { resultado += simbolo; n -= valor; }
    }
    return resultado;
}

const MAPA_ROMANO = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function deRomano(texto = "") {
    const romano = String(texto).trim().toUpperCase();
    if (!/^[IVXLCDM]+$/.test(romano)) return null;
    let total = 0;
    for (let i = 0; i < romano.length; i++) {
        const atual = MAPA_ROMANO[romano[i]];
        const proximo = MAPA_ROMANO[romano[i + 1]];
        if (proximo && atual < proximo) total -= atual; else total += atual;
    }
    if (paraRomano(total) !== romano) return null;
    return total;
}

module.exports = { paraRomano, deRomano };
