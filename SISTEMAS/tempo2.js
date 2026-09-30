function tempoAteMeiaNoite() {
    const agora = new Date();
    const meiaNoite = new Date(agora);
    meiaNoite.setHours(24, 0, 0, 0);
    const diffMs = meiaNoite - agora;
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos };
}

function tempoDesdeMeiaNoite() {
    const agora = new Date();
    const inicio = new Date(agora);
    inicio.setHours(0, 0, 0, 0);
    const diffMs = agora - inicio;
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos };
}

module.exports = { tempoAteMeiaNoite, tempoDesdeMeiaNoite };
