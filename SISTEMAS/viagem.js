const DESTINOS_VIAGEM = ["Rio de Janeiro", "Paris", "Tóquio", "Lisboa", "Nova York", "Buenos Aires", "Roma", "Cancún", "Bali", "Cidade do Cabo", "Gramado", "Fernando de Noronha"];
const CONTINENTES = ["América do Norte", "América do Sul", "Europa", "África", "Ásia", "Oceania", "Antártida"];

function sortearDestinoViagem() {
    return DESTINOS_VIAGEM[Math.floor(Math.random() * DESTINOS_VIAGEM.length)];
}

function sortearContinente() {
    return CONTINENTES[Math.floor(Math.random() * CONTINENTES.length)];
}

module.exports = { sortearDestinoViagem, sortearContinente };
