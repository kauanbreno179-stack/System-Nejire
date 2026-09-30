const { criar, rand, pick, chance, fmt, norm, clamp, fmtTempo } = require("./_motor.js");
const $ = "💵";

// ── ITENS ───────────────────────────────────────────────
const ITENS = {}, MERCADO = {}, SHOPPING = {};
const add = (cat, id, n, e, tipo, preco, extra = {}) => {
    ITENS[id] = { n, e, tipo, v: Math.max(1, Math.floor(preco * 0.4)), ...extra };
    if (cat) cat[id] = preco;
};

// bebidas
[["agua", "Água", "💧", 2, { sede: 40 }], ["suco", "Suco", "🧃", 5, { sede: 30, fome: 5, humor: 3 }], ["refrigerante", "Refrigerante", "🥤", 6, { sede: 25, humor: 8 }],
 ["cha", "Chá", "🍵", 4, { sede: 25, humor: 5 }], ["leite", "Leite", "🥛", 4, { sede: 20, fome: 5 }]]
    .forEach(([id, n, e, pr, needs]) => add(MERCADO, id, n, e, "bebida", pr, { ef: { needs } }));
add(MERCADO, "cafe", "Café", "☕", "bebida", 4, { ef: { en: 12, needs: { sede: 10, humor: 3 } } });
add(MERCADO, "energetico", "Energético", "⚡", "bebida", 9, { ef: { en: 25, needs: { sede: 10 } } });
// comidas prontas
[["pao", "Pão", "🍞", 3, { fome: 15 }], ["banana", "Banana", "🍌", 2, { fome: 10 }], ["maca", "Maçã", "🍎", 3, { fome: 12 }],
 ["sanduiche", "Sanduíche", "🥪", 10, { fome: 35, humor: 3 }], ["marmita", "Marmita", "🍱", 15, { fome: 55 }],
 ["hamburguer", "Hambúrguer", "🍔", 22, { fome: 50, humor: 10 }], ["pizza", "Pizza", "🍕", 35, { fome: 65, humor: 15 }],
 ["sushi", "Sushi", "🍣", 45, { fome: 50, humor: 18 }], ["sorvete", "Sorvete", "🍦", 8, { fome: 8, humor: 15, sede: 5 }],
 ["chocolate", "Chocolate", "🍫", 6, { fome: 6, humor: 12 }]]
    .forEach(([id, n, e, pr, needs]) => add(MERCADO, id, n, e, "comida", pr, { ef: { needs } }));
add(MERCADO, "salada", "Salada", "🥗", "comida", 14, { ef: { hp: 3, needs: { fome: 25 } } });
// ingredientes
[["arroz", "Arroz", "🍚", 6], ["feijao", "Feijão", "🫘", 6], ["carne", "Carne", "🥩", 18], ["frango", "Frango", "🍗", 14], ["ovo", "Ovo", "🥚", 4],
 ["macarrao", "Macarrão", "🍝", 7], ["tomate", "Tomate", "🍅", 4], ["queijo", "Queijo", "🧀", 10], ["farinha", "Farinha", "🌾", 5],
 ["alface", "Alface", "🥬", 3], ["batata", "Batata", "🥔", 4], ["cenoura", "Cenoura", "🥕", 3]]
    .forEach(([id, n, e, pr]) => add(MERCADO, id, n, e, "ingrediente", pr));
// higiene / farmácia / pet
add(MERCADO, "sabonete", "Sabonete", "🧼", "item", 3);
add(MERCADO, "remedio", "Remédio", "💊", "remedio", 20, { ef: { hp: 25 } });
add(MERCADO, "curativo", "Curativo", "🩹", "remedio", 8, { ef: { hp: 10 } });
add(MERCADO, "analgesico", "Analgésico", "💉", "remedio", 12, { ef: { hp: 15, needs: { humor: 3 } } });
add(MERCADO, "vitamina", "Vitamina", "🧴", "remedio", 30, { ef: { hp: 10, buff: ["xp", 10, 1800000] } });
add(MERCADO, "racao_cao", "Ração de Cachorro", "🦴", "racao", 8);
add(MERCADO, "racao_gato", "Ração de Gato", "🐟", "racao", 8);
add(MERCADO, "racao_roedor", "Ração de Roedor", "🌰", "racao", 6);
add(MERCADO, "alpiste", "Alpiste", "🌱", "racao", 5);

// pratos caseiros
const pratos = [["omelete", "Omelete", "🍳", { fome: 40, humor: 5 }, 25], ["arroz_feijao", "Arroz com Feijão", "🍛", { fome: 50, humor: 4 }, 22],
    ["macarronada", "Macarronada", "🍝", { fome: 55, humor: 8 }, 30], ["bife_batata", "Bife com Batata", "🥩", { fome: 60, humor: 6 }, 40],
    ["frango_assado", "Frango Assado", "🍗", { fome: 65, humor: 10 }, 45], ["salada_completa", "Salada Completa", "🥗", { fome: 35, humor: 4 }, 24],
    ["sopa", "Sopa Caseira", "🍲", { fome: 55, sede: 15, humor: 6 }, 38], ["pizza_caseira", "Pizza Caseira", "🍕", { fome: 70, humor: 18 }, 50],
    ["bolo_caseiro", "Bolo Caseiro", "🍰", { fome: 30, humor: 22 }, 42], ["lasanha", "Lasanha", "🧆", { fome: 85, humor: 25 }, 70]];
for (const [id, n, e, needs, v] of pratos) add(null, id, n, e, "comida", 0, { ef: { needs, ...(id === "sopa" || id === "salada_completa" ? { hp: 5 } : {}) }, v });
add(null, "prato_queimado", "Prato Queimado", "🔥", "comida", 0, { ef: { needs: { fome: 15, humor: -5 } }, v: 1 });
const RECEITAS = {
    omelete: { i: { ovo: 2, queijo: 1 }, cul: 0 }, arroz_feijao: { i: { arroz: 1, feijao: 1 }, cul: 0 }, macarronada: { i: { macarrao: 1, tomate: 1, queijo: 1 }, cul: 0 },
    salada_completa: { i: { alface: 1, tomate: 1, ovo: 1 }, cul: 0 }, bife_batata: { i: { carne: 1, batata: 1 }, cul: 1 }, frango_assado: { i: { frango: 1, batata: 1, tomate: 1 }, cul: 1 },
    sopa: { i: { batata: 2, frango: 1, tomate: 1 }, cul: 1 }, pizza_caseira: { i: { farinha: 2, queijo: 2, tomate: 1 }, cul: 2 },
    bolo_caseiro: { i: { farinha: 2, ovo: 2, leite: 1 }, cul: 2 }, lasanha: { i: { macarrao: 2, carne: 1, queijo: 2, tomate: 1 }, cul: 3 }
};

// roupas e acessórios (carisma)
[["camiseta", "Camiseta", "👕", 30, 1], ["camisa_social", "Camisa Social", "👔", 120, 3], ["vestido", "Vestido", "👗", 180, 4], ["jaqueta_couro", "Jaqueta de Couro", "🧥", 260, 5],
 ["terno", "Terno", "🤵", 450, 7], ["traje_grife", "Traje de Grife", "🎩", 900, 10]]
    .forEach(([id, n, e, pr, car]) => add(SHOPPING, id, n, e, "roupa", pr, { slot: "roupa", car }));
[["oculos_sol", "Óculos de Sol", "🕶️", 80, 2], ["relogio", "Relógio", "⌚", 150, 3], ["colar", "Colar", "📿", 220, 4], ["bolsa_grife", "Bolsa de Grife", "👜", 600, 7], ["relogio_luxo", "Relógio de Luxo", "⌚", 1500, 10]]
    .forEach(([id, n, e, pr, car]) => add(SHOPPING, id, n, e, "acessorio", pr, { slot: "acessorio", car }));
add(SHOPPING, "perfume", "Perfume", "🌸", "consumivel", 60, { ef: { buff: ["car", 5, 3600000], msg: "✨ você tá cheirosíssimo(a)!" } });
// eletrônicos
add(SHOPPING, "celular", "Celular", "📱", "eletronico", 800);
add(SHOPPING, "computador", "Computador", "💻", "eletronico", 1800);
add(SHOPPING, "console", "Videogame", "🎮", "eletronico", 1400);
add(SHOPPING, "fone", "Fone de Ouvido", "🎧", "eletronico", 150);
// hobbies
add(SHOPPING, "violao", "Violão", "🎸", "hobby", 350);
add(SHOPPING, "vara_pesca", "Vara de Pescar", "🎣", "hobby", 120);
add(SHOPPING, "tenis", "Tênis de Corrida", "👟", "hobby", 180);
add(SHOPPING, "tela", "Tela em Branco", "🖼️", "hobby", 25, { v: 5 });
add(SHOPPING, "tinta", "Tinta", "🎨", "hobby", 30, { v: 6 });
// livros
[["livro_negocios", "Livro de Negócios", "📘", 60, "logica"], ["livro_culinaria", "Livro de Culinária", "📙", 60, "culinaria"], ["livro_programacao", "Livro de Programação", "📗", 90, "tecnologia"],
 ["livro_arte", "Livro de Arte", "📕", 60, "criatividade"], ["livro_treino", "Guia de Treino", "📓", 60, "fisico"], ["livro_autoajuda", "Livro de Autoajuda", "📔", 40, "social"]]
    .forEach(([id, n, e, pr, hab]) => add(SHOPPING, id, n, e, "livro", pr, { hab }));
// móveis (conf = conforto, cama = multiplicador de sono)
add(SHOPPING, "cama_solteiro", "Cama de Solteiro", "🛏️", "movel", 300, { conf: 1, cama: 1.15 });
add(SHOPPING, "cama_casal", "Cama de Casal", "🛌", "movel", 800, { conf: 2, cama: 1.3 });
add(SHOPPING, "cama_king", "Cama King Size", "👑", "movel", 2000, { conf: 3, cama: 1.5 });
add(SHOPPING, "sofa", "Sofá", "🛋️", "movel", 450, { conf: 2 });
add(SHOPPING, "tv", "TV", "📺", "movel", 700, { conf: 2 });
add(SHOPPING, "fogao", "Fogão", "🔥", "movel", 500, { conf: 1 });
add(SHOPPING, "geladeira", "Geladeira", "🧊", "movel", 900, { conf: 2 });
add(SHOPPING, "estante", "Estante", "📚", "movel", 250, { conf: 1 });
add(SHOPPING, "mesa_estudo", "Mesa de Estudo", "🪑", "movel", 200, { conf: 1 });
add(SHOPPING, "ar_condicionado", "Ar-Condicionado", "❄️", "movel", 1200, { conf: 3 });
add(SHOPPING, "planta", "Planta Decorativa", "🪴", "movel", 60, { conf: 1 });
add(null, "colchao", "Colchão no Chão", "🛏️", "movel", 0, { conf: 0, cama: 1, v: 5 });
// vendáveis (pesca, arte)
[["peixe_tilapia", "Tilápia", "🐟", 12], ["peixe_robalo", "Robalo", "🐠", 25], ["peixe_dourado", "Dourado", "🐡", 60], ["caranguejo", "Caranguejo", "🦀", 18], ["bota_velha", "Bota Velha", "🥾", 1],
 ["quadro_simples", "Quadro Simples", "🖼️", 60], ["quadro_bom", "Quadro Bonito", "🖼️", 200], ["quadro_obra", "Obra-Prima", "🖼️", 700], ["flor_jardim", "Flores do Jardim", "💐", 15]]
    .forEach(([id, n, e, v]) => add(null, id, n, e, "material", 0, { v }));
// jardim
add(MERCADO, "semente_horta", "Sementes de Horta", "🌱", "semente", 6);
add(MERCADO, "semente_flor", "Sementes de Flor", "🌷", "semente", 8);
add(MERCADO, "semente_tomate", "Sementes de Tomate", "🍅", "semente", 7);

const CATS_SHOP = {
    roupas: ["camiseta", "camisa_social", "vestido", "jaqueta_couro", "terno", "traje_grife"],
    acessorios: ["oculos_sol", "relogio", "colar", "bolsa_grife", "relogio_luxo", "perfume"],
    eletronicos: ["celular", "computador", "console", "fone"],
    hobbies: ["violao", "vara_pesca", "tenis", "tela", "tinta"],
    livros: ["livro_negocios", "livro_culinaria", "livro_programacao", "livro_arte", "livro_treino", "livro_autoajuda"],
    moveis: ["cama_solteiro", "cama_casal", "cama_king", "sofa", "tv", "fogao", "geladeira", "estante", "mesa_estudo", "ar_condicionado", "planta"]
};

// ── SISTEMAS DO JOGO ────────────────────────────────────
const NEEDS = { fome: { e: "🍔", n: "fome" }, sede: { e: "💧", n: "sede" }, higiene: { e: "🚿", n: "higiene" }, humor: { e: "😊", n: "humor" }, social: { e: "👥", n: "social" } };
const HAB = { logica: { n: "Lógica", e: "🧠" }, criatividade: { n: "Criatividade", e: "🎨" }, fisico: { n: "Físico", e: "💪" }, social: { n: "Social", e: "🗣️" }, culinaria: { n: "Culinária", e: "🍳" }, tecnologia: { n: "Tecnologia", e: "💻" } };
const nd = (p, d) => { for (const [k, v] of Object.entries(d || {})) if (p.x.n[k] !== undefined) p.x.n[k] = clamp(p.x.n[k] + v, 0, 100); };
const bem = (p) => Object.values(p.x.n).reduce((s, v) => s + v, 0) / 500;
const efic = (p) => 0.6 + 0.6 * bem(p);
const habLv = (p, k) => Math.floor(Math.sqrt(((p.x.hab || {})[k] || 0) / 4));
const habAdd = (p, k, n) => { const a = habLv(p, k); p.x.hab[k] = (p.x.hab[k] || 0) + n; const b = habLv(p, k); return b > a ? `\n📈 *${HAB[k].n}* subiu pro nível ${b}!` : ""; };
const txtNeeds = (d, v = 1) => Object.entries(d).map(([k, n]) => `${NEEDS[k].e} ${n * v > 0 ? "+" : ""}${n * v}`).join(" · ");

const BASES = [
    { n: "Quarto Alugado", e: "🚪", custo: 0, nv: 1, conta: 1, jardim: 1 }, { n: "Kitnet", e: "🏢", custo: 1200, nv: 3, conta: 2, jardim: 1 },
    { n: "Apartamento", e: "🏬", custo: 5000, nv: 6, conta: 4, jardim: 2 }, { n: "Casa Simples", e: "🏠", custo: 14000, nv: 10, conta: 7, jardim: 3 },
    { n: "Casa com Quintal", e: "🏡", custo: 30000, nv: 14, conta: 10, jardim: 5 }, { n: "Cobertura", e: "🌆", custo: 70000, nv: 19, conta: 18, jardim: 5 },
    { n: "Mansão", e: "🏰", custo: 160000, nv: 25, conta: 35, jardim: 8 }
];
const CARGO_MULT = [1, 1.5, 2.2, 3.2];
const CARGO_TURNOS = [5, 12, 25];
const mk = (n, e, pago, hab, req, cargos) => ({ n, e, pago, hab, req, cargos });
const EMPREGOS = {
    entregador: mk("Entregador de App", "🛵", 32, "fisico", {}, ["Entregador", "Entregador Pro", "Líder de Frota", "Coordenador Logístico"]),
    caixa: mk("Operador de Caixa", "🛒", 36, "social", {}, ["Caixa", "Caixa Sênior", "Supervisor de Loja", "Gerente de Loja"]),
    garcom: mk("Garçom", "🍽️", 42, "social", { hab: { social: 1 } }, ["Garçom", "Garçom Chefe", "Maître", "Gerente de Restaurante"]),
    atendente: mk("Atendente de Call Center", "🎧", 45, "social", { hab: { social: 1 } }, ["Atendente", "Atendente Sênior", "Supervisor", "Gerente de Operações"]),
    cozinheiro: mk("Cozinheiro", "👨‍🍳", 55, "culinaria", { hab: { culinaria: 2 } }, ["Auxiliar de Cozinha", "Cozinheiro", "Sous-Chef", "Chef Executivo"]),
    personal: mk("Personal Trainer", "🏋️", 60, "fisico", { hab: { fisico: 3 } }, ["Estagiário", "Personal", "Coach", "Dono de Academia"]),
    programador: mk("Programador", "💻", 95, "tecnologia", { dipl: "tecnico_ti" }, ["Júnior", "Pleno", "Sênior", "Tech Lead"]),
    professor: mk("Professor", "👩‍🏫", 80, "social", { dipl: "pedagogia" }, ["Professor", "Coordenador", "Vice-Diretor", "Diretor"]),
    enfermeiro: mk("Enfermeiro", "🩺", 85, "fisico", { dipl: "enfermagem" }, ["Técnico", "Enfermeiro", "Enfermeiro Chefe", "Diretor Clínico"]),
    designer: mk("Designer", "🎨", 75, "criatividade", { dipl: "design" }, ["Designer Jr", "Designer", "Designer Sênior", "Diretor de Arte"]),
    empresario: mk("Empresário", "📈", 150, "logica", { dipl: "administracao", nv: 12 }, ["Analista", "Gerente", "Diretor", "CEO"]),
    advogado: mk("Advogado", "⚖️", 130, "logica", { dipl: "direito" }, ["Associado", "Advogado Pleno", "Sócio", "Sócio-Fundador"]),
    medico: mk("Médico", "👨‍⚕️", 190, "logica", { dipl: "medicina" }, ["Residente", "Médico", "Especialista", "Diretor de Hospital"])
};
const CURSOS = {
    tecnico_ti: { n: "Técnico em Informática", e: "💻", custo: 300, aulas: 8, hab: "tecnologia", nv: 2 },
    pedagogia: { n: "Pedagogia", e: "📚", custo: 600, aulas: 14, hab: "social", nv: 4 },
    enfermagem: { n: "Enfermagem", e: "🩺", custo: 700, aulas: 14, hab: "fisico", nv: 4 },
    design: { n: "Design Gráfico", e: "🎨", custo: 600, aulas: 12, hab: "criatividade", nv: 3 },
    administracao: { n: "Administração", e: "📊", custo: 900, aulas: 16, hab: "logica", nv: 6 },
    direito: { n: "Direito", e: "⚖️", custo: 1600, aulas: 22, hab: "logica", nv: 10 },
    medicina: { n: "Medicina", e: "🧑‍⚕️", custo: 3500, aulas: 32, hab: "logica", nv: 15 }
};
const NPCS = {
    marcos: { n: "Marcos (vizinho)", e: "🧑‍🔧" }, ana: { n: "Ana (barista)", e: "👩‍🍳" }, joao: { n: "João (treinador)", e: "🏃" }, lucia: { n: "Dona Lúcia (mercado)", e: "👵" },
    pedro: { n: "Pedro (colega de faculdade)", e: "🎓" }, carla: { n: "Carla (artista)", e: "👩‍🎨" }, rafa: { n: "Rafa (gamer)", e: "🎮" }, silva: { n: "Prof. Silva", e: "👨‍🏫" }
};
const ROMANCES = [{ n: "Lucas", e: "🧔" }, { n: "Camila", e: "👩" }, { n: "Rafael", e: "👨" }, { n: "Beatriz", e: "👩‍🦰" }, { n: "Thiago", e: "🧑" }, { n: "Julia", e: "👱‍♀️" }];
const CAMA = ["colchao", "cama_solteiro", "cama_casal", "cama_king"];
const HAB_PERS = { extrovertido: "social", estudioso: "logica", criativo: "criatividade", esportista: "fisico", gourmet: "culinaria", nerd: "tecnologia" };

// ── CONFIG ──────────────────────────────────────────────
const M = criar({
    id: "vida", pf: "vd", titulo: "Simulador de Vida", emoji: "🏙️",
    moeda: { n: "reais", e: $ }, itens: ITENS,
    inicio: { hp: 100, en: 100, atk: 0, def: 0, moeda: 200, inv: { colchao: 1, sabonete: 5, agua: 2, pao: 2, marmita: 1, celular: 1 } },
    nivelGanho: { hp: 2, en: 2, atk: 0, def: 0 },
    regen: { hp: 180000, en: 100000 },
    localInicial: "casa", cmdDescanso: "dormir", cmdMelhorar: "mudar", cmdAdotar: "adotar", cmdLocais: "locais", cmdPlantacao: "plantacao", tituloLocais: "lugares da cidade",
    slotsPlantio: (p) => [1, 1, 2, 3, 5, 5, 8][p.base],
    morte: { perda: 0.1, txt: ["🚑 você desmaiou de cansaço e acordou no hospital!", "🚑 passou mal e foi levado(a) às pressas pro pronto-socorro."] },
    boasVindas: "🏙️ você chegou na cidade com R$ 200, um colchão no chão e muita vontade de vencer. arrume um emprego, cuide de si e construa sua vida!",
    tipos: { comida: "🍽️ comidas", bebida: "🥤 bebidas", ingrediente: "🥕 ingredientes", remedio: "💊 remédios", roupa: "👕 roupas", acessorio: "⌚ acessórios", eletronico: "📱 eletrônicos", movel: "🛋️ móveis", livro: "📚 livros", hobby: "🎸 hobbies", consumivel: "✨ consumíveis", material: "🧺 vendáveis", item: "📦 itens", racao: "🐾 pet", semente: "🌱 sementes" },
    locais: {
        casa: { n: "Casa", e: "🏠", d: "seu cantinho. hora de descansar e cozinhar.", nv: 1, en: 2 },
        centro: { n: "Centro", e: "🏙️", d: "lojas, academia e muito movimento.", nv: 1, en: 2 },
        parque: { n: "Parque", e: "🌳", d: "ar puro, corrida e passeios com pets.", nv: 1, en: 2 },
        praia: { n: "Praia", e: "🏖️", d: "sol, mar e boas pescarias.", nv: 1, en: 2 },
        shopping: { n: "Shopping", e: "🛍️", d: "cinema, praça de alimentação e compras.", nv: 1, en: 2 },
        universidade: { n: "Universidade", e: "🎓", d: "estudar aqui rende mais!", nv: 2, en: 2 },
        hospital: { n: "Hospital", e: "🏥", d: "cuidando da saúde.", nv: 1, en: 2 },
        balada: { n: "Balada", e: "🪩", d: "música alta e gente nova.", nv: 3, en: 2 }
    },
    conquistas: [
        { id: "emprego", n: "Primeiro emprego", d: "trabalhe pela primeira vez", ok: p => (p.stats.trabalhou || 0) >= 1, moeda: 50 },
        { id: "trabalhador", n: "Trabalhador(a) exemplar", d: "trabalhe 50 turnos", ok: p => (p.stats.trabalhou || 0) >= 50, moeda: 300 },
        { id: "formado", n: "Formado(a)!", d: "conquiste um diploma", ok: p => (p.stats.formou || 0) >= 1, moeda: 300 },
        { id: "leitor", n: "Rato de biblioteca", d: "leia 20 vezes", ok: p => (p.stats.leu || 0) >= 20, moeda: 120 },
        { id: "chef", n: "Chef de cozinha", d: "cozinhe 25 vezes", ok: p => (p.stats.cozinhou || 0) >= 25, moeda: 150 },
        { id: "fitness", n: "Vida fitness", d: "se exercite 20 vezes", ok: p => (p.stats.exercicio || 0) >= 20, moeda: 150 },
        { id: "socialite", n: "Socialite", d: "faça 4 amigos", ok: p => amigos(p) >= 4, moeda: 200 },
        { id: "romantico", n: "Coração batendo", d: "comece um namoro", ok: p => (p.stats.namorou || 0) >= 1, moeda: 150 },
        { id: "casado", n: "Até que a morte...", d: "case-se", ok: p => (p.stats.casou || 0) >= 1, moeda: 500 },
        { id: "familia", n: "Família completa", d: "tenha um filho", ok: p => (p.stats.filho || 0) >= 1, moeda: 400 },
        { id: "investidor", n: "Investidor(a)", d: "invista 3 vezes", ok: p => (p.stats.investiu || 0) >= 3, moeda: 200 },
        { id: "casa", n: "Casa própria", d: "chegue numa Casa Simples", ok: p => p.base >= 3, moeda: 400 },
        { id: "artista", n: "Artista de rua", d: "pinte 10 quadros", ok: p => (p.stats.pintou || 0) >= 10, moeda: 200 },
        { id: "pescador", n: "Pescador(a) nato(a)", d: "pesque 15 vezes", ok: p => (p.stats.pescou || 0) >= 15, moeda: 150 },
        { id: "rico", n: "Independência financeira", d: "junte R$ 20.000", ok: p => p.moeda + p.banco >= 20000, moeda: 1000 },
        { id: "nivel20", n: "Veterano(a) da vida", d: "chegue ao nível 20", ok: p => p.nivel >= 20, moeda: 600 }
    ],
    missoes: [
        { d: "trabalhe 3 turnos", stat: "trabalhou", meta: 3, moeda: 60, xp: 30 },
        { d: "estude 3 vezes", stat: "estudou", meta: 3, moeda: 50, xp: 30 },
        { d: "cozinhe 2 pratos", stat: "cozinhou", meta: 2, moeda: 45, xp: 25, item: ["ovo", 4] },
        { d: "socialize 3 vezes", stat: "socializou", meta: 3, moeda: 50, xp: 30 },
        { d: "se exercite 2 vezes", stat: "exercicio", meta: 2, moeda: 55, xp: 30 },
        { d: "faça 3 refeições", stat: "usou_comida", meta: 3, moeda: 40, xp: 20 },
        { d: "faça 2 bicos", stat: "bicos", meta: 2, moeda: 60, xp: 30 },
        { d: "curta 3 momentos de lazer", stat: "lazer", meta: 3, moeda: 50, xp: 25 },
        { d: "durma uma vez", stat: "dormiu", meta: 1, moeda: 35, xp: 20 }
    ],
    historia: [
        { t: "Chegando na Cidade", d: "faça 3 compras.", stat: "compras", meta: 3, moeda: 100, xp: 40 },
        { t: "Primeiro Emprego", d: "trabalhe 3 turnos.", stat: "trabalhou", meta: 3, moeda: 150, xp: 60 },
        { t: "Salário no Bolso", d: "receba seu salário.", stat: "salarios", meta: 1, moeda: 150, xp: 60 },
        { t: "Rede de Contatos", d: "socialize 6 vezes.", stat: "socializou", meta: 6, moeda: 200, xp: 80 },
        { t: "Volta aos Estudos", d: "estude 8 vezes.", stat: "estudou", meta: 8, moeda: 250, xp: 100 },
        { t: "Diploma na Mão", d: "conquiste um diploma.", stat: "formou", meta: 1, moeda: 500, xp: 200 },
        { t: "Subindo na Carreira", d: "consiga uma promoção.", stat: "promocoes", meta: 1, moeda: 500, xp: 200 },
        { t: "Lar Doce Lar", d: "mude de casa 2 vezes.", stat: "mudancas", meta: 2, moeda: 800, xp: 250 },
        { t: "Amor à Vista", d: "comece um namoro.", stat: "namorou", meta: 1, moeda: 600, xp: 200 },
        { t: "Fazendo o Dinheiro Render", d: "invista 2 vezes.", stat: "investiu", meta: 2, moeda: 700, xp: 250 },
        { t: "Uma Nova Família", d: "tenha um filho.", stat: "filho", meta: 1, moeda: 1200, xp: 400 },
        { t: "Vida Realizada", d: "acumule R$ 20.000 em ganhos totais.", stat: "ganhou", meta: 20000, moeda: 3000, xp: 1000 }
    ],
    pets: {
        cachorro: { n: "Cachorro", e: "🐶", atk: 0, custo: { moeda: 150 }, dieta: ["racao_cao"] },
        gato: { n: "Gato", e: "🐱", atk: 0, custo: { moeda: 120 }, dieta: ["racao_gato"] },
        coelho: { n: "Coelho", e: "🐰", atk: 0, custo: { moeda: 90 }, dieta: ["cenoura", "alface"] },
        hamster: { n: "Hamster", e: "🐹", atk: 0, custo: { moeda: 60 }, dieta: ["racao_roedor"] },
        papagaio: { n: "Papagaio", e: "🦜", atk: 0, custo: { moeda: 250 }, dieta: ["alpiste"], nv: 5 },
        tartaruga: { n: "Tartaruga", e: "🐢", atk: 0, custo: { moeda: 100 }, dieta: ["alface"] }
    },
    extras: () => ({
        n: { fome: 80, sede: 80, higiene: 80, humor: 80, social: 60 },
        hab: { logica: 0, criatividade: 0, fisico: 0, social: 0, culinaria: 0, tecnologia: 0 },
        emprego: null, cargo: 0, turnosCargo: 0, pend: 0, dipl: [], curso: null, divida: 0,
        aplic: { fixa: { v: 0, t: 0 }, acoes: { v: 0, t: 0 } }, contas: 0, npcs: {}, par: null, crush: null, filhos: []
    }),
    aoCriar: (p, esc) => { const k = HAB_PERS[esc.personalidade]; if (k) p.x.hab[k] += 8; },
    aplicarNeeds: (p, needs) => nd(p, needs),
    txtNeeds,
    tick: (p, ms) => {
        const min = Math.min(ms / 60000, 240), h = Math.min(ms / 3600000, 72);
        const alegre = p.pets.length && p.pets.reduce((s, x) => s + x.afeto, 0) / p.pets.length > 60;
        nd(p, { fome: -0.22 * min, sede: -0.3 * min, higiene: -0.12 * min, humor: -0.16 * min * (alegre ? 0.7 : 1), social: -0.08 * min });
        if (p.x.n.fome < 10 || p.x.n.sede < 10) p.hp = Math.max(1, p.hp - Math.ceil(min * 0.15));
        if (p.x.divida > 0) p.x.divida = Math.round(p.x.divida * (1 + 0.004 * h));
        p.x.contas = Math.round(Math.min(p.x.contas + BASES[p.base].conta * Math.min(h, 48), BASES[p.base].conta * 72));
        for (const f of p.x.filhos) f.amor = Math.max(0, f.amor - 0.05 * min);
    },
    statusExtra: (p, M) => [
        ...Object.entries(NEEDS).map(([k, d]) => `${d.e} ${d.n}: ${M.barra(p.x.n[k], 100, 8)} ${Math.round(p.x.n[k])}%`),
        p.x.divida > 0 ? `🏦 dívida: ${$} ${fmt(p.x.divida)}` : null,
        p.x.contas > 0 ? `🧾 contas: ${$} ${fmt(p.x.contas)}` : null
    ].filter(Boolean),
    perfilExtra: (p) => [
        `💼 ${p.x.emprego ? `${EMPREGOS[p.x.emprego].e} ${EMPREGOS[p.x.emprego].cargos[p.x.cargo]}` : "desempregado(a)"}${p.x.curso ? ` · 📚 cursando ${CURSOS[p.x.curso.id].n}` : ""}`,
        `🎓 diplomas: ${p.x.dipl.length ? p.x.dipl.map(d => CURSOS[d].n).join(", ") : "nenhum"}`,
        `${BASES[p.base].e} moradia: ${BASES[p.base].n}`,
        `💞 ${p.x.par ? `${p.x.par.status} com ${p.x.par.nome}` : "solteiro(a)"}${p.x.filhos.length ? ` · 👶 ${p.x.filhos.length} filho(s)` : ""}`
    ]
});
const { def } = M;
const car = (p) => 1 + habLv(p, "social") + M.buff(p, "car") + Object.values(p.equip).reduce((s, id) => s + ((ITENS[id] && ITENS[id].car) || 0), 0);
const amigos = (p) => Object.values(p.x.npcs || {}).filter(v => v >= 50).length;
const conforto = (p) => Object.keys(p.inv).reduce((s, id) => s + ((ITENS[id] && ITENS[id].conf) || 0), 0);
const camaMult = (p) => CAMA.reduce((m, id) => (p.inv[id] ? Math.max(m, ITENS[id].cama) : m), 0.9);
const ganha = (p, v) => { p.moeda += v; M.stat(p, "ganhou", v); };
const contasAtrasadas = (p) => p.x.contas > BASES[p.base].conta * 36;
const semSaude = (p) => p.hp < 5 ? `💔 você tá muito mal! vá ao médico (${"vdmedico"}) ou descanse.` : null;

// helper de lazer/atividade paga
const lazer = (s) => (a) => {
    const p = a.p, chave = s.chave;
    if (s.nv && p.nivel < s.nv) return `🔒 precisa ser nível *${s.nv}*.`;
    const el = M.exigeLocal(p, s.local); if (el) return el;
    if (s.requer && !M.tem(p, s.requer)) return `🎒 você precisa ter: ${M.txtItens(s.requer)}`;
    if (s.algum && !s.algum.some(i => M.qtd(p, i))) return `🎒 você precisa de: ${s.algum.map(M.nome).join(" ou ")}`;
    if (s.consome && !M.tem(p, s.consome)) return `🎒 faltam: ${M.falta(p, s.consome)}`;
    if (p.en < s.en) return `⚡ energia insuficiente (${Math.round(p.en)}/${s.en}). durma ou tome um café!`;
    if (p.moeda < (s.custo || 0)) return `💸 isso custa ${$} ${fmt(s.custo)}.`;
    const f = M.cd(p, chave); if (f) return M.msgCd(f);
    p.en -= s.en; p.moeda -= s.custo || 0; M.setCd(p, chave, s.cd);
    if (s.consome) M.rem(p, s.consome);
    M.stat(p, s.stat || chave); M.stat(p, "lazer"); if (s.exercicio) M.stat(p, "exercicio");
    nd(p, s.needs);
    const linhas = [`${s.e} *${s.titulo}*`, pick(s.frases)];
    if (s.custo) linhas.push(`💸 -${$} ${fmt(s.custo)}`);
    let extra = "";
    if (s.hab) extra += habAdd(p, s.hab[0], s.hab[1]);
    if (s.hpMax && (p.stats[s.stat || chave] % s.hpMax[0] === 0)) { p.hpMax += s.hpMax[1]; p.hp += s.hpMax[1]; linhas.push(`❤️ saúde máxima +${s.hpMax[1]}!`); }
    if (s.pool && chance(s.chanceEv ?? 1)) {
        const total = s.pool.reduce((t, e) => t + (e.w || 1), 0); let r = Math.random() * total, ev = s.pool[0];
        for (const e of s.pool) { r -= e.w || 1; if (r <= 0) { ev = e; break; } }
        linhas.push(ev.t);
        if (ev.moeda) { const g = Array.isArray(ev.moeda) ? rand(...ev.moeda) : ev.moeda; if (g >= 0) { ganha(p, g); linhas.push(`${$} +${fmt(g)}`); } else { const l = Math.min(p.moeda, -g); p.moeda -= l; linhas.push(`${$} -${fmt(l)}`); } }
        if (ev.hp) { p.hp = clamp(p.hp + ev.hp, 0, p.hpMax); linhas.push(`❤️ ${ev.hp > 0 ? "+" : ""}${ev.hp}`); }
        if (ev.needs) { nd(p, ev.needs); linhas.push(txtNeeds(ev.needs)); }
        if (ev.item) { M.add(p, ev.item[0], ev.item[1]); linhas.push(`🎁 ${ev.item[1]}x ${M.nome(ev.item[0])}`); }
        if (ev.drops) { const got = M.rolar(p, ev.drops); if (Object.keys(got).length) linhas.push(`🎁 ${M.txtItens(got)}`); }
        if (ev.carteira) { const l = Math.min(p.moeda, Math.floor(p.moeda * 0.08) + 5); p.moeda -= l; linhas.push(`🕵️ furtaram ${$} ${fmt(l)} da sua carteira!`); }
        if (ev.pts) { const k = pick(Object.keys(NPCS)); p.x.npcs[k] = (p.x.npcs[k] || 0) + ev.pts; linhas.push(`👥 você se aproximou de ${NPCS[k].n}`); }
    }
    if (s.aoFim) { const t = s.aoFim(p); if (t) linhas.push(t); }
    if (p.hp <= 0) return `${linhas.join("\n")}\n${M.morrer(p)}`;
    linhas.push(`${txtNeeds(s.needs || {})}`.trim());
    linhas.push(M.rodape(p));
    return linhas.filter(Boolean).join("\n") + extra + M.ganharXp(p, s.xp || 8);
};

// ═══════════ SISTEMA (10) ═══════════
def("comecar", M.fnComecar([{ k: "personalidade", ops: {
    extrovertido: { d: "🗣️ sociável (+8 social)" }, estudioso: { d: "🧠 focado (+8 lógica)" }, criativo: { d: "🎨 imaginativo (+8 criatividade)" },
    esportista: { d: "💪 atlético (+8 físico, +10 saúde)", bonus: { hp: 10 } }, gourmet: { d: "🍳 chef nato (+8 culinária)" }, nerd: { d: "💻 tech (+8 tecnologia)" } } }]), { livre: true });
def("perfil", M.fnPerfil());
def("status", M.fnStatus());
def("inv", M.fnInv());
def("equip", M.fnEquip());
def("equipar", M.fnEquipar());
def("desequipar", M.fnDesequipar());
def("ranking", M.fnRanking(), { livre: true });
def("resetar", M.fnResetar());
const SECOES = [
    { t: "⚙️ sistema", c: ["comecar", "perfil", "status", "inv", "equip", "equipar", "desequipar", "ajuda", "ranking", "resetar"] },
    { t: "📈 progresso", c: ["diario", "missoes", "historia", "conquistas", "locais", "ir", "dica"] },
    { t: "🫀 necessidades", c: ["necessidades", "comer", "beber", "banho", "dormir", "cozinhar", "medico"] },
    { t: "💼 carreira", c: ["empregos", "candidatar", "trabalhar", "horaextra", "promocao", "salario", "demitir", "bico", "curriculo"] },
    { t: "🎓 estudos", c: ["cursos", "matricular", "estudar", "prova", "ler", "habilidades"] },
    { t: "🏦 finanças", c: ["saldo", "depositar", "sacar", "emprestimo", "pagar", "investir", "resgatar", "apostar"] },
    { t: "🏠 casa & jardim", c: ["casa", "mudar", "mobiliar", "contas", "plantar", "colher", "plantacao"] },
    { t: "🛒 compras", c: ["mercado", "shopping", "comprar", "vender", "usar", "descartar", "presentear", "transferir"] },
    { t: "💞 social & família", c: ["socializar", "festa", "paquerar", "encontro", "namorar", "terminar", "casar", "divorciar", "relacionamento", "filho", "cuidarfilho", "familia"] },
    { t: "🐾 pets", c: ["adotar", "pets", "alimentarpet", "brincarpet"] },
    { t: "🎉 lazer", c: ["academia", "correr", "cinema", "balada", "pescar", "jogar", "tocar", "pintar"] }
];
def("ajuda", M.fnAjuda(SECOES), { livre: true });

// ═══════════ PROGRESSO (7) ═══════════
def("diario", M.fnDiario({ moeda: [80, 140], itens: [["marmita", 1, 2], ["agua", 1, 2]], xp: 20 }));
def("missoes", M.fnMissoes());
def("historia", M.fnHistoria());
def("conquistas", M.fnConquistas());
def("locais", M.fnLocais());
def("ir", M.fnViajar());
def("dica", M.fnTexto(["💡 mantenha suas necessidades altas: trabalhar com fome paga só metade!", "💡 estudar na universidade rende 25% a mais.", "💡 amigos aumentam sua renda em até 10%.", "💡 pague as contas em dia ou você dorme mal (sem luz!).", "💡 emprestimo tem juros diários — pague rápido.", "💡 cama melhor = sono mais reparador.", "💡 cozinhar em casa é bem mais barato que pedir comida.", "💡 pets felizes deixam seu humor cair mais devagar.", "💡 investir em renda fixa é seguro; ações rendem mais, mas arriscam.", "💡 use *vdcurriculo* pra ver quais empregos você já pode pegar."]));

// ═══════════ NECESSIDADES (7) ═══════════
def("necessidades", (a) => {
    const p = a.p;
    const linhas = Object.entries(NEEDS).map(([k, d]) => { const v = Math.round(p.x.n[k]); return `${d.e} ${d.n}: ${M.barra(v, 100)} ${v}%${v < 25 ? " ⚠️" : ""}`; });
    const dicas = [];
    if (p.x.n.fome < 30) dicas.push(`🍔 coma algo: ${a.cmd("comer")}`);
    if (p.x.n.sede < 30) dicas.push(`💧 beba algo: ${a.cmd("beber")}`);
    if (p.x.n.higiene < 30) dicas.push(`🚿 tome banho: ${a.cmd("banho")}`);
    if (p.x.n.humor < 30) dicas.push(`🎉 se divirta: ${a.cmd("cinema")}, ${a.cmd("jogar")}...`);
    if (p.x.n.social < 30) dicas.push(`👥 socialize: ${a.cmd("socializar")}`);
    return M.box("necessidades", [...linhas, ``, `✨ bem-estar: ${Math.round(bem(p) * 100)}% (eficiência x${efic(p).toFixed(2)})`, ...dicas]);
});
def("comer", (a) => { a.usoNome = "comer"; return M.fnUsar(["comida"])(a); });
def("beber", (a) => { a.usoNome = "beber"; return M.fnUsar(["bebida"])(a); });
def("banho", (a) => {
    const p = a.p;
    const f = M.cd(p, "banho"); if (f) return M.msgCd(f);
    if (p.x.n.higiene >= 90) return `🚿 você já tá cheirosinho(a)!`;
    const sab = M.qtd(p, "sabonete") > 0;
    if (sab) M.add(p, "sabonete", -1);
    M.setCd(p, "banho", 480000);
    const g = sab ? 70 : 35;
    nd(p, { higiene: g, humor: sab ? 6 : 2 });
    M.stat(p, "banhos");
    return `🚿 ${sab ? "banho completo com sabonete!" : "banho rapidinho (sem sabonete rende menos)."}\n${txtNeeds({ higiene: g, humor: sab ? 6 : 2 })}`;
});
def("dormir", (a) => {
    const p = a.p;
    const f = M.cd(p, "dormir"); if (f) return M.msgCd(f);
    if (p.en >= p.enMax * 0.9 && p.hp >= p.hpMax * 0.9) return `😴 você não tá com sono nenhum! (energia e saúde já estão altas)`;
    let mult = camaMult(p) + 0.05 * p.base + 0.02 * conforto(p);
    const atras = contasAtrasadas(p);
    if (atras) mult *= 0.7;
    const en = Math.ceil(p.enMax * 0.55 * mult), hp = Math.ceil(p.hpMax * 0.3 * mult);
    p.en = Math.min(p.enMax, p.en + en); p.hp = Math.min(p.hpMax, p.hp + hp);
    nd(p, { humor: 8 + conforto(p), fome: -12, sede: -12, higiene: -6 });
    M.setCd(p, "dormir", 1500000); M.stat(p, "dormiu");
    return `😴 você dormiu ${mult >= 1.3 ? "como um bebê" : "o que deu"}!\n⚡ +${en} energia · ❤️ +${hp} saúde${atras ? `\n🕯️ *contas atrasadas!* cortaram a luz e você dormiu mal (${a.cmd("contas")})` : ""}\n${M.rodape(p)}${M.ganharXp(p, 6)}`;
});
def("cozinhar", (a) => {
    const p = a.p;
    const id = M.achar(a.q.replace(/\s+\d+$/, ""));
    if (!id || !RECEITAS[id]) return M.box("receitas", [...Object.entries(RECEITAS).map(([k, r]) => `${M.nome(k)} ← ${M.txtItens(r.i)}${r.cul ? ` (culinária ${r.cul})` : ""}`), `🔥 precisa de um fogão!`, `use ${a.cmd("cozinhar")} <prato>`]);
    const r = RECEITAS[id];
    if (!M.qtd(p, "fogao")) return `🔥 você precisa de um *Fogão* (${a.cmd("shopping")} moveis).`;
    if (habLv(p, "culinaria") < r.cul) return `🔒 precisa de culinária nível ${r.cul}.`;
    if (!M.tem(p, r.i)) return `🥕 faltam: ${M.falta(p, r.i)}`;
    if (p.en < 6) return `⚡ energia insuficiente (6).`;
    const f = M.cd(p, "cozinhar"); if (f) return M.msgCd(f);
    M.setCd(p, "cozinhar", 120000); p.en -= 6; M.rem(p, r.i);
    const queima = clamp(0.3 - habLv(p, "culinaria") * 0.06, 0.02, 0.3);
    M.stat(p, "cozinhou");
    if (chance(queima)) { M.add(p, "prato_queimado", 1); return `🔥 ai não! você queimou o(a) ${ITENS[id].n}...\n🎁 1x ${M.nome("prato_queimado")}${habAdd(p, "culinaria", 1)}${M.ganharXp(p, 3)}`; }
    M.add(p, id, 1);
    return `👨‍🍳 você preparou ${M.nome(id)}! (${txtNeeds(ITENS[id].ef.needs)})${habAdd(p, "culinaria", 2)}${M.ganharXp(p, 8)}`;
});
def("medico", (a) => {
    const p = a.p;
    const el = M.exigeLocal(p, ["hospital"]); if (el) return el;
    if (p.hp >= p.hpMax) return `🩺 o médico disse que você está saudável! nada a tratar.`;
    const f = M.cd(p, "medico"); if (f) return M.msgCd(f);
    const custo = Math.round(40 + (p.hpMax - p.hp) * 1.2);
    if (p.moeda < custo) return `💸 a consulta custa ${$} ${fmt(custo)} e você tem ${$} ${fmt(p.moeda)}.`;
    p.moeda -= custo; p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * 0.7)); M.setCd(p, "medico", 1200000); M.stat(p, "consultas");
    return `🩺 consulta feita! você recebeu tratamento.\n${M.rodape(p)}\n💸 -${$} ${fmt(custo)}`;
});

// ═══════════ CARREIRA (9) ═══════════
const cumpre = (p, e) => {
    const falt = [];
    for (const [k, n] of Object.entries(e.req.hab || {})) if (habLv(p, k) < n) falt.push(`${HAB[k].n} nv ${n}`);
    if (e.req.dipl && !p.x.dipl.includes(e.req.dipl)) falt.push(`diploma de ${CURSOS[e.req.dipl].n}`);
    if (e.req.nv && p.nivel < e.req.nv) falt.push(`nível ${e.req.nv}`);
    return falt;
};
const turno = (p, mult = 1) => {
    const e = EMPREGOS[p.x.emprego];
    return Math.round(e.pago * CARGO_MULT[p.x.cargo] * efic(p) * (1 + habLv(p, e.hab) * 0.03) * (1 + Math.min(0.1, amigos(p) * 0.02)) * (1 + M.buff(p, "moeda") / 100) * mult);
};
def("empregos", (a) => M.box("empregos disponíveis", [...Object.entries(EMPREGOS).map(([k, e]) => { const f = cumpre(a.p, e); return `${f.length ? "🔒" : "✅"} ${e.e} *${k}* — ${e.n} (${$} ~${e.pago}/turno)${f.length ? `\n     └ exige: ${f.join(", ")}` : ""}`; }), `candidate-se: ${a.cmd("candidatar")} <emprego>`]));
def("candidatar", (a) => {
    const p = a.p, id = norm(a.args[0] || "");
    const k = Object.keys(EMPREGOS).find(x => x === id || norm(EMPREGOS[x].n) === id);
    if (!k) return `usa: ${a.cmd("candidatar")} <emprego>\nveja a lista em *${a.cmd("empregos")}*`;
    const e = EMPREGOS[k];
    if (p.x.emprego === k) return `💼 você já trabalha como ${e.cargos[p.x.cargo]}!`;
    const f = cumpre(p, e); if (f.length) return `🔒 você ainda não atende os requisitos: ${f.join(", ")}`;
    const cd = M.cd(p, "candidatar"); if (cd) return M.msgCd(cd);
    M.setCd(p, "candidatar", 600000);
    const ch = clamp(50 + car(p) * 3 + habLv(p, "social") * 2, 40, 95);
    if (!chance(ch / 100)) return `📄 você fez a entrevista pra *${e.n}*, mas não passou dessa vez. (chance era ${Math.round(ch)}%) — melhore seu carisma e tente de novo!`;
    p.x.emprego = k; p.x.cargo = 0; p.x.turnosCargo = 0; M.stat(p, "empregos");
    return `🎉 *contratado(a)!* você agora é ${e.e} *${e.cargos[0]}* (${e.n})\n💼 use ${a.cmd("trabalhar")} pra cumprir turnos!${M.ganharXp(p, 30)}`;
});
def("trabalhar", (a) => {
    const p = a.p;
    if (!p.x.emprego) return `💼 você está desempregado(a)! veja ${a.cmd("empregos")} e ${a.cmd("candidatar")}.`;
    if (p.en < 20) return `⚡ energia insuficiente (${Math.round(p.en)}/20). durma ou tome um café!`;
    const f = M.cd(p, "trabalhar"); if (f) return M.msgCd(f);
    const e = EMPREGOS[p.x.emprego];
    const fraco = p.x.n.fome < 15 || p.x.n.sede < 15;
    let v = turno(p, fraco ? 0.5 : 1);
    p.en -= 20; M.setCd(p, "trabalhar", 480000);
    nd(p, { humor: -8, fome: -10, sede: -12, higiene: -8, social: -3 });
    p.x.turnosCargo++; p.x.pend += v; M.stat(p, "trabalhou");
    const linhas = [`${e.e} *turno de trabalho* — ${e.cargos[p.x.cargo]}`, pick(["você bateu o ponto e mandou bem no expediente.", "o dia foi corrido, mas rendeu!", "reunião, planilha, café... e o turno acabou.", "você resolveu tudo antes do fim do dia."])];
    if (fraco) linhas.push(`🥴 você trabalhou com fome/sede — rendeu só metade!`);
    if (chance(0.1)) { const b = Math.round(v * 0.3); p.x.pend += b; linhas.push(`🌟 o chefe elogiou seu trabalho! bônus de ${$} ${fmt(b)}`); }
    else if (chance(0.1)) { nd(p, { humor: -10 }); linhas.push(`😤 cliente difícil estressou você (😊 -10)`); }
    linhas.push(`🧾 +${$} ${fmt(v)} no holerite (total pendente: ${$} ${fmt(p.x.pend)})`, `💡 receba com ${a.cmd("salario")}`, M.rodape(p));
    return linhas.join("\n") + habAdd(p, e.hab, 1) + M.ganharXp(p, 12 + p.x.cargo * 4);
});
def("horaextra", (a) => {
    const p = a.p;
    if (!p.x.emprego) return `💼 você está desempregado(a)!`;
    if (p.en < 12) return `⚡ energia insuficiente (12).`;
    const f = M.cd(p, "horaextra"); if (f) return M.msgCd(f);
    p.en -= 12; M.setCd(p, "horaextra", 1800000);
    const v = turno(p, 1.6); p.x.pend += v; p.x.turnosCargo++; M.stat(p, "horasextras");
    nd(p, { humor: -12, fome: -8, sede: -8, social: -5 });
    return `🌙 *hora extra!* você ficou até tarde no trabalho.\n🧾 +${$} ${fmt(v)} no holerite\n${M.rodape(p)}${M.ganharXp(p, 10)}`;
});
def("promocao", (a) => {
    const p = a.p;
    if (!p.x.emprego) return `💼 você está desempregado(a)!`;
    const e = EMPREGOS[p.x.emprego];
    if (p.x.cargo >= 3) return `👑 você já está no topo: *${e.cargos[3]}*!`;
    const need = CARGO_TURNOS[p.x.cargo], hl = p.x.cargo + 1;
    if (p.x.turnosCargo < need) return `📉 você precisa de ${need} turnos no cargo atual (tem ${p.x.turnosCargo}).`;
    if (habLv(p, e.hab) < hl) return `📉 precisa de ${HAB[e.hab].n} nível ${hl} pra ser promovido(a).`;
    const f = M.cd(p, "promocao"); if (f) return M.msgCd(f);
    M.setCd(p, "promocao", 1800000);
    if (!chance(clamp(0.55 + car(p) * 0.03, 0.5, 0.9))) return `😔 o chefe disse que ainda não é o momento. tente de novo mais tarde!`;
    p.x.cargo++; p.x.turnosCargo = 0; M.stat(p, "promocoes");
    return `🎉 *PROMOÇÃO!* você agora é *${e.cargos[p.x.cargo]}*!\n📈 seu salário subiu (x${CARGO_MULT[p.x.cargo]})${M.ganharXp(p, 60 + p.x.cargo * 30)}`;
});
def("salario", (a) => {
    const p = a.p;
    if (p.x.pend <= 0) return `🧾 você não tem holerite pendente. trabalhe com ${a.cmd("trabalhar")}!`;
    const bruto = p.x.pend, imp = Math.round(bruto * 0.08), liq = bruto - imp;
    p.x.pend = 0; ganha(p, liq); M.stat(p, "salarios");
    return `💰 *salário recebido!*\n🧾 bruto: ${$} ${fmt(bruto)}\n🏛️ imposto (8%): -${$} ${fmt(imp)}\n✅ líquido: ${$} ${fmt(liq)}${M.ganharXp(p, 8)}`;
});
def("demitir", (a) => {
    const p = a.p;
    if (!p.x.emprego) return `💼 você já está desempregado(a).`;
    if (!/^confirmar$/i.test(a.args[0] || "")) return `⚠️ pedir demissão zera seu cargo!\npra confirmar: ${a.cmd("demitir")} confirmar`;
    const e = EMPREGOS[p.x.emprego]; p.x.emprego = null; p.x.cargo = 0; p.x.turnosCargo = 0;
    return `📦 você pediu demissão de *${e.n}*. (o holerite pendente continua seu, use ${a.cmd("salario")})`;
});
def("bico", (a) => {
    const p = a.p;
    if (!M.qtd(p, "celular")) return `📱 você precisa de um celular pra pegar bicos por aplicativo.`;
    const nv = 1 + p.nivel * 0.06;
    const pool = [
        { w: 4, t: "🛵 você fez entregas pelo app.", moeda: [Math.round(25 * nv), Math.round(45 * nv)] },
        { w: 3, t: "🧹 diária de limpeza numa casa.", moeda: [Math.round(35 * nv), Math.round(55 * nv)], hp: -3 },
        { w: 3, t: "🐕 passeou com cachorros do bairro.", moeda: [Math.round(20 * nv), Math.round(35 * nv)], needs: { humor: 6 } },
        { w: 2, t: "🚗 rodou como motorista de app.", moeda: [Math.round(40 * nv), Math.round(70 * nv)], needs: { social: 5 } },
        { w: 2, t: "⌨️ digitou documentos por hora.", moeda: [Math.round(30 * nv), Math.round(50 * nv)] },
        { w: 1, t: "😡 o cliente não pagou... você perdeu a viagem.", moeda: 0 }
    ];
    return lazer({ titulo: "bico", chave: "bico", stat: "bicos", e: "📲", en: 15, cd: 300000, needs: { fome: -8, sede: -8, higiene: -5 }, xp: 8, frases: ["você abriu o app e pegou um serviço rápido."], pool })(a);
});
def("curriculo", (a) => {
    const p = a.p;
    const pode = Object.entries(EMPREGOS).filter(([, e]) => !cumpre(p, e).length).map(([k]) => k);
    return M.box("currículo", [`👤 ${p.nome} · nível ${p.nivel}`, `💼 ${p.x.emprego ? `${EMPREGOS[p.x.emprego].cargos[p.x.cargo]} (${p.x.turnosCargo} turnos no cargo)` : "sem emprego"}`,
        `🎓 ${p.x.dipl.length ? p.x.dipl.map(d => CURSOS[d].n).join(", ") : "sem diploma"}`,
        `📊 ${Object.entries(HAB).map(([k, h]) => `${h.e}${habLv(p, k)}`).join(" ")}`, `✨ carisma: ${car(p)}`, `👥 amigos: ${amigos(p)}`,
        `✅ você já pode pegar: ${pode.join(", ")}`]);
});

// ═══════════ ESTUDOS (6) ═══════════
def("cursos", (a) => M.box("cursos", [...Object.entries(CURSOS).map(([k, c]) => `${a.p.x.dipl.includes(k) ? "🏅" : c.e} *${k}* — ${c.n} (${$} ${fmt(c.custo)} · ${c.aulas} aulas · nv ${c.nv})`), `matricule-se: ${a.cmd("matricular")} <curso>`]));
def("matricular", (a) => {
    const p = a.p, id = norm(a.args[0] || "");
    const k = Object.keys(CURSOS).find(x => x === id || norm(CURSOS[x].n) === id);
    if (!k) return `usa: ${a.cmd("matricular")} <curso>\nveja em *${a.cmd("cursos")}*`;
    const c = CURSOS[k];
    if (p.x.dipl.includes(k)) return `🏅 você já tem esse diploma!`;
    if (p.x.curso) return `📚 você já está cursando *${CURSOS[p.x.curso.id].n}* (${p.x.curso.aulas}/${CURSOS[p.x.curso.id].aulas}). termine antes!`;
    if (p.nivel < c.nv) return `🔒 precisa de nível ${c.nv}.`;
    if (p.moeda < c.custo) return `💸 a matrícula custa ${$} ${fmt(c.custo)}.`;
    p.moeda -= c.custo; p.x.curso = { id: k, aulas: 0 };
    return `📚 matriculado(a) em *${c.n}*!\n💸 -${$} ${fmt(c.custo)}\nuse ${a.cmd("estudar")} pra assistir às aulas (${c.aulas} no total).`;
});
def("estudar", (a) => {
    const p = a.p;
    if (p.en < 12) return `⚡ energia insuficiente (12).`;
    const f = M.cd(p, "estudar"); if (f) return M.msgCd(f);
    const bonus = (M.qtd(p, "mesa_estudo") ? 0.2 : 0) + (p.local === "universidade" ? 0.25 : 0);
    let pts = Math.max(1, Math.round((2 + habLv(p, "logica") * 0.2) * (1 + bonus) * (0.7 + bem(p) * 0.6)));
    if (!p.x.curso) {
        const k = norm(a.args[0] || "");
        if (!HAB[k]) return `📚 você não está matriculado(a). use ${a.cmd("matricular")}, ou estude por conta própria: ${a.cmd("estudar")} <${Object.keys(HAB).join("|")}>`;
        p.en -= 8; M.setCd(p, "estudar", 180000); M.stat(p, "estudou"); nd(p, { humor: -3, fome: -6, sede: -6 });
        return `📖 você estudou ${HAB[k].n} por conta própria. (+${pts} pts)${habAdd(p, k, pts)}${M.ganharXp(p, 6)}`;
    }
    const c = CURSOS[p.x.curso.id];
    p.en -= 12; M.setCd(p, "estudar", 180000); M.stat(p, "estudou"); nd(p, { humor: -4, fome: -8, sede: -8 });
    if (p.x.curso.aulas < c.aulas) p.x.curso.aulas++;
    const pronto = p.x.curso.aulas >= c.aulas;
    return `📚 *aula de ${c.n}* (${p.x.curso.aulas}/${c.aulas})${bonus ? `\n✨ bônus de estudo +${Math.round(bonus * 100)}%` : ""}${pronto ? `\n🎓 curso concluído! faça a prova: ${a.cmd("prova")}` : ""}${habAdd(p, c.hab, pts)}${M.ganharXp(p, 10)}`;
});
def("prova", (a) => {
    const p = a.p;
    if (!p.x.curso) return `📚 você não está cursando nada.`;
    const c = CURSOS[p.x.curso.id];
    if (p.x.curso.aulas < c.aulas) return `📚 faltam ${c.aulas - p.x.curso.aulas} aulas antes da prova.`;
    const f = M.cd(p, "prova"); if (f) return M.msgCd(f);
    M.setCd(p, "prova", 1800000);
    const ch = clamp(45 + habLv(p, c.hab) * 6 + Math.round(bem(p) * 15), 30, 92);
    if (!chance(ch / 100)) { p.x.curso.aulas = Math.max(0, p.x.curso.aulas - 3); nd(p, { humor: -10 }); return `📝 você fez a prova de *${c.n}*, mas reprovou... (chance ${ch}%)\n📉 perdeu 3 aulas de progresso. estude mais!`; }
    p.x.dipl.push(p.x.curso.id); p.x.curso = null; M.stat(p, "formou");
    return `🎓 *APROVADO(A)!* você se formou em *${c.n}*!\n🏅 novos empregos podem estar disponíveis: ${a.cmd("empregos")}${M.ganharXp(p, 150)}`;
});
def("ler", (a) => {
    const p = a.p;
    const livros = Object.keys(p.inv).filter(i => ITENS[i].tipo === "livro");
    if (!livros.length) return `📚 você não tem livros! compre em ${a.cmd("shopping")} livros.`;
    const id = (a.q && M.achar(a.q) && p.inv[M.achar(a.q)] && ITENS[M.achar(a.q)].tipo === "livro") ? M.achar(a.q) : pick(livros);
    if (p.en < 6) return `⚡ energia insuficiente (6).`;
    const f = M.cd(p, "ler"); if (f) return M.msgCd(f);
    p.en -= 6; M.setCd(p, "ler", 180000); M.stat(p, "leu"); nd(p, { humor: 4, fome: -3, sede: -3 });
    const it = ITENS[id]; let fim = "";
    if (chance(0.2)) { M.add(p, id, -1); fim = `\n📖 você terminou o livro! (+3 pts extras)` + habAdd(p, it.hab, 3); }
    return `📖 você leu ${M.nome(id)}.${habAdd(p, it.hab, 2)}${fim}${M.ganharXp(p, 6)}`;
});
def("habilidades", (a) => M.box("habilidades", [...Object.entries(HAB).map(([k, h]) => `${h.e} ${h.n}: nv ${habLv(a.p, k)} ${M.barra(a.p.x.hab[k] - 4 * habLv(a.p, k) ** 2, 4 * ((habLv(a.p, k) + 1) ** 2 - habLv(a.p, k) ** 2), 8)} (${a.p.x.hab[k]} pts)`), `✨ carisma: ${car(a.p)}`]));

// ═══════════ FINANÇAS (8) ═══════════
def("saldo", (a) => `${$} carteira: ${fmt(a.p.moeda)}\n🏦 banco: ${fmt(a.p.banco)}\n📈 investido: ${fmt(a.p.x.aplic.fixa.v + a.p.x.aplic.acoes.v)}\n🧾 holerite pendente: ${fmt(a.p.x.pend)}\n${a.p.x.divida > 0 ? `💳 dívida: ${fmt(a.p.x.divida)}\n` : ""}📊 patrimônio: ${$} ${fmt(a.p.moeda + a.p.banco + a.p.x.aplic.fixa.v + a.p.x.aplic.acoes.v - a.p.x.divida)}`);
def("depositar", M.fnDepositar());
def("sacar", M.fnSacar());
def("emprestimo", (a) => {
    const p = a.p, v = parseInt(a.args[0], 10), lim = 300 + p.nivel * 150;
    if (!v || v <= 0) return `🏦 *empréstimo* — limite de dívida: ${$} ${fmt(lim)} (você deve ${$} ${fmt(p.x.divida)})\nusa: ${a.cmd("emprestimo")} <valor> (juros de 10% na hora + 0,4%/h)`;
    const total = Math.round(v * 1.1);
    if (p.x.divida + total > lim) return `🏦 o banco só libera até ${$} ${fmt(lim)} de dívida total.`;
    p.x.divida += total; p.moeda += v; M.stat(p, "emprestimos");
    return `🏦 você pegou ${$} ${fmt(v)} emprestado(a)!\n💳 dívida agora: ${$} ${fmt(p.x.divida)} (use ${a.cmd("pagar")})`;
});
def("pagar", (a) => {
    const p = a.p;
    if (p.x.divida <= 0) return `✅ você não tem dívidas!`;
    const v = /^(tudo|all)$/i.test(a.args[0] || "") ? Math.min(p.x.divida, p.moeda) : parseInt(a.args[0], 10);
    if (!v || v <= 0) return `💳 dívida: ${$} ${fmt(p.x.divida)}\nusa: ${a.cmd("pagar")} <valor|tudo>`;
    if (v > p.moeda) return `💸 você só tem ${$} ${fmt(p.moeda)}.`;
    const q = Math.min(v, p.x.divida); p.moeda -= q; p.x.divida -= q;
    return `💳 você pagou ${$} ${fmt(q)}. ${p.x.divida > 0 ? `restam ${$} ${fmt(p.x.divida)}.` : `🎉 dívida quitada!`}`;
});
const rendAplic = (b, tipo) => { if (!b.v) return 0; const h = Math.min((Date.now() - b.t) / 3600000, 72); return Math.round(b.v * (1 + (tipo === "fixa" ? 0.003 : 0.004) * h)); };
def("investir", (a) => {
    const p = a.p, v = /^(tudo|all)$/i.test(a.args[0] || "") ? p.moeda : parseInt(a.args[0], 10), tipo = norm(a.args[1] || "fixa");
    if (!v || v <= 0 || !["fixa", "acoes"].includes(tipo)) return `📈 *investir*\nusa: ${a.cmd("investir")} <valor> [fixa|acoes]\n• fixa: rende 0,3%/hora, sem risco\n• acoes: rende 0,4%/hora ± variação de -10% a +18%\nmínimo: ${$} 50`;
    if (v < 50) return `📈 o mínimo pra investir é ${$} 50.`;
    if (v > p.moeda) return `💸 você só tem ${$} ${fmt(p.moeda)}.`;
    const b = p.x.aplic[tipo]; const atual = rendAplic(b, tipo);
    p.moeda -= v; b.v = atual + v; b.t = Date.now(); M.stat(p, "investiu");
    return `📈 você investiu ${$} ${fmt(v)} em *${tipo === "fixa" ? "renda fixa" : "ações"}*!\n💼 total aplicado: ${$} ${fmt(b.v)}${M.ganharXp(p, 10)}`;
});
def("resgatar", (a) => {
    const p = a.p, t = norm(a.args[0] || "");
    const tipos = t === "tudo" || !t ? ["fixa", "acoes"] : [t];
    if (!tipos.every(x => ["fixa", "acoes"].includes(x))) return `usa: ${a.cmd("resgatar")} [fixa|acoes|tudo]`;
    let total = 0; const linhas = [];
    for (const k of tipos) {
        const b = p.x.aplic[k]; if (!b.v) continue;
        const h = Math.min((Date.now() - b.t) / 3600000, 72);
        let val = Math.round(b.v * (1 + (k === "fixa" ? 0.003 : 0.004) * h));
        if (k === "acoes" && h >= 0.05) val = Math.max(Math.round(b.v * 0.7), Math.round(val + b.v * rand(-10, 18) / 100));
        linhas.push(`${k === "fixa" ? "🛡️ renda fixa" : "📊 ações"}: ${$} ${fmt(b.v)} → ${$} ${fmt(val)} (${val >= b.v ? "+" : ""}${fmt(val - b.v)})`);
        total += val; if (val > b.v) M.stat(p, "ganhou", val - b.v); b.v = 0; b.t = 0;
    }
    if (!total) return `📈 você não tem nada investido.`;
    p.moeda += total;
    return `💰 *resgate*\n${linhas.join("\n")}\n✅ total na carteira: +${$} ${fmt(total)}`;
});
def("apostar", M.fnApostar({ nome: "apostar", e: "🎰", max: 2000 }));

// ═══════════ CASA & JARDIM (7) ═══════════
def("casa", (a) => {
    const p = a.p, b = BASES[p.base], prox = BASES[p.base + 1];
    const linhas = [`${b.e} *${b.n}* (nível ${p.base + 1}/${BASES.length})`, `🧾 contas: ${$} ${b.conta}/hora`, `🌱 espaços de jardim: ${M.slots(p)}`, `🛋️ conforto: ${conforto(p)} · 🛏️ sono x${camaMult(p).toFixed(2)}`];
    if (prox) linhas.push(``, `⬆️ próxima: *${prox.n}*`, `📋 custo: ${$} ${fmt(prox.custo)} · nível ${prox.nv}`, `use ${a.cmd("mudar")}`); else linhas.push(``, `🌟 você mora na melhor casa da cidade!`);
    return M.box("sua moradia", linhas);
});
def("mudar", (a) => {
    const p = a.p, prox = BASES[p.base + 1];
    if (!prox) return `🌟 você já mora no melhor lugar possível!`;
    if (p.nivel < prox.nv) return `🔒 precisa de nível ${prox.nv}.`;
    if (p.moeda < prox.custo) return `💸 faltam ${$} ${fmt(prox.custo - p.moeda)}.`;
    p.moeda -= prox.custo; p.base++; M.stat(p, "mudancas");
    return `🚚 você se mudou pra *${prox.n}*! ${prox.e}\n🧾 contas agora: ${$} ${prox.conta}/hora${M.ganharXp(p, 40 + p.base * 15)}`;
});
def("mobiliar", (a) => {
    const p = a.p;
    const donos = Object.keys(p.inv).filter(i => ITENS[i].tipo === "movel");
    const falta = Object.keys(SHOPPING).filter(i => ITENS[i].tipo === "movel" && !p.inv[i]).slice(0, 6);
    return M.box("mobília", [...donos.map(i => `${M.nome(i)}${ITENS[i].conf ? ` (conforto +${ITENS[i].conf})` : ""}`), ``, `🛋️ conforto total: ${conforto(p)}`, `🛏️ melhor cama: x${camaMult(p).toFixed(2)}`, `🛒 ainda não tem: ${falta.map(M.nome).join(", ")}`, `compre em ${a.cmd("shopping")} moveis`]);
});
def("contas", (a) => {
    const p = a.p, b = BASES[p.base];
    if (/^pagar/i.test(a.args[0] || "")) {
        if (p.x.contas <= 0) return `🧾 você não tem contas pendentes!`;
        const v = Math.min(p.moeda, p.x.contas);
        if (v <= 0) return `💸 você não tem dinheiro na carteira.`;
        p.moeda -= v; p.x.contas -= v; M.stat(p, "contaspagas");
        return `🧾 você pagou ${$} ${fmt(v)} em contas. ${p.x.contas > 0 ? `restam ${$} ${fmt(p.x.contas)}.` : `✅ tudo em dia!`}`;
    }
    return M.box("contas da casa", [`${b.e} ${b.n}`, `🧾 pendente: ${$} ${fmt(p.x.contas)} (${$} ${b.conta}/hora)`, contasAtrasadas(p) ? `🕯️ *atrasadas!* cortaram a luz (você dorme pior)` : `✅ em dia`, `pague com ${a.cmd("contas")} pagar`]);
});
const CULTIVOS = {
    horta: { n: "Horta", e: "🥬", ms: 420000, custo: { semente_horta: 1 }, colheita: [["alface", 2, 4], ["cenoura", 1, 3]], xp: 8 },
    tomate: { n: "Tomate", e: "🍅", ms: 480000, custo: { semente_tomate: 1 }, colheita: [["tomate", 2, 5]], xp: 9 },
    flor: { n: "Flores", e: "🌷", ms: 600000, custo: { semente_flor: 1 }, colheita: [["flor_jardim", 2, 4]], xp: 10 }
};
def("plantar", M.fnPlantar(CULTIVOS));
def("colher", M.fnColher(CULTIVOS));
def("plantacao", M.fnPlantacao(CULTIVOS));

// ═══════════ COMPRAS (8) ═══════════
def("mercado", M.fnLoja(MERCADO, "mercado"));
def("shopping", (a) => {
    const cat = norm(a.args[0] || "");
    if (!CATS_SHOP[cat]) return M.box("shopping", [...Object.keys(CATS_SHOP).map(c => `🛍️ *${c}*`), `use ${a.cmd("shopping")} <categoria>`]);
    return M.box(`shopping — ${cat}`, [...CATS_SHOP[cat].map(id => `${M.nome(id)} — ${$} ${fmt(SHOPPING[id])}${ITENS[id].car ? ` (carisma +${ITENS[id].car})` : ""}${ITENS[id].conf ? ` (conforto +${ITENS[id].conf})` : ""}`), `compre: ${a.cmd("comprar")} <item> [qtd]`, `saldo: ${$} ${fmt(a.p.moeda)}`]);
});
def("comprar", M.fnComprar([MERCADO, SHOPPING]));
def("vender", M.fnVender());
def("usar", (a) => { a.usoNome = "usar"; return M.fnUsar(null)(a); });
def("descartar", M.fnDescartar());
def("presentear", M.fnPresentear());
def("transferir", M.fnTransferir());

// ═══════════ SOCIAL & FAMÍLIA (12) ═══════════
def("socializar", (a) => {
    const p = a.p;
    if (p.en < 6) return `⚡ energia insuficiente (6).`;
    const f = M.cd(p, "socializar"); if (f) return M.msgCd(f);
    const alvo = norm(a.args[0] || "");
    const k = Object.keys(NPCS).find(x => x === alvo) || pick(Object.keys(NPCS));
    p.en -= 6; M.setCd(p, "socializar", 240000); M.stat(p, "socializou");
    const antes = p.x.npcs[k] || 0, ganho = rand(4, 9) + Math.floor(car(p) / 3);
    p.x.npcs[k] = antes + ganho; nd(p, { social: 25, humor: 5 });
    const linhas = [`💬 *papo com ${NPCS[k].n}* ${NPCS[k].e}`, pick(["vocês riram muito lembrando de histórias.", "a conversa fluiu numa boa.", "trocaram ideia sobre a vida e o trabalho.", "vocês tomaram um café e colocaram o papo em dia."]), `👥 amizade: ${p.x.npcs[k]} pts${antes < 50 && p.x.npcs[k] >= 50 ? `\n🤝 *vocês agora são amigos!*` : ""}`];
    if (p.x.npcs[k] >= 50 && chance(0.2)) { const g = pick(["cafe", "chocolate", "suco", "sorvete"]); M.add(p, g, 1); linhas.push(`🎁 seu amigo te deu 1x ${M.nome(g)}!`); }
    return linhas.join("\n") + M.ganharXp(p, 8);
});
def("festa", (a) => {
    const p = a.p;
    if (p.local !== "casa") return `🏠 você precisa estar em casa pra dar uma festa. use ${a.cmd("ir")} casa`;
    if (p.moeda < 150) return `💸 a festa custa ${$} 150.`;
    if (p.en < 25) return `⚡ energia insuficiente (25).`;
    const f = M.cd(p, "festa"); if (f) return M.msgCd(f);
    p.moeda -= 150; p.en -= 25; M.setCd(p, "festa", 3600000); M.stat(p, "festas");
    nd(p, { social: 50, humor: 35, fome: -10, sede: -20, higiene: -10 });
    const convidados = [...Object.keys(NPCS)].sort(() => Math.random() - 0.5).slice(0, 3);
    convidados.forEach(k => { p.x.npcs[k] = (p.x.npcs[k] || 0) + 6; });
    const linhas = [`🎉 *festa em casa!*`, `👥 vieram: ${convidados.map(k => NPCS[k].e + " " + NPCS[k].n).join(", ")}`, `💸 -${$} 150`];
    if (chance(0.2)) { const m = Math.min(p.moeda, 40); p.moeda -= m; linhas.push(`📢 o vizinho reclamou do barulho e você tomou multa de ${$} ${fmt(m)}.`); }
    return linhas.join("\n") + `\n${txtNeeds({ social: 50, humor: 35 })}${M.ganharXp(p, 20)}`;
});
def("paquerar", (a) => {
    const p = a.p;
    if (p.x.par) return `💍 você já está ${p.x.par.status} com *${p.x.par.nome}*!`;
    if (p.en < 8) return `⚡ energia insuficiente (8).`;
    const f = M.cd(p, "paquerar"); if (f) return M.msgCd(f);
    p.en -= 8; M.setCd(p, "paquerar", 600000);
    const ch = clamp(35 + car(p) * 3 + habLv(p, "social") * 3, 30, 90);
    if (!chance(ch / 100)) return `💔 você tentou puxar assunto com ${pick(ROMANCES).n}, mas levou um fora. (chance ${Math.round(ch)}%) — capriche no visual!`;
    const r = p.x.crush || { ...pick(ROMANCES), pts: 0 };
    r.pts += rand(10, 18); p.x.crush = r; nd(p, { humor: 12 });
    return `💘 *deu match!* você e ${r.e} *${r.n}* trocaram olhares e telefones.\n💞 afinidade: ${r.pts} pts\nuse ${a.cmd("encontro")} pra sair com ${r.n}!${M.ganharXp(p, 10)}`;
});
def("encontro", (a) => {
    const p = a.p;
    const alvo = p.x.par || p.x.crush;
    if (!alvo) return `💘 você não tem ninguém pra sair. use ${a.cmd("paquerar")}!`;
    if (p.en < 10) return `⚡ energia insuficiente (10).`;
    if (p.moeda < 50) return `💸 o encontro custa ${$} 50.`;
    const f = M.cd(p, "encontro"); if (f) return M.msgCd(f);
    p.moeda -= 50; p.en -= 10; M.setCd(p, "encontro", 1200000); M.stat(p, "encontros");
    const g = rand(8, 15); alvo.pts = (alvo.pts || 0) + g; nd(p, { humor: 30, social: 10, fome: -15 });
    if (alvo.jid && a.bd.jogadores[alvo.jid] && a.bd.jogadores[alvo.jid].x.par) a.bd.jogadores[alvo.jid].x.par.pts = alvo.pts;
    return `🍷 *encontro com ${alvo.nome || alvo.n}!*\n${pick(["jantaram à luz de velas.", "passearam no parque de mãos dadas.", "foram ao cinema e dividiram a pipoca.", "um piquenique lindo na praça."])}\n💞 afinidade: ${alvo.pts} pts (+${g})\n💸 -${$} 50 · ${txtNeeds({ humor: 30, social: 10 })}${M.ganharXp(p, 12)}`;
});
const propostas = (a) => { a.bd.global.prop = a.bd.global.prop || {}; return a.bd.global.prop; };
const vinculo = (a, tipo, status, statsK) => {
    const p = a.p, alvo = M.alvo(a);
    const pr = propostas(a);
    const o = alvo && alvo !== a.me ? a.bd.jogadores[alvo] : null;
    if (!o) return null;
    const rev = pr[alvo];
    if (rev && rev.para === a.me && rev.tipo === tipo && Date.now() - rev.t < 900000) {
        const custo = tipo === "casamento" ? 300 : 0;
        if (p.moeda < custo || o.moeda < custo) { delete pr[alvo]; return `💸 o casamento custa ${$} ${custo} pra cada um, e um dos dois não tem.`; }
        p.moeda -= custo; o.moeda -= custo; delete pr[alvo];
        const desde = Date.now();
        p.x.par = { tipo: "jogador", jid: alvo, nome: o.nome, status, desde, pts: (p.x.par && p.x.par.pts) || 30 };
        o.x.par = { tipo: "jogador", jid: a.me, nome: p.nome, status, desde, pts: p.x.par.pts };
        p.x.crush = null; o.x.crush = null; M.stat(p, statsK); M.stat(o, statsK);
        return `${tipo === "casamento" ? "💒" : "💞"} *${p.nome}* e *${o.nome}* agora estão *${status}*! parabéns! 🎉${M.ganharXp(p, 80)}`;
    }
    pr[a.me] = { para: alvo, tipo, t: Date.now() };
    return `${tipo === "casamento" ? "💍" : "💌"} você enviou um pedido de ${tipo} pra *${o.nome}*!\npra oficializar, ${o.nome} precisa usar *${a.cmd(tipo === "casamento" ? "casar" : "namorar")} @você* em até 15 minutos.`;
};
def("namorar", (a) => {
    const p = a.p;
    if (p.x.par) return `💍 você já está ${p.x.par.status} com *${p.x.par.nome}*!`;
    if (M.alvo(a)) {
        const o = a.bd.jogadores[M.alvo(a)];
        if (!o) return `essa pessoa ainda não joga *Simulador de Vida*.`;
        if (o.x.par) return `💔 ${o.nome} já está com alguém.`;
        return vinculo(a, "namoro", "namorando", "namorou") || `marque quem você quer namorar!`;
    }
    if (!p.x.crush) return `💘 use ${a.cmd("paquerar")} pra conhecer alguém, ou marque um jogador: ${a.cmd("namorar")} @pessoa`;
    if (p.x.crush.pts < 40) return `💞 afinidade com ${p.x.crush.n}: ${p.x.crush.pts}/40. saia mais em ${a.cmd("encontro")}!`;
    const r = p.x.crush; p.x.par = { tipo: "npc", nome: r.n, status: "namorando", pts: r.pts, desde: Date.now() }; p.x.crush = null; M.stat(p, "namorou");
    return `💞 *${r.n}* aceitou namorar com você! ${r.e}${M.ganharXp(p, 60)}`;
});
def("terminar", (a) => {
    const p = a.p;
    if (!p.x.par) return `💔 você não está em nenhum relacionamento.`;
    if (p.x.par.status === "casado(a)") return `💍 vocês são casados! use ${a.cmd("divorciar")}.`;
    if (!/^confirmar$/i.test(a.args[0] || "")) return `⚠️ terminar com *${p.x.par.nome}*?\npra confirmar: ${a.cmd("terminar")} confirmar`;
    const nome = p.x.par.nome;
    if (p.x.par.jid && a.bd.jogadores[p.x.par.jid]) { const o = a.bd.jogadores[p.x.par.jid]; o.x.par = null; nd(o, { humor: -25 }); }
    p.x.par = null; nd(p, { humor: -20 });
    return `💔 você terminou com *${nome}*.\n😢 humor -20`;
});
def("casar", (a) => {
    const p = a.p;
    if (!p.x.par || p.x.par.status !== "namorando") return `💍 você precisa estar *namorando* pra casar. ${p.x.par ? "vocês já são casados!" : `use ${a.cmd("namorar")}`}`;
    if (p.x.par.tipo === "jogador") {
        const alvo = M.alvo(a);
        if (alvo !== p.x.par.jid) return `💍 marque seu(sua) namorado(a): ${a.cmd("casar")} @${p.x.par.nome}`;
        return vinculo(a, "casamento", "casado(a)", "casou");
    }
    if (p.x.par.pts < 80) return `💞 afinidade ${p.x.par.pts}/80. saiam mais em ${a.cmd("encontro")}!`;
    if (p.moeda < 500) return `💒 o casamento custa ${$} 500.`;
    p.moeda -= 500; p.x.par.status = "casado(a)"; M.stat(p, "casou");
    return `💒 *casamento!* você se casou com *${p.x.par.nome}*! 🎉\n💸 -${$} 500${M.ganharXp(p, 120)}`;
});
def("divorciar", (a) => {
    const p = a.p;
    if (!p.x.par || p.x.par.status !== "casado(a)") return `💔 você não é casado(a).`;
    if (p.moeda < 300) return `⚖️ o divórcio custa ${$} 300.`;
    if (!/^confirmar$/i.test(a.args[0] || "")) return `⚠️ se divorciar de *${p.x.par.nome}* custa ${$} 300.\npra confirmar: ${a.cmd("divorciar")} confirmar`;
    p.moeda -= 300;
    if (p.x.par.jid && a.bd.jogadores[p.x.par.jid]) { const o = a.bd.jogadores[p.x.par.jid]; o.x.par = null; nd(o, { humor: -30 }); }
    const nome = p.x.par.nome; p.x.par = null; nd(p, { humor: -30 });
    return `⚖️ você se divorciou de *${nome}*.\n💸 -${$} 300 · 😢 humor -30`;
});
def("relacionamento", (a) => {
    const p = a.p;
    const amigosL = Object.entries(p.x.npcs).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${NPCS[k].e} ${NPCS[k].n}: ${v} pts${v >= 50 ? " 🤝" : ""}`);
    return M.box("relacionamentos", [`💞 ${p.x.par ? `${p.x.par.status} com *${p.x.par.nome}* (${p.x.par.pts} pts)` : p.x.crush ? `paquerando ${p.x.crush.e} *${p.x.crush.n}* (${p.x.crush.pts}/40)` : "solteiro(a)"}`, `👥 amigos: ${amigos(p)}`, ...(amigosL.length ? amigosL : ["ninguém conhecido ainda — use " + a.cmd("socializar")])]);
});
def("filho", (a) => {
    const p = a.p;
    if (!p.x.par || p.x.par.status !== "casado(a)") return `👶 você precisa ser casado(a) pra ter filhos.`;
    if (p.x.filhos.length >= 3) return `👶 sua família já tem 3 filhos — chega, né? 😅`;
    if (p.moeda < 400) return `💸 ter um filho custa ${$} 400 (enxoval e hospital).`;
    if (p.en < 30) return `⚡ energia insuficiente (30).`;
    const f = M.cd(p, "filho"); if (f) return M.msgCd(f);
    const nome = (a.args.join(" ") || pick(["Miguel", "Helena", "Arthur", "Alice", "Theo", "Laura", "Davi", "Sofia"])).slice(0, 16);
    p.moeda -= 400; p.en -= 30; M.setCd(p, "filho", 3600000);
    const crianca = { nome, nasc: Date.now(), amor: 70 };
    p.x.filhos.push(crianca); M.stat(p, "filho");
    if (p.x.par.jid && a.bd.jogadores[p.x.par.jid]) { a.bd.jogadores[p.x.par.jid].x.filhos.push({ ...crianca }); M.stat(a.bd.jogadores[p.x.par.jid], "filho"); }
    return `👶 *nasceu ${nome}!* parabéns, família! 🎉\n💸 -${$} 400\ncuide com ${a.cmd("cuidarfilho")}!${M.ganharXp(p, 100)}`;
});
def("cuidarfilho", (a) => {
    const p = a.p;
    if (!p.x.filhos.length) return `👶 você não tem filhos.`;
    if (p.en < 10) return `⚡ energia insuficiente (10).`;
    if (p.moeda < 25) return `💸 cuidar custa ${$} 25 (fraldas, lanche...).`;
    const f = M.cd(p, "cuidarfilho"); if (f) return M.msgCd(f);
    const t = norm(a.args[0] || "");
    const c = p.x.filhos.find(x => norm(x.nome) === t) || p.x.filhos.reduce((m, x) => (x.amor < m.amor ? x : m), p.x.filhos[0]);
    p.moeda -= 25; p.en -= 10; M.setCd(p, "cuidarfilho", 1200000);
    c.amor = Math.min(100, Math.round(c.amor + rand(15, 25))); nd(p, { humor: 8 }); M.stat(p, "cuidou");
    return `🍼 você cuidou de *${c.nome}*! ${pick(["deu banho e colocou pra dormir.", "brincaram de massinha.", "leu uma historinha.", "foram tomar sorvete."])}\n💗 carinho: ${Math.round(c.amor)}/100\n💸 -${$} 25${M.ganharXp(p, 12)}`;
});
def("familia", (a) => {
    const p = a.p;
    const idade = (c) => { const d = (Date.now() - c.nasc) / 86400000; return d < 1 ? "bebê" : d < 7 ? "criança" : "adolescente"; };
    return M.box("família", [`💞 ${p.x.par ? `${p.x.par.status} com *${p.x.par.nome}*` : "solteiro(a)"}`, ...(p.x.filhos.length ? p.x.filhos.map(c => `👶 *${c.nome}* (${idade(c)}) · 💗 ${Math.round(c.amor)}/100`) : [`👶 sem filhos`]), ...(p.pets.length ? [`🐾 pets: ${p.pets.map(x => x.nome).join(", ")}`] : [])]);
});

// ═══════════ PETS (4) ═══════════
def("adotar", M.fnAdotar());
def("pets", M.fnPets());
def("alimentarpet", M.fnAlimentarPet());
def("brincarpet", M.fnBrincarPet());

// ═══════════ LAZER (8) ═══════════
def("academia", lazer({ titulo: "academia", chave: "academia", stat: "academia", exercicio: true, e: "🏋️", en: 15, cd: 600000, custo: 15, local: ["centro"], needs: { humor: 5, higiene: -15, fome: -10, sede: -15 }, hab: ["fisico", 2], hpMax: [5, 1], xp: 10, frases: ["você levantou peso e suou a camisa!", "treino de perna: amanhã você não anda. 😅"] }));
def("correr", lazer({ titulo: "corrida", chave: "correr", stat: "corridas", exercicio: true, e: "🏃", en: 12, cd: 300000, local: ["parque", "praia"], needs: { humor: 8, higiene: -8, fome: -8, sede: -12 }, hab: ["fisico", 1], xp: 8, frases: ["você correu ouvindo sua playlist favorita.", "5km na conta, coração a mil!"], chanceEv: 0.15, pool: [{ t: "💵 você achou uma nota no chão!", moeda: [5, 20] }] }));
def("cinema", lazer({ titulo: "cinema", chave: "cinema", e: "🎬", en: 5, cd: 600000, custo: 30, local: ["shopping"], needs: { humor: 25, social: 5, fome: -5 }, xp: 8, frases: ["pipoca, refri e um filmão!", "você chorou no final do filme. 😭"] }));
def("balada", lazer({ titulo: "balada", chave: "balada", e: "🪩", en: 20, cd: 1200000, custo: 60, nv: 3, local: ["balada"], needs: { humor: 40, social: 25, higiene: -10, sede: -20, fome: -10 }, xp: 15, frases: ["a pista tava lotada e você dançou a noite toda!"], chanceEv: 0.6, pool: [
    { w: 3, t: "🤝 você fez amizade com uma galera nova!", pts: 6 }, { w: 2, t: "🍹 alguém pagou um drink pra você.", needs: { humor: 8 } },
    { w: 2, t: "🕵️ cuidado com os batedores de carteira...", carteira: true }, { w: 1, t: "🥊 uma briga começou perto de você!", hp: -12 }] }));
def("pescar", lazer({ titulo: "pescaria", chave: "pescar", stat: "pescou", e: "🎣", en: 8, cd: 300000, local: ["praia", "parque"], requer: { vara_pesca: 1 }, needs: { humor: 12, fome: -5 }, xp: 8, frases: ["você lançou a linha e esperou com paciência..."], chanceEv: 1, pool: [
    { w: 4, t: "🐟 fisgou uma tilápia!", item: ["peixe_tilapia", 1] }, { w: 3, t: "🐠 um robalo bonito!", item: ["peixe_robalo", 1] }, { w: 2, t: "🦀 pescou um caranguejo!", item: ["caranguejo", 1] },
    { w: 1, t: "🐡 UM DOURADO! que sorte!", item: ["peixe_dourado", 1] }, { w: 2, t: "🥾 você pescou... uma bota velha.", item: ["bota_velha", 1] }] }));
def("jogar", lazer({ titulo: "videogame", chave: "jogar", e: "🎮", en: 8, cd: 300000, local: ["casa"], algum: ["console", "computador"], needs: { humor: 20, fome: -6, sede: -6 }, hab: ["tecnologia", 1], xp: 8, frases: ["maratona de partidas até o sol nascer... quase!", "você subiu de rank!"], chanceEv: 0.1, pool: [{ t: "🏆 você ganhou um torneio online!", moeda: [40, 120] }] }));
def("tocar", lazer({ titulo: "tocar violão", chave: "tocar", stat: "tocou", e: "🎸", en: 10, cd: 420000, requer: { violao: 1 }, needs: { humor: 12, social: 5 }, hab: ["criatividade", 2], xp: 9, frases: ["você tocou uma música na praça e juntou gente."], chanceEv: 0.7, pool: [{ w: 3, t: "🪙 o pessoal deixou gorjeta no chapéu!", moeda: [10, 60] }, { w: 1, t: "🎶 ninguém parou pra ouvir, mas você curtiu mesmo assim." }] }));
def("pintar", (a) => {
    const p = a.p;
    const lv = habLv(p, "criatividade");
    const r = Math.random(), q = r < lv * 0.05 ? "quadro_obra" : r < lv * 0.05 + 0.15 + lv * 0.05 ? "quadro_bom" : "quadro_simples";
    return lazer({ titulo: "pintar", chave: "pintar", stat: "pintou", e: "🎨", en: 15, cd: 600000, consome: { tela: 1, tinta: 1 }, needs: { humor: 15, fome: -6 }, hab: ["criatividade", 2], xp: 12, frases: ["você mergulhou na tela e deixou a inspiração fluir."], aoFim: (pp) => { M.add(pp, q, 1); return `🖼️ você criou: ${M.nome(q)}!`; }, chanceEv: 0.06, pool: [{ t: "🏛️ uma galeria comprou uma obra sua!", moeda: [80, 200] }] })(a);
});

function clampInt(v, a, b) { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(a, Math.min(b, n)) : a; }

module.exports = { TABELA: M.TABELA, SECOES };
