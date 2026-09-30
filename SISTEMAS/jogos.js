function normalizar(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
}

function sortear(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// ── SORTEIO ENTRE OPÇÕES ─────────────────────────────────
function sorteio(opcoes = []) {
    if (!opcoes.length) return null;
    return sortear(opcoes);
}

const PREMIOS_ROLETA = ["🥇 prêmio máximo!", "🥈 prêmio médio!", "🥉 prêmio pequeno", "🍀 quase lá, tenta de novo!", "😅 não foi dessa vez", "🎁 prêmio surpresa!"];

function roleta() {
    return sortear(PREMIOS_ROLETA);
}

// ── LOTERIA ───────────────────────────────────────────────
function loteria(qtd = 6, max = 60) {
    const numeros = new Set();
    while (numeros.size < qtd) {
        numeros.add(Math.floor(Math.random() * max) + 1);
    }
    return [...numeros].sort((a, b) => a - b);
}

// ── ANAGRAMA / PALÍNDROMO ────────────────────────────────
function verificarAnagrama(p1 = "", p2 = "") {
    const a = normalizar(p1).split("").sort().join("");
    const b = normalizar(p2).split("").sort().join("");
    return a.length > 0 && a === b;
}

function verificarPalindromo(texto = "") {
    const limpo = normalizar(texto);
    return limpo.length > 0 && limpo === limpo.split("").reverse().join("");
}

// ── QUIZ ──────────────────────────────────────────────────
const PERGUNTAS_QUIZ = [
    { pergunta: "qual é o maior planeta do sistema solar?", opcoes: ["terra", "júpiter", "marte", "saturno"], correta: 1 },
    { pergunta: "quantos continentes existem?", opcoes: ["5", "6", "7", "8"], correta: 2 },
    { pergunta: "qual é o maior oceano do mundo?", opcoes: ["atlântico", "índico", "ártico", "pacífico"], correta: 3 },
    { pergunta: "quantos ossos tem o corpo humano adulto?", opcoes: ["186", "206", "226", "246"], correta: 1 },
    { pergunta: "qual é o metal líquido à temperatura ambiente?", opcoes: ["ferro", "mercúrio", "chumbo", "ouro"], correta: 1 },
    { pergunta: "qual animal é conhecido como 'rei da selva'?", opcoes: ["tigre", "leão", "elefante", "leopardo"], correta: 1 },
    { pergunta: "quantos lados tem um hexágono?", opcoes: ["5", "6", "7", "8"], correta: 1 },
    { pergunta: "qual é o menor osso do corpo humano?", opcoes: ["estribo", "fêmur", "costela", "tíbia"], correta: 0 }
];

function quiz() {
    return sortear(PERGUNTAS_QUIZ);
}

// ── SORTEAR LETRA (útil pra adedanha/stop) ───────────────
const ALFABETO = "abcdefghijklmnopqrstuvwxyz".split("");

function sortearLetra() {
    return sortear(ALFABETO).toUpperCase();
}

// ── TROCADILHOS & ENIGMAS ────────────────────────────────
const TROCADILHOS = [
    "o que o zero disse pro oito? bonito o cinto, hein!",
    "por que a abelha não casa? porque ela já tem colmeia própria",
    "qual é o cúmulo da lentidão? nascer de 9 meses",
    "o que é um cachorro sem rabo? sem-rabo (sem graça, tá?)",
    "por que a vaca foi ao espaço? pra ver a via-láctea de perto"
];

function trocadilho() {
    return sortear(TROCADILHOS);
}

const ENIGMAS = [
    { pergunta: "tenho cidades mas não tenho casas, florestas mas não tenho árvores, rios mas não tenho água. o que sou?", resposta: "um mapa" },
    { pergunta: "quanto mais eu seco, mais eu fico molhado. o que sou?", resposta: "uma toalha" },
    { pergunta: "sou leve como uma pena, mas ninguém consegue me segurar por muito tempo. o que sou?", resposta: "o fôlego" },
    { pergunta: "tenho chaves mas não abro portas, tenho espaço mas não tenho quarto. o que sou?", resposta: "um teclado" },
    { pergunta: "quanto mais você tira de mim, maior eu fico. o que sou?", resposta: "um buraco" }
];

function enigma() {
    return sortear(ENIGMAS);
}

// ── BINGO ─────────────────────────────────────────────────
function bingo() {
    const numero = Math.floor(Math.random() * 75) + 1;
    let letra = "B";
    if (numero > 15 && numero <= 30) letra = "I";
    else if (numero > 30 && numero <= 45) letra = "N";
    else if (numero > 45 && numero <= 60) letra = "G";
    else if (numero > 60) letra = "O";
    return `${letra}-${numero}`;
}

// ── DADO DUPLO ────────────────────────────────────────────
function dadoDuplo() {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    return { d1, d2, soma: d1 + d2 };
}

// ── RIMAR (baseado numa lista simples de palavras comuns) ─
const BANCO_RIMAS = [
    "amor", "flor", "calor", "cor", "dor", "sabor", "melhor", "senhor",
    "coração", "paixão", "emoção", "direção", "canção", "razão",
    "mar", "lugar", "olhar", "voar", "sonhar", "amar", "cantar",
    "vida", "saída", "partida", "querida", "florida", "sentida",
    "luz", "cruz", "avestruz",
    "feliz", "raiz", "cicatriz", "matiz"
];

function rimar(palavra = "") {
    const alvo = normalizar(palavra).slice(-3);
    if (!alvo) return [];
    return BANCO_RIMAS.filter(p => normalizar(p) !== normalizar(palavra) && normalizar(p).endsWith(alvo));
}

// ── NÚMERO DA SORTE ───────────────────────────────────────
function numeroSorte(semente = "") {
    const base = semente + new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
        hash = (hash * 31 + base.charCodeAt(i)) % 1000003;
    }
    return (Math.abs(hash) % 100) + 1;
}

// ── HORÓSCOPO ─────────────────────────────────────────────
const SIGNOS = ["áries", "touro", "gêmeos", "câncer", "leão", "virgem", "libra", "escorpião", "sagitário", "capricórnio", "aquário", "peixes"];

const FRASES_HOROSCOPO = [
    "hoje é um bom dia pra tomar aquela decisão que você vem adiando",
    "cuidado com gastos por impulso hoje, segura um pouco a mão",
    "um encontro inesperado pode trazer boas notícias",
    "seu ânimo tá em alta, aproveita pra resolver o que tava parado",
    "evite discussões bobas hoje, respira antes de responder",
    "boas energias no amor e nas amizades esse período",
    "é um bom momento pra focar em você mesmo(a)",
    "algo que parecia difícil vai começar a se resolver"
];

function horoscopo(signo = "") {
    const s = normalizar(signo);
    const encontrado = SIGNOS.find(sg => normalizar(sg) === s);
    if (!encontrado) return null;
    return { signo: encontrado, frase: sortear(FRASES_HOROSCOPO) };
}

function compatibilidadeSignos(signo1 = "", signo2 = "") {
    const s1 = normalizar(signo1);
    const s2 = normalizar(signo2);
    const e1 = SIGNOS.find(sg => normalizar(sg) === s1);
    const e2 = SIGNOS.find(sg => normalizar(sg) === s2);
    if (!e1 || !e2) return null;

    const base = (e1 + e2).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const porcentagem = base % 101;
    return { signo1: e1, signo2: e2, porcentagem };
}

module.exports = {
    sorteio,
    roleta,
    loteria,
    verificarAnagrama,
    verificarPalindromo,
    quiz,
    sortearLetra,
    trocadilho,
    enigma,
    bingo,
    dadoDuplo,
    rimar,
    numeroSorte,
    horoscopo,
    compatibilidadeSignos,
    SIGNOS,
    adedanha,
    jogoDaVelhaVazio,
    numeroMagico,
    sortearAnimal,
    sortearCor,
    sortearPais,
    sortearProfissao,
    desenharForca,
    charadaMatematica,
    capitalSurpresa
};

// ── ADEDANHA (STOP) ───────────────────────────────────────
const CATEGORIAS_ADEDANHA = ["nome", "cor", "animal", "fruta", "país", "objeto", "profissão", "comida"];

function adedanha() {
    return { letra: sortearLetra(), categorias: CATEGORIAS_ADEDANHA };
}

// ── JOGO DA VELHA (tabuleiro vazio, só visual) ───────────
function jogoDaVelhaVazio() {
    return "1️⃣|2️⃣|3️⃣\n4️⃣|5️⃣|6️⃣\n7️⃣|8️⃣|9️⃣";
}

// ── NÚMERO MÁGICO (curiosidades matemáticas de um número) ─
function numeroMagico(numero) {
    const n = Math.floor(Number(numero));
    if (Number.isNaN(n)) return null;

    const fatos = [];
    fatos.push(n % 2 === 0 ? "é par" : "é ímpar");

    let ehPrimo = n > 1;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) { ehPrimo = false; break; }
    }
    fatos.push(ehPrimo ? "é primo" : "não é primo");

    const raiz = Math.sqrt(Math.abs(n));
    if (Number.isInteger(raiz)) fatos.push(`é um quadrado perfeito (${raiz}²)`);

    const soma = String(Math.abs(n)).split("").reduce((acc, d) => acc + Number(d), 0);
    fatos.push(`a soma dos dígitos dele é ${soma}`);

    return fatos;
}

// ── SORTEIOS TEMÁTICOS ────────────────────────────────────
const ANIMAIS = ["leão", "girafa", "capivara", "golfinho", "coruja", "panda", "tartaruga", "raposa", "lontra", "elefante"];
const CORES = ["azul", "vermelho", "verde", "amarelo", "roxo", "laranja", "rosa", "preto", "branco", "turquesa"];
const PAISES = ["brasil", "japão", "frança", "egito", "canadá", "austrália", "itália", "méxico", "índia", "noruega"];
const PROFISSOES = ["astronauta", "cozinheiro(a)", "professor(a)", "bombeiro(a)", "veterinário(a)", "piloto", "fotógrafo(a)", "músico(a)"];

function sortearAnimal() { return sortear(ANIMAIS); }
function sortearCor() { return sortear(CORES); }
function sortearPais() { return sortear(PAISES); }
function sortearProfissao() { return sortear(PROFISSOES); }

// ── FORCA (visual decorativo, estado aleatório) ──────────
const ESTAGIOS_FORCA = [
    "😀 tudo certo ainda!",
    "🙂 primeira tentativa errada...",
    "😐 cuidado, já foram 2 erros",
    "😟 metade do caminho pra perder",
    "😨 quase enforcado(a)!",
    "💀 game over, a forca venceu"
];

function desenharForca() {
    return sortear(ESTAGIOS_FORCA);
}

// ── CHARADA MATEMÁTICA ────────────────────────────────────
const CHARADAS_MATEMATICAS = [
    { pergunta: "sou um número, o dobro de mim é 20. quem sou?", resposta: "10" },
    { pergunta: "some meus dois primeiros números primos e me diga o resultado (2 e 3)", resposta: "5" },
    { pergunta: "sou a metade de 50 e ainda sobra o dobro de 5. qual número resulta dessa soma?", resposta: "35" },
    { pergunta: "sou um número de dois dígitos iguais, e a soma deles dá 8. quem sou?", resposta: "44" },
    { pergunta: "multiplique 6 por 7. qual é o resultado?", resposta: "42" }
];

function charadaMatematica() {
    return sortear(CHARADAS_MATEMATICAS);
}

// ── CAPITAL SURPRESA ──────────────────────────────────────
const CAPITAIS = [
    { pais: "brasil", capital: "brasília" },
    { pais: "japão", capital: "tóquio" },
    { pais: "frança", capital: "paris" },
    { pais: "egito", capital: "cairo" },
    { pais: "canadá", capital: "otava" },
    { pais: "austrália", capital: "camberra" },
    { pais: "itália", capital: "roma" },
    { pais: "méxico", capital: "cidade do méxico" },
    { pais: "índia", capital: "nova délhi" },
    { pais: "noruega", capital: "oslo" }
];

function capitalSurpresa() {
    return sortear(CAPITAIS);
}
