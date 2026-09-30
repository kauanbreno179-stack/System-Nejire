const ANIMAIS_PERSONALIDADE = ["leão", "raposa", "coruja", "golfinho", "lobo", "gato", "cavalo", "águia", "urso", "borboleta"];
const ELEMENTOS_PERSONALIDADE = ["fogo", "água", "terra", "ar"];

function qualAnimalVoceE() {
    return ANIMAIS_PERSONALIDADE[Math.floor(Math.random() * ANIMAIS_PERSONALIDADE.length)];
}

function qualElementoVoceE() {
    return ELEMENTOS_PERSONALIDADE[Math.floor(Math.random() * ELEMENTOS_PERSONALIDADE.length)];
}

module.exports = { qualAnimalVoceE, qualElementoVoceE };
