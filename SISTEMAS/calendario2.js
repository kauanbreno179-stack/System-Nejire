function diasAteFimDoAno() {
    const hoje = new Date();
    const fimAno = new Date(hoje.getFullYear(), 11, 31);
    return Math.ceil((fimAno - hoje) / (1000 * 60 * 60 * 24));
}

function diasDesdeInicioAno() {
    const hoje = new Date();
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    return Math.floor((hoje - inicioAno) / (1000 * 60 * 60 * 24));
}

module.exports = { diasAteFimDoAno, diasDesdeInicioAno };
