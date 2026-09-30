const ESTACOES_INICIO = [
    { nome: "verão", mes: 11, dia: 21 },
    { nome: "outono", mes: 2, dia: 20 },
    { nome: "inverno", mes: 5, dia: 21 },
    { nome: "primavera", mes: 8, dia: 23 }
];

function diasParaProximaEstacao() {
    const hoje = new Date();
    let proxima = null;
    let menorDiff = Infinity;
    for (let ano = hoje.getFullYear(); ano <= hoje.getFullYear() + 1; ano++) {
        for (const e of ESTACOES_INICIO) {
            const data = new Date(ano, e.mes, e.dia);
            const diff = data - hoje;
            if (diff >= 0 && diff < menorDiff) {
                menorDiff = diff;
                proxima = e.nome;
            }
        }
    }
    return { estacao: proxima, dias: Math.ceil(menorDiff / (1000 * 60 * 60 * 24)) };
}

function estacaoPorMes(mes) {
    const m = parseInt(mes);
    if (!Number.isFinite(m) || m < 1 || m > 12) return null;
    if ([12, 1, 2].includes(m)) return "verão";
    if ([3, 4, 5].includes(m)) return "outono";
    if ([6, 7, 8].includes(m)) return "inverno";
    return "primavera";
}

module.exports = { diasParaProximaEstacao, estacaoPorMes };
