const RECEITAS_RAPIDAS = [
    "macarrão alho e óleo com um toque de pimenta",
    "omelete de queijo com tomate",
    "sanduíche natural de frango desfiado",
    "arroz com ovo frito e molho shoyu",
    "panqueca de banana com canela",
    "misto quente com um suco gelado"
];

const LANCHES = [
    "torrada com pasta de amendoim",
    "iogurte com granola e mel",
    "mix de castanhas",
    "banana com aveia",
    "pipoca sem manteiga",
    "queijo com goiabada"
];

function sugerirReceitaRapida() {
    return RECEITAS_RAPIDAS[Math.floor(Math.random() * RECEITAS_RAPIDAS.length)];
}

function sugerirLanche() {
    return LANCHES[Math.floor(Math.random() * LANCHES.length)];
}

module.exports = { sugerirReceitaRapida, sugerirLanche };
