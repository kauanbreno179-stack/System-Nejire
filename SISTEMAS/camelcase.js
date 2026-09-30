function limparPalavras(texto = "") {
    return String(texto).trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/).filter(Boolean);
}

function paraCamelCase(texto = "") {
    const palavras = limparPalavras(texto);
    if (!palavras.length) return "";
    return palavras.map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join("");
}

function paraKebabCase(texto = "") {
    return limparPalavras(texto).join("-");
}

module.exports = { paraCamelCase, paraKebabCase };
