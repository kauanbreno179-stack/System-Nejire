const GENEROS_MUSICAIS = ["pop", "rock", "sertanejo", "funk", "mpb", "pagode", "eletrônica", "rap", "jazz", "reggae", "k-pop", "lofi"];
const INSTRUMENTOS = ["violão", "piano", "bateria", "baixo", "saxofone", "violino", "flauta", "ukulele", "guitarra", "cajón"];

function sortearGeneroMusical() {
    return GENEROS_MUSICAIS[Math.floor(Math.random() * GENEROS_MUSICAIS.length)];
}

function sortearInstrumento() {
    return INSTRUMENTOS[Math.floor(Math.random() * INSTRUMENTOS.length)];
}

module.exports = { sortearGeneroMusical, sortearInstrumento };
