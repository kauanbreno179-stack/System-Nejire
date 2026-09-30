function converterFusoHorario(hora, fusoOrigem, fusoDestino) {
    const h = parseFloat(hora);
    const origem = parseFloat(fusoOrigem);
    const destino = parseFloat(fusoDestino);
    if (!Number.isFinite(h) || !Number.isFinite(origem) || !Number.isFinite(destino)) return null;
    let resultado = (h - origem + destino) % 24;
    if (resultado < 0) resultado += 24;
    return resultado;
}

function horaUTC() {
    const agora = new Date();
    return agora.toISOString().substring(11, 19);
}

module.exports = { converterFusoHorario, horaUTC };
