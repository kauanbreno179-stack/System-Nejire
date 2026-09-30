const crypto = require("crypto");
const { lopesGet } = require("../utils/api.js");

async function perguntarGpt(pergunta) {
    const resp = await lopesGet("gpt", {}, pergunta);
    if (!resp.ok) return null;

    const dados = resp.data;
    return dados?.result || dados?.message || dados?.response || dados?.answer || (typeof dados === "string" ? dados : null);
}

const RESPOSTAS_8BALL = [
    "sim, com certeza!! 🐚",
    "com toda certeza, sem dúvidas",
    "hmm... acho que sim",
    "não tenho tanta certeza não",
    "acho que não, viu?",
    "não! definitivamente não",
    "pergunta de novo mais tarde, tô em dúvida",
    "impossível saber agora"
];

function bola8() {
    return RESPOSTAS_8BALL[Math.floor(Math.random() * RESPOSTAS_8BALL.length)];
}

const CONSELHOS = [
    "faz aquilo que tá enrolando fazer — vai por etapas, uma de cada vez!",
    "bebe uma água, olha lá pra fora, e respira. depois volta pro problema",
    "pergunta 5 vezes 'por quê' pra qualquer decisão grande — funciona, juro!",
    "se tá em dúvida entre duas opções, escolhe a que te dá mais curiosidade",
    "descansa. gente cansada toma decisão pior, isso é ciência!"
];

function conselho() {
    return CONSELHOS[Math.floor(Math.random() * CONSELHOS.length)];
}

function gerarSenha(tamanho = 12) {
    const tam = Math.min(Math.max(tamanho, 6), 64);
    return crypto.randomBytes(tam).toString("base64").replace(/[+/=]/g, "").slice(0, tam);
}

function calcularCasal(nome1, nome2) {
    const base = (nome1 + nome2).toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return base % 101;
}

function jogarPPT(escolhaJogador) {
    const opcoes = ["pedra", "papel", "tesoura"];
    const escolhaBot = opcoes[Math.floor(Math.random() * opcoes.length)];

    if (escolhaBot === escolhaJogador) {
        return { escolhaBot, resultado: "empate" };
    }

    const botGanha = {
        pedra: "tesoura",
        papel: "pedra",
        tesoura: "papel"
    };

    const resultado = botGanha[escolhaBot] === escolhaJogador ? "bot" : "jogador";
    return { escolhaBot, resultado };
}

const ADJETIVOS_NICK = ["Fofa", "Curiosa", "Elétrica", "Brilhante", "Rápida", "Sonhadora", "Solta"];

function gerarNick(base = "Nejire") {
    const adj = ADJETIVOS_NICK[Math.floor(Math.random() * ADJETIVOS_NICK.length)];
    const numero = Math.floor(Math.random() * 999);
    return `${base}${adj}${numero}`;
}

const PIADAS = [
    "por que o livro de matemática ficou triste? porque tinha muitos problemas 😂",
    "o que o pato disse pra namorada? vem quá! 🦆",
    "por que o computador foi ao médico? porque tava com vírus 💻",
    "o que a impressora disse pra outra? essa folha é sua ou é impressão minha?",
    "por que o peixe não joga tênis? porque tem medo da rede 🐟"
];

function piada() {
    return PIADAS[Math.floor(Math.random() * PIADAS.length)];
}

const CHARADAS = [
    { pergunta: "o que é, o que é: quanto mais se tira, maior fica?", resposta: "um buraco" },
    { pergunta: "o que é, o que é: tem cidade, tem casa, mas não tem gente?", resposta: "o mapa" },
    { pergunta: "o que é, o que é: fala mas não tem boca, corre mas não tem pernas?", resposta: "o rio" },
    { pergunta: "o que é, o que é: quanto mais água, mais fácil de afundar?", resposta: "uma esponja não, é o papel!" },
    { pergunta: "o que é, o que é: começa com E, termina com E e só tem uma letra?", resposta: "envelope" }
];

function charada() {
    return CHARADAS[Math.floor(Math.random() * CHARADAS.length)];
}

const FRASES_MOTIVACIONAIS = [
    "um passo de cada vez já é progresso 🌊",
    "seu ritmo é válido, não compara sua página 1 com a página 100 de outra pessoa",
    "descansar também é produtivo, não esquece disso",
    "você já superou 100% dos seus piores dias até agora",
    "faz o que der hoje, amanhã você continua"
];

function fraseMotivacional() {
    return FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)];
}

const DESAFIOS = [
    "manda um áudio cantando a primeira música que tocar na sua cabeça 🎤",
    "manda uma foto de algo azul perto de você 💙",
    "escreve uma frase só usando palavras que começam com a mesma letra",
    "conta pro grupo uma curiosidade aleatória que você sabe",
    "fica 10 minutos sem pegar no celular (depois volta e conta como foi!)"
];

function desafio() {
    return DESAFIOS[Math.floor(Math.random() * DESAFIOS.length)];
}

// ── CITAÇÕES (autorais/anônimas, sem atribuir a pessoas reais) ──
const CITACOES = [
    "quem espera sempre alcança, mas quem se move alcança mais rápido",
    "a curiosidade é o primeiro passo pra qualquer descoberta",
    "não é sobre nunca cair, é sobre sempre se levantar",
    "pequenos hábitos constroem grandes mudanças",
    "o medo do erro não pode ser maior que a vontade de tentar",
    "toda maré alta um dia baixa, e toda maré baixa um dia sobe de novo"
];

function citacao() {
    return `${sortearArr(CITACOES)}\n\n— citação anônima 💙`;
}

function sortearArr(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// ── DEFINIÇÃO ENGRAÇADA ──────────────────────────────────
const MODELOS_DEFINICAO = [
    p => `${p}: substantivo. aquilo que você finge entender numa conversa pra não parecer por fora`,
    p => `${p}: quando alguém usa isso numa frase, todo mundo concorda só pra não admitir que não sabe o que é`,
    p => `${p}: coisa que existe, mas ninguém sabe explicar direito de onde veio`,
    p => `${p}: um clássico assunto de conversa fiada quando ninguém tem mais o que falar`,
    p => `${p}: aquilo que parece simples até você tentar explicar pra alguém`
];

function definicao(palavra = "algo") {
    return sortearArr(MODELOS_DEFINICAO)(palavra);
}

// ── PREVISÃO DO FUTURO (brincadeira) ─────────────────────
const PREVISOES = [
    "em breve você vai receber uma mensagem que estava esperando",
    "uma surpresa boa tá chegando, só não sei bem quando",
    "algo que você começou recentemente vai dar certo",
    "vem uma comida boa no seu caminho essa semana",
    "você vai rir bastante nos próximos dias",
    "uma decisão que você tava adiando vai ficar mais clara logo logo"
];

function previsao() {
    return sortearArr(PREVISOES);
}

// ── ELOGIOS ───────────────────────────────────────────────
const ELOGIOS = [
    "você é mais capaz do que imagina, viu?",
    "sua energia hoje tá contagiante",
    "você lida bem com desafios, mesmo quando não percebe",
    "sua criatividade é rara, guarda ela bem",
    "você faz diferença na vida de quem tá por perto",
    "seu esforço não passa despercebido, não"
];

function elogio() {
    return sortearArr(ELOGIOS);
}

// ── APELIDO ENGRAÇADO ────────────────────────────────────
const ADJETIVOS_APELIDO = ["Turbo", "Fofurinha", "Master", "Real", "Lendário(a)", "Sortudo(a)", "Trovão", "Mini", "Ultra", "Zen"];
const ANIMAIS_APELIDO = ["Capivara", "Panda", "Lontra", "Coala", "Raposa", "Pinguim", "Ouriço", "Coruja", "Gambá", "Golfinho"];

function apelidoEngracado(nome = "") {
    const base = nome.trim() ? `${nome.trim()} ` : "";
    return `${base}${sortearArr(ADJETIVOS_APELIDO)} ${sortearArr(ANIMAIS_APELIDO)}`;
}

// ── NOMES DE HERÓI/VILÃO ─────────────────────────────────
const PREFIXOS_HEROI = ["Capitã(o)", "Fenômeno", "Guardiã(o)", "Vórtice", "Relâmpago", "Sentinela", "Aurora", "Fúria"];
const SUFIXOS_HEROI = ["Azul", "das Marés", "Solar", "Noturno(a)", "de Cristal", "das Sombras", "Estelar", "do Oceano"];

function nomeDeHeroi() {
    return `${sortearArr(PREFIXOS_HEROI)} ${sortearArr(SUFIXOS_HEROI)}`;
}

const PREFIXOS_VILAO = ["Doutor(a)", "Lorde", "Rainha", "Mestre(a)", "Sombra de", "Barão(esa)", "Império"];
const SUFIXOS_VILAO = ["Caos", "Trevas", "Tempestade", "Discórdia", "Vazio", "Ruína", "Eclipse"];

function nomeDeVilao() {
    return `${sortearArr(PREFIXOS_VILAO)} ${sortearArr(SUFIXOS_VILAO)}`;
}

// ── SUPERPODER ────────────────────────────────────────────
const SUPERPODERES = [
    "controlar o tempo (climático, não o relógio!)",
    "ler pensamentos de animais de estimação",
    "teletransporte de curta distância",
    "invisibilidade só nas segundas de manhã",
    "falar com plantas e elas responderem",
    "nunca perder o wi-fi",
    "voar bem devagarinho",
    "força sobre-humana só pra abrir potes difíceis"
];

function superpoder() {
    return sortearArr(SUPERPODERES);
}

// ── STATUS CRIATIVO ───────────────────────────────────────
const STATUS_CRIATIVOS = [
    "vivendo um dia de cada vez 🌊",
    "modo: recarregando energia 🔋",
    "colecionando momentos bons 💙",
    "hoje o café venceu, amanhã eu venço",
    "no meu próprio ritmo, sem pressa 🐚",
    "ocupado(a) sendo feliz nas coisas pequenas"
];

function statusCriativo() {
    return sortearArr(STATUS_CRIATIVOS);
}

// ── DESPEDIDA ─────────────────────────────────────────────
const DESPEDIDAS = [
    "até mais! cuida-se por aí 💙",
    "falou! volta sempre que quiser conversar",
    "tchau tchau, foi bom falar com você!",
    "até a próxima, se cuida! 🌊",
    "nos falamos em breve, então!"
];

function despedida() {
    return sortearArr(DESPEDIDAS);
}

// ── DICA DE OURO ──────────────────────────────────────────
const DICAS_OURO = [
    "anote suas tarefas do dia em ordem de prioridade, não de urgência",
    "separe um valorzinho fixo pra guardar assim que receber, antes de gastar",
    "revise o que estudou em 24h, depois em 7 dias — fixa muito mais",
    "antes de responder algo no calor do momento, conta até 10",
    "troque telas por 15 minutos de caminhada quando travar num problema",
    "guarde sempre uma cópia extra dos arquivos importantes"
];

function dicaDeOuro() {
    return sortearArr(DICAS_OURO);
}

// ── CURIOSIDADE DE ANIMAL ────────────────────────────────
const CURIOSIDADES_ANIMAIS = [
    "as girafas dormem só cerca de 2 horas por dia, imagina só",
    "os gatos passam em média 70% da vida dormindo",
    "os elefantes são um dos poucos animais que se reconhecem no espelho",
    "as corujas não conseguem mover os olhos, só a cabeça",
    "os cangurus não conseguem andar pra trás",
    "as formigas não têm pulmões, respiram pela pele"
];

function curiosidadeAnimal() {
    return sortearArr(CURIOSIDADES_ANIMAIS);
}

// ── MITO OU REALIDADE ────────────────────────────────────
const MITOS_REALIDADES = [
    { texto: "engolir chiclete leva 7 anos pra digerir", resposta: "mito! o corpo não digere o chiclete, mas ele sai normalmente em poucos dias" },
    { texto: "morcegos são cegos", resposta: "mito! a maioria enxerga bem, só usa também a ecolocalização" },
    { texto: "o mel não estraga nunca", resposta: "verdade! encontraram potes de mel com milhares de anos ainda próprios pro consumo" },
    { texto: "usamos só 10% do cérebro", resposta: "mito! usamos praticamente o cérebro inteiro, só que em momentos diferentes" },
    { texto: "camaleões mudam de cor só pra se camuflar", resposta: "mito parcial! eles mudam mais por temperatura e humor do que camuflagem" }
];

function mitoOuRealidade() {
    return sortearArr(MITOS_REALIDADES);
}

// ── INTERPRETAR SONHO (brincadeira genérica) ─────────────
const INTERPRETACOES_SONHO = [
    "isso costuma representar um desejo de mudança que tá surgindo dentro de você",
    "pode ser um sinal de que você tá processando algo do seu dia a dia",
    "geralmente aparece quando a mente quer resolver algo que ficou em aberto",
    "costuma representar segurança ou a falta dela em algum momento recente",
    "pode ser só reflexo de algo que você viu ou pensou antes de dormir mesmo!"
];

function interpretarSonho(tema = "isso") {
    return `sonhar com "${tema}"... ${sortearArr(INTERPRETACOES_SONHO)}\n\n_(brincadeira sem base científica, viu? é só diversão 💙)_`;
}

// ── O QUE FAZER AGORA ────────────────────────────────────
const SUGESTOES_ATIVIDADE = [
    "que tal organizar algo pequeno que tava bagunçado por aí?",
    "bora beber um copo d'água e dar uma esticadinha?",
    "aproveita e manda mensagem pra alguém que você não fala faz tempo",
    "separa 10 minutinhos pra arrumar aquela gaveta esquecida",
    "escuta uma música que você não ouve há um tempo",
    "anota 3 coisas boas que aconteceram hoje"
];

function queFazer() {
    return sortearArr(SUGESTOES_ATIVIDADE);
}

module.exports = {
    perguntarGpt,
    bola8,
    conselho,
    gerarSenha,
    calcularCasal,
    jogarPPT,
    gerarNick,
    piada,
    charada,
    fraseMotivacional,
    desafio,
    citacao,
    definicao,
    previsao,
    elogio,
    apelidoEngracado,
    nomeDeHeroi,
    nomeDeVilao,
    superpoder,
    statusCriativo,
    despedida,
    dicaDeOuro,
    curiosidadeAnimal,
    mitoOuRealidade,
    interpretarSonho,
    queFazer,
    bioSugestao,
    legendaFoto,
    nomeDeBanda,
    nomeDeJogo,
    sloganEngracado,
    horoscopoChines,
    numerologiaNome,
    testePersonalidade,
    qualPersonagemSou,
    gerarTituloDeMusica,
    gerarNomeDePlaneta,
    conselhoRelacionamento,
    desejo,
    curiosidadeEspaco,
    curiosidadeHistoria
};

// ── BIO / LEGENDA / SLOGAN ────────────────────────────────
const BIOS = [
    "vivendo um dia de cada vez 🌊",
    "colecionando momentos bons",
    "no meu próprio ritmo",
    "sempre aprendendo algo novo",
    "café, música e paz de espírito"
];

function bioSugestao() {
    return sortearArr(BIOS);
}

const LEGENDAS_FOTO = [
    "momentos assim que valem a pena guardar",
    "sem legenda perfeita, só a foto mesmo",
    "capturando o que as palavras não dizem",
    "um instante, mil lembranças",
    "vivendo essa cena com tudo"
];

function legendaFoto() {
    return sortearArr(LEGENDAS_FOTO);
}

const PREFIXOS_BANDA = ["Os", "As", "Banda", "Coletivo", "Trupe"];
const NOMES_BANDA = ["Marés Elétricas", "Vento Sul", "Noite Cítrica", "Eco Rosa", "Farol Quebrado", "Luz de Néon"];

function nomeDeBanda() {
    return `${sortearArr(PREFIXOS_BANDA)} ${sortearArr(NOMES_BANDA)}`;
}

const ADJ_JOGO = ["Sombras de", "Lenda de", "Crônicas de", "Reino de", "Guerreiros de", "Vale de"];
const TEMA_JOGO = ["Aurora", "Ferro", "Cristal", "Tempestade", "Fênix", "Abismo"];

function nomeDeJogo() {
    return `${sortearArr(ADJ_JOGO)} ${sortearArr(TEMA_JOGO)}`;
}

const MODELOS_SLOGAN = [
    t => `${t}: porque a vida é curta demais pra ficar sem`,
    t => `${t} — simples assim, e funciona`,
    t => `experimenta ${t} uma vez, você não vai querer parar`,
    t => `${t}: feito pra quem não abre mão do essencial`,
    t => `tudo fica melhor com ${t} por perto`
];

function sloganEngracado(tema = "isso aqui") {
    return sortearArr(MODELOS_SLOGAN)(tema);
}

// ── HORÓSCOPO CHINÊS ──────────────────────────────────────
const ANIMAIS_ZODIACO = ["rato", "boi", "tigre", "coelho", "dragão", "serpente", "cavalo", "cabra", "macaco", "galo", "cachorro", "porco"];

function horoscopoChines(anoNascimento) {
    const ano = parseInt(anoNascimento);
    if (!ano || ano < 1900 || ano > 2100) return null;
    const indice = (ano - 4) % 12;
    return ANIMAIS_ZODIACO[indice];
}

// ── NUMEROLOGIA DO NOME (brincadeira) ────────────────────
function numerologiaNome(nome = "") {
    const letras = nome.toLowerCase().replace(/[^a-zà-ú]/g, "");
    if (!letras) return null;

    let soma = letras.split("").reduce((acc, c) => acc + (c.charCodeAt(0) - 96), 0);
    while (soma > 9) {
        soma = String(soma).split("").reduce((acc, d) => acc + Number(d), 0);
    }
    return soma;
}

// ── TESTE DE PERSONALIDADE (brincadeira, sem base científica) ─
const RESULTADOS_PERSONALIDADE = [
    "você é do tipo que pensa antes de agir, bem estrategista",
    "você é puro coração, sente tudo intensamente",
    "você é a pessoa que resolve tudo no bom humor",
    "você é curioso(a) por natureza, sempre perguntando o porquê",
    "você é tranquilo(a) e prefere paz a qualquer confusão",
    "você é aventureiro(a), topa qualquer parada nova"
];

function testePersonalidade() {
    return sortearArr(RESULTADOS_PERSONALIDADE);
}

const PERSONAGENS_ALEATORIOS = [
    "a pessoa engraçada do grupo",
    "quem sempre resolve os perrengues",
    "o(a) sonhador(a) da turma",
    "quem dá os melhores conselhos",
    "o(a) mais animado(a) do rolê",
    "quem sempre chega atrasado(a) mas com desculpa boa"
];

function qualPersonagemSou() {
    return sortearArr(PERSONAGENS_ALEATORIOS);
}

// ── GERADORES CRIATIVOS ───────────────────────────────────
const ADJ_MUSICA = ["Último", "Eterno", "Silencioso", "Distante", "Doce", "Selvagem"];
const TEMA_MUSICA = ["Verão", "Adeus", "Recomeço", "Horizonte", "Segredo", "Instante"];

function gerarTituloDeMusica() {
    return `${sortearArr(ADJ_MUSICA)} ${sortearArr(TEMA_MUSICA)}`;
}

const PREFIXO_PLANETA = ["Xy", "Kel", "Zor", "Ny", "Vex", "Or"];
const SUFIXO_PLANETA = ["-Prime", "-Minor", " IV", " VII", "-Nova", "-Terra"];

function gerarNomeDePlaneta() {
    return `${sortearArr(PREFIXO_PLANETA)}${sortearArr(SUFIXO_PLANETA)}`;
}

// ── CONSELHO DE RELACIONAMENTO (genérico, sem clínica) ───
const CONSELHOS_RELACIONAMENTO = [
    "conversar com calma resolve muito mais do que discutir no calor da hora",
    "ouvir de verdade é tão importante quanto falar",
    "pequenos gestos de carinho no dia a dia fazem toda diferença",
    "respeitar o espaço do outro também é uma forma de cuidado",
    "elogiar sem motivo aparente sempre cai bem"
];

function conselhoRelacionamento() {
    return sortearArr(CONSELHOS_RELACIONAMENTO);
}

// ── DESEJO / FELICITAÇÃO ──────────────────────────────────
const DESEJOS = [
    "que seu dia seja mais leve do que ontem 💙",
    "que as coisas boas cheguem até você em dobro",
    "que você tenha paz mesmo nos dias corridos",
    "que tudo que você plantou comece a florescer",
    "que a sorte esteja sempre um passo à sua frente"
];

function desejo() {
    return sortearArr(DESEJOS);
}

// ── CURIOSIDADES TEMÁTICAS ────────────────────────────────
const CURIOSIDADES_ESPACO = [
    "um dia em vênus dura mais que um ano inteiro em vênus",
    "o sol sozinho representa mais de 99% da massa do sistema solar",
    "a luz do sol demora cerca de 8 minutos pra chegar até a terra",
    "saturno é tão leve que flutuaria se existisse uma banheira gigante",
    "existem mais estrelas no universo do que grãos de areia na terra"
];

function curiosidadeEspaco() {
    return sortearArr(CURIOSIDADES_ESPACO);
}

const CURIOSIDADES_HISTORIA = [
    "a torre eiffel foi construída pra ser temporária e quase foi demolida",
    "cleópatra viveu mais perto da invenção do iphone do que da construção das pirâmides",
    "a segunda guerra mundial terminou oficialmente só em 1990, com um tratado tardio sobre a alemanha",
    "o relógio de pulso só virou popular por causa dos pilotos na primeira guerra mundial",
    "papel higiênico como conhecemos hoje só foi inventado no século 19"
];

function curiosidadeHistoria() {
    return sortearArr(CURIOSIDADES_HISTORIA);
}
