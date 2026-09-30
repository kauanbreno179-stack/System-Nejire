function somarDigitos(numero) {
    let n = Math.abs(parseInt(numero));
    while (n > 9 && n !== 11 && n !== 22) {
        n = String(n).split("").reduce((acc, d) => acc + parseInt(d), 0);
    }
    return n;
}

function calcularNumeroDestino(dataNasc) {
    const numeros = String(dataNasc).replace(/[^0-9]/g, "");
    if (!numeros) return null;
    let soma = numeros.split("").reduce((acc, d) => acc + parseInt(d), 0);
    return somarDigitos(soma);
}

function calcularAnjoNumero(numero) {
    const n = parseInt(numero);
    if (!Number.isFinite(n)) return null;
    const repetido = String(Math.abs(n) % 1000 || 111).padStart(3, String(Math.floor(Math.random() * 9) + 1));
    return `${repetido[0]}${repetido[0]}${repetido[0]}`;
}

module.exports = { calcularNumeroDestino, calcularAnjoNumero };
