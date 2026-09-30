const crypto = require("crypto");

function maiusculo(texto = "") {
    return String(texto).toUpperCase();
}

function minusculo(texto = "") {
    return String(texto).toLowerCase();
}

function capitalizar(texto = "") {
    return String(texto)
        .toLowerCase()
        .split(" ")
        .map(p => (p ? p[0].toUpperCase() + p.slice(1) : p))
        .join(" ");
}

function contarPalavras(texto = "") {
    return texto.trim().split(/\s+/).filter(Boolean).length;
}

function contarCaracteres(texto = "") {
    return {
        comEspacos: texto.length,
        semEspacos: texto.replace(/\s+/g, "").length
    };
}

function contarVogais(texto = "") {
    return (texto.match(/[aeiouAEIOUáéíóúÁÉÍÓÚâêîôûÂÊÎÔÛãõÃÕ]/g) || []).length;
}

function contarConsoantes(texto = "") {
    return (texto.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZçÇ]/g) || []).length;
}

function removerEspacos(texto = "") {
    return texto.trim().replace(/\s+/g, " ");
}

function embaralharTexto(texto = "") {
    const letras = texto.split("");
    for (let i = letras.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    return letras.join("");
}

function repetirTexto(texto = "", vezes = 1) {
    const n = Math.min(Math.max(parseInt(vezes) || 1, 1), 30);
    return Array(n).fill(texto).join(" ");
}

function paraBinario(texto = "") {
    return texto
        .split("")
        .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
}

function deBinario(binario = "") {
    try {
        return binario
            .trim()
            .split(/\s+/)
            .map(b => String.fromCharCode(parseInt(b, 2)))
            .join("");
    } catch {
        return null;
    }
}

function paraBase64(texto = "") {
    return Buffer.from(texto, "utf-8").toString("base64");
}

function deBase64(texto = "") {
    try {
        return Buffer.from(texto, "base64").toString("utf-8");
    } catch {
        return null;
    }
}

function gerarHash(texto = "", algoritmo = "sha256") {
    const algo = ["md5", "sha1", "sha256"].includes(algoritmo) ? algoritmo : "sha256";
    return crypto.createHash(algo).update(texto).digest("hex");
}

const MAPA_MORSE = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
    h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
    o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
    v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
};
const MAPA_MORSE_INVERSO = Object.fromEntries(Object.entries(MAPA_MORSE).map(([k, v]) => [v, k]));

function paraMorse(texto = "") {
    return texto
        .toLowerCase()
        .split("")
        .map(c => (c === " " ? "/" : MAPA_MORSE[c] || c))
        .join(" ");
}

function deMorse(codigo = "") {
    return codigo
        .trim()
        .split(" ")
        .map(c => (c === "/" ? " " : MAPA_MORSE_INVERSO[c] || c))
        .join("");
}

function calcular(expressao = "") {
    const limpa = expressao.replace(/\s+/g, "");
    if (!/^[0-9+\-*/().,%]+$/.test(limpa)) return null;
    try {
        // eslint-disable-next-line no-new-func
        const resultado = Function(`"use strict"; return (${limpa.replace(/,/g, ".")});`)();
        return Number.isFinite(resultado) ? resultado : null;
    } catch {
        return null;
    }
}

function calcularPorcentagem(valor, percentual) {
    return (valor * percentual) / 100;
}

function regraDeTres(a, b, c) {
    if (!a) return null;
    return (b * c) / a;
}

function celsiusParaFahrenheit(c) {
    return c * 1.8 + 32;
}

function fahrenheitParaCelsius(f) {
    return (f - 32) / 1.8;
}

function kmParaMilhas(km) {
    return km * 0.621371;
}

function kgParaLibras(kg) {
    return kg * 2.20462;
}

function metrosParaPes(m) {
    return m * 3.28084;
}

function contarLinhas(texto = "") {
    return texto.split("\n").filter(l => l.trim() !== "").length;
}

function extrairNumeros(texto = "") {
    return (texto.match(/[0-9]+/g) || []).join("");
}

function extrairLetras(texto = "") {
    return (texto.match(/[a-zA-ZáéíóúÁÉÍÓÚâêîôûÂÊÎÔÛãõÃÕçÇ]+/g) || []).join("");
}

function paraHex(texto = "") {
    return Buffer.from(texto, "utf-8").toString("hex");
}

function deHex(hex = "") {
    try {
        const limpo = hex.replace(/\s+/g, "");
        if (!/^[0-9a-fA-F]+$/.test(limpo) || limpo.length % 2 !== 0) return null;
        return Buffer.from(limpo, "hex").toString("utf-8");
    } catch {
        return null;
    }
}

function gerarSlug(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function mascararEmail(email = "") {
    const match = email.trim().match(/^(.+)@(.+)$/);
    if (!match) return null;
    const [, usuario, dominio] = match;
    if (usuario.length <= 2) return `${usuario[0]}*@${dominio}`;
    return `${usuario.slice(0, 2)}${"*".repeat(Math.max(usuario.length - 2, 1))}@${dominio}`;
}

function msParaData(ms) {
    const timestamp = Number(ms);
    if (Number.isNaN(timestamp)) return null;
    return new Date(timestamp).toLocaleString("pt-BR");
}

function dataParaMs(dataStr = "") {
    const [dia, mes, ano] = dataStr.trim().split(/[\/\-]/).map(Number);
    if (!dia || !mes || !ano) return null;
    const data = new Date(ano, mes - 1, dia);
    if (Number.isNaN(data.getTime())) return null;
    return data.getTime();
}

function arredondar(valor, casas = 2) {
    const fator = Math.pow(10, Math.max(0, Math.min(casas, 10)));
    return Math.round(valor * fator) / fator;
}

function mdc(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function mmc(a, b) {
    const divisor = mdc(a, b);
    if (!divisor) return 0;
    return Math.abs(Math.floor(a) * Math.floor(b)) / divisor;
}

function ehPrimo(n) {
    n = Math.floor(n);
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function fatorial(n) {
    n = Math.floor(n);
    if (n < 0 || n > 170) return null;
    let resultado = 1;
    for (let i = 2; i <= n; i++) resultado *= i;
    return resultado;
}

function raizQuadrada(n) {
    if (n < 0) return null;
    return Math.sqrt(n);
}

module.exports = {
    maiusculo,
    minusculo,
    capitalizar,
    contarPalavras,
    contarCaracteres,
    contarVogais,
    contarConsoantes,
    removerEspacos,
    embaralharTexto,
    repetirTexto,
    paraBinario,
    deBinario,
    paraBase64,
    deBase64,
    gerarHash,
    paraMorse,
    deMorse,
    calcular,
    calcularPorcentagem,
    regraDeTres,
    celsiusParaFahrenheit,
    fahrenheitParaCelsius,
    kmParaMilhas,
    kgParaLibras,
    metrosParaPes,
    contarLinhas,
    extrairNumeros,
    extrairLetras,
    paraHex,
    deHex,
    gerarSlug,
    mascararEmail,
    msParaData,
    dataParaMs,
    arredondar,
    mdc,
    mmc,
    ehPrimo,
    fatorial,
    raizQuadrada
};
