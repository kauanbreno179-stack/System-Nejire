function processarVigenere(texto = "", chave = "", modo = 1) {
    const chaveLimpa = String(chave).toUpperCase().replace(/[^A-Z]/g, "");
    if (!chaveLimpa) return null;
    let j = 0;
    return String(texto).replace(/[a-zA-Z]/g, c => {
        const base = c === c.toUpperCase() ? 65 : 97;
        const deslocamento = chaveLimpa.charCodeAt(j % chaveLimpa.length) - 65;
        j++;
        return String.fromCharCode(((c.charCodeAt(0) - base + modo * deslocamento + 26) % 26) + base);
    });
}

function cifraVigenere(texto, chave) {
    return processarVigenere(texto, chave, 1);
}

function decifraVigenere(texto, chave) {
    return processarVigenere(texto, chave, -1);
}

module.exports = { cifraVigenere, decifraVigenere };
