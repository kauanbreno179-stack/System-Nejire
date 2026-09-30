function parseDataBR(dataStr = "") {
    const [dia, mes] = String(dataStr).trim().split(/[\/\-]/).map(Number);
    if (!dia || !mes) return null;
    return { dia, mes };
}

function diasParaAniversario(dataNasc) {
    const p = parseDataBR(dataNasc);
    if (!p) return null;
    const hoje = new Date();
    let proximo = new Date(hoje.getFullYear(), p.mes - 1, p.dia);
    if (proximo < hoje) proximo = new Date(hoje.getFullYear() + 1, p.mes - 1, p.dia);
    hoje.setHours(0, 0, 0, 0);
    return Math.ceil((proximo - hoje) / (1000 * 60 * 60 * 24));
}

const DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

function aniversarioDiaSemana(dataNasc) {
    const p = parseDataBR(dataNasc);
    if (!p) return null;
    const hoje = new Date();
    let proximo = new Date(hoje.getFullYear(), p.mes - 1, p.dia);
    if (proximo < hoje) proximo = new Date(hoje.getFullYear() + 1, p.mes - 1, p.dia);
    return DIAS_SEMANA[proximo.getDay()];
}

module.exports = { diasParaAniversario, aniversarioDiaSemana };
