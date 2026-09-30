function cifraCesar(texto = "", deslocamento = 3) {
    const d = ((parseInt(deslocamento) % 26) + 26) % 26;
    return String(texto).replace(/[a-zA-Z]/g, c => {
        const base = c === c.toUpperCase() ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + d) % 26) + base);
    });
}

function decifraCesar(texto = "", deslocamento = 3) {
    return cifraCesar(texto, -parseInt(deslocamento));
}

module.exports = { cifraCesar, decifraCesar };
