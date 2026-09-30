function parseDataBR(dataStr = "") {
    const [dia, mes, ano] = String(dataStr).trim().split(/[\/\-]/).map(Number);
    if (!dia || !mes || !ano) return null;
    const data = new Date(ano, mes - 1, dia);
    if (Number.isNaN(data.getTime())) return null;
    return data;
}

function calcularIdadeEmDias(dataNasc) {
    const nascimento = parseDataBR(dataNasc);
    if (!nascimento) return null;
    const hoje = new Date();
    return Math.floor((hoje - nascimento) / (1000 * 60 * 60 * 24));
}

function calcularIdadeEmHoras(dataNasc) {
    const dias = calcularIdadeEmDias(dataNasc);
    if (dias === null) return null;
    return dias * 24;
}

module.exports = { calcularIdadeEmDias, calcularIdadeEmHoras };
