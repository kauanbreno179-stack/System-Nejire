const PREVISOES_AMOR = [
    "alguém do passado pode voltar a dar as caras essa semana",
    "um encontro casual pode virar algo mais sério",
    "é hora de se abrir mais com quem você já confia",
    "cuidado pra não confundir carência com paixão",
    "boas conversas vão esquentar seu coração nos próximos dias"
];

const CORES_SORTE = { "áries": "vermelho", "touro": "verde", "gêmeos": "amarelo", "câncer": "prata",
    "leão": "dourado", "virgem": "marrom", "libra": "azul claro", "escorpião": "vinho",
    "sagitário": "roxo", "capricórnio": "preto", "aquário": "azul turquesa", "peixes": "lilás" };

function previsaoAmorosa() {
    return PREVISOES_AMOR[Math.floor(Math.random() * PREVISOES_AMOR.length)];
}

function corDaSorteSigno(signo = "") {
    const s = String(signo).trim().toLowerCase();
    return CORES_SORTE[s] || null;
}

module.exports = { previsaoAmorosa, corDaSorteSigno, CORES_SORTE };
