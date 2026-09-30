function palavraMaisFrequente(texto = "") {
    const palavras = String(texto).toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .match(/[a-z0-9]+/g) || [];
    if (!palavras.length) return null;
    const contagem = {};
    for (const p of palavras) contagem[p] = (contagem[p] || 0) + 1;
    let melhor = palavras[0];
    for (const p in contagem) if (contagem[p] > contagem[melhor]) melhor = p;
    return { palavra: melhor, vezes: contagem[melhor] };
}

function contarFrases(texto = "") {
    return (String(texto).match(/[^.!?]+[.!?]+/g) || []).length;
}

module.exports = { palavraMaisFrequente, contarFrases };
