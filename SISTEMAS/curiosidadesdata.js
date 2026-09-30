const EVENTOS_GENERICOS = [
    "grandes invenções costumam surgir de pequenas ideias do dia a dia",
    "todo dia é um bom dia pra aprender algo novo sobre história",
    "muitas descobertas importantes aconteceram meio que por acaso",
    "a humanidade documenta sua história há milhares de anos",
    "cada época teve sua própria forma de marcar o tempo"
];

const SIGNOS_POR_MES = {
    1: "capricórnio/aquário", 2: "aquário/peixes", 3: "peixes/áries", 4: "áries/touro",
    5: "touro/gêmeos", 6: "gêmeos/câncer", 7: "câncer/leão", 8: "leão/virgem",
    9: "virgem/libra", 10: "libra/escorpião", 11: "escorpião/sagitário", 12: "sagitário/capricórnio"
};

function eventoHistoricoHoje() {
    return EVENTOS_GENERICOS[Math.floor(Math.random() * EVENTOS_GENERICOS.length)];
}

function signoDoMes(mes) {
    const m = parseInt(mes);
    if (!Number.isFinite(m) || m < 1 || m > 12) return null;
    return SIGNOS_POR_MES[m];
}

module.exports = { eventoHistoricoHoje, signoDoMes };
