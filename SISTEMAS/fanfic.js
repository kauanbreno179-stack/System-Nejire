const INICIOS_FANFIC = [
    "era uma noite chuvosa quando tudo mudou entre eles",
    "ninguém esperava que aquele encontro casual fosse mudar suas vidas",
    "depois de anos separados, o destino os colocou frente a frente de novo",
    "no meio do caos, só um olhar foi capaz de acalmar tudo",
    "era pra ser só mais um dia comum, até ele aparecer na porta"
];

function gerarInicioFanfic() {
    return INICIOS_FANFIC[Math.floor(Math.random() * INICIOS_FANFIC.length)];
}

function gerarNomeShip(nome1 = "", nome2 = "") {
    const a = String(nome1).trim();
    const b = String(nome2).trim();
    if (!a || !b) return null;
    const metadeA = a.slice(0, Math.ceil(a.length / 2));
    const metadeB = b.slice(Math.floor(b.length / 2));
    return metadeA + metadeB;
}

module.exports = { gerarInicioFanfic, gerarNomeShip };
