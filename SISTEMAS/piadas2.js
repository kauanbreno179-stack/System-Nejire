const PIADAS_CURTAS = [
    "por que o computador foi ao médico? porque estava com vírus",
    "o que o pato disse pra pata? vem quá!",
    "por que o livro de matemática ficou triste? por causa dos seus problemas",
    "o que uma parede disse pra outra? te encontro na esquina",
    "por que o esqueleto não briga com ninguém? porque não tem estômago pra isso",
    "o que o zero disse pro oito? bonito o cinto"
];

const TROCADILHOS_RUINS = [
    "eu ia contar uma piada sobre paus, mas ainda tô a-fiando ela",
    "o que o peixe disse quando bateu na parede? nada, peixe não fala",
    "sabe por que o café foi preso? porque tava moído",
    "por que a abelha não casou? porque não achou o zangão certo",
    "meu amigo trabalha numa fábrica de espelhos, eu me vejo nele"
];

function piadaCurta() {
    return PIADAS_CURTAS[Math.floor(Math.random() * PIADAS_CURTAS.length)];
}

function trocadilhoRuim() {
    return TROCADILHOS_RUINS[Math.floor(Math.random() * TROCADILHOS_RUINS.length)];
}

module.exports = { piadaCurta, trocadilhoRuim };
