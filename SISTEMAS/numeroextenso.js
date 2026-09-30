const UNIDADES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const DEZ_A_DEZENOVE = ["dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const CENTENAS = ["", "cem", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function blocoAte999(n) {
    if (n === 0) return "";
    if (n === 100) return "cem";
    const c = Math.floor(n / 100);
    const resto = n % 100;
    let partes = [];
    if (c > 0) partes.push(CENTENAS[c]);
    if (resto > 0) {
        if (resto < 10) partes.push(UNIDADES[resto]);
        else if (resto < 20) partes.push(DEZ_A_DEZENOVE[resto - 10]);
        else {
            const d = Math.floor(resto / 10);
            const u = resto % 10;
            partes.push(DEZENAS[d] + (u > 0 ? " e " + UNIDADES[u] : ""));
        }
    }
    return partes.join(" e ");
}

function numeroParaExtenso(numero) {
    let n = parseInt(numero);
    if (!Number.isFinite(n) || n < 0 || n > 999999999) return null;
    if (n === 0) return "zero";
    const partes = [];
    const milhoes = Math.floor(n / 1000000);
    const milhares = Math.floor((n % 1000000) / 1000);
    const resto = n % 1000;
    if (milhoes > 0) partes.push(milhoes === 1 ? "um milhão" : `${blocoAte999(milhoes)} milhões`);
    if (milhares > 0) partes.push(milhares === 1 ? "mil" : `${blocoAte999(milhares)} mil`);
    if (resto > 0) partes.push(blocoAte999(resto));
    return partes.join(" e ");
}

function numeroParaOrdinal(numero) {
    const n = parseInt(numero);
    if (!Number.isFinite(n) || n <= 0 || n > 20) return null;
    const ordinais = ["primeiro", "segundo", "terceiro", "quarto", "quinto", "sexto", "sétimo", "oitavo", "nono", "décimo",
        "décimo primeiro", "décimo segundo", "décimo terceiro", "décimo quarto", "décimo quinto",
        "décimo sexto", "décimo sétimo", "décimo oitavo", "décimo nono", "vigésimo"];
    return ordinais[n - 1];
}

module.exports = { numeroParaExtenso, numeroParaOrdinal };
