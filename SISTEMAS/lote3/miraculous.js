const { criar, rand, pick, chance, fmt, norm, clamp, horaBR } = require("./_motor.js");
const E = "💶";

// ── ITENS ───────────────────────────────────────────────
const ITENS = {}, LOJA = {};
const add = (cat, id, n, e, tipo, preco, extra = {}) => {
    ITENS[id] = { n, e, tipo, v: Math.max(1, Math.floor(preco * 0.4)), ...extra };
    if (cat) cat[id] = preco;
};
// comidas
add(LOJA, "macaron", "Macaron", "🍪", "comida", 5, { ef: { hp: 8 } });
add(LOJA, "croissant", "Croissant", "🥐", "comida", 6, { ef: { hp: 10, en: 3 } });
add(LOJA, "pain_choc", "Pain au Chocolat", "🍫", "comida", 7, { ef: { hp: 12 } });
add(LOJA, "crepe", "Crepe", "🥞", "comida", 9, { ef: { hp: 15, en: 5 } });
add(LOJA, "cafe", "Café", "☕", "comida", 4, { ef: { en: 10 } });
add(LOJA, "curativo", "Curativo", "🩹", "consumivel", 10, { ef: { hp: 15 } });
add(LOJA, "elixir_fu", "Elixir do Mestre Fu", "🧪", "consumivel", 45, { ef: { hp: 40, en: 20 } });
add(LOJA, "bomba_fumaca", "Bomba de Fumaça", "💨", "consumivel", 15, { ef: { buff: ["def", 4, 300000], msg: "💨 a fumaça te protegeu!" } });
// comida de kwami
[["cookie", "Cookie", "🍪", 8], ["camembert", "Camembert", "🧀", 10], ["regaliz", "Regaliz", "🍬", 8], ["salada", "Salada", "🥗", 6], ["mel", "Mel", "🍯", 8], ["granola", "Granola", "🥣", 8]]
    .forEach(([id, n, e, pr]) => add(LOJA, id, n, e, "kwami", pr));
// materiais
[["fio_seda", "Fio de Seda", "🧵", 8], ["tecido_magico", "Tecido Mágico", "🧶", 20], ["titanio", "Titânio", "🔩", 35]].forEach(([id, n, e, pr]) => add(LOJA, id, n, e, "material", pr));
[["cristal_miraculous", "Cristal Miraculous", "💎", 150], ["po_estelar", "Pó Estelar", "✨", 100], ["pena_pavao", "Pena de Pavão", "🪶", 125], ["fragmento_akuma", "Fragmento de Akuma", "🦋", 30], ["borboleta_branca", "Borboleta Purificada", "🕊️", 60],
 ["caderno", "Caderno", "📓", 7], ["foto_ladyblog", "Foto do Ladyblog", "📸", 20], ["objeto_akuma", "Objeto Akumatizado", "📿", 35]].forEach(([id, n, e, pr]) => add(null, id, n, e, "material", pr));
// itens da sorte (Amuleto)
add(null, "curativo_magico", "Curativo Mágico", "🩹", "consumivel", 0, { ef: { hp: 30 }, v: 15 });
add(null, "escudo_bolha", "Escudo de Bolha", "🫧", "consumivel", 0, { ef: { buff: ["def", 6, 300000] }, v: 15 });
add(null, "rede_magica", "Rede Mágica", "🕸️", "consumivel", 0, { ef: { buff: ["atk", 5, 300000] }, v: 15 });
add(null, "guarda_chuva", "Guarda-Chuva da Sorte", "☂️", "consumivel", 0, { ef: { buff: ["sorte", 25, 600000] }, v: 15 });
const LUCKY = [["curativo_magico"], ["escudo_bolha"], ["rede_magica"], ["guarda_chuva"]];

// miraculous
const MIRACULOUS = {
    joaninha: { n: "Joaninha", e: "🐞", kwami: "Tikki", comida: ["cookie"], frase: "Tikki, pintinhas já!", poder: "Amuleto da Sorte", arma: ["Yo-yo de Fibra", "Yo-yo de Titânio", "Yo-yo Lendário"], ic: "🪀", d: "equilibrada, cria itens com o Amuleto da Sorte (+2 energia)", bonus: { en: 2 } },
    gato: { n: "Gato Negro", e: "🐈‍⬛", kwami: "Plagg", comida: ["camembert"], frase: "Plagg, garras para fora!", poder: "Cataclismo", arma: ["Bastão de Ferro", "Bastão de Titânio", "Bastão Lendário"], ic: "🥢", d: "força bruta, Cataclismo destrói tudo (+1 ataque)", bonus: { atk: 1 } },
    raposa: { n: "Raposa", e: "🦊", kwami: "Trixx", comida: ["regaliz"], frase: "Trixx, é hora do show!", poder: "Miragem", arma: ["Flauta de Madeira", "Flauta de Titânio", "Flauta Lendária"], ic: "🪈", d: "ilusionista, confunde inimigos (+3 energia)", bonus: { en: 3 } },
    tartaruga: { n: "Tartaruga", e: "🐢", kwami: "Wayzz", comida: ["salada"], frase: "Wayzz, casco, vai!", poder: "Abrigo", arma: ["Escudo de Casco", "Escudo de Titânio", "Escudo Lendário"], ic: "🛡️", d: "guardião resistente, Abrigo protege (+2 defesa)", bonus: { def: 2 } },
    abelha: { n: "Abelha", e: "🐝", kwami: "Pollen", comida: ["mel"], frase: "Pollen, zumbindo!", poder: "Ferrão", arma: ["Pião de Madeira", "Pião de Titânio", "Pião Lendário"], ic: "🌀", d: "veloz e cheia de ferrão (+1 ataque, +1 energia)", bonus: { atk: 1, en: 1 } },
    cobra: { n: "Cobra", e: "🐍", kwami: "Sass", comida: ["granola"], frase: "Sass, sibilar!", poder: "Segunda Chance", arma: ["Lira de Madeira", "Lira de Titânio", "Lira Lendária"], ic: "🎵", d: "estrategista que volta no tempo (+6 vida)", bonus: { hp: 6 } }
};
for (const [k, m] of Object.entries(MIRACULOUS)) {
    m.arma.forEach((n, i) => add(i === 0 ? LOJA : null, `arma_${k}_${i + 1}`, n, m.ic, "arma", [70, 0, 0][i], { slot: "arma", atk: [3, 7, 13][i], nv: [1, 8, 18][i], miraculous: k, v: [25, 120, 500][i] }));
}
add(null, "colete_kevlar", "Colete de Kevlar", "🦺", "armadura", 0, { slot: "corpo", def: 3, nv: 4, v: 90 });
add(null, "colete_magico", "Colete Mágico", "🧥", "armadura", 0, { slot: "corpo", def: 6, nv: 12, v: 300 });
add(null, "luvas_reforcadas", "Luvas Reforçadas", "🧤", "acessorio", 0, { slot: "luvas", atk: 2, nv: 3, v: 70 });
add(null, "luvas_titanio", "Luvas de Titânio", "🥊", "acessorio", 0, { slot: "luvas", atk: 4, nv: 12, v: 260 });
add(null, "botas_agil", "Botas Ágeis", "👢", "acessorio", 0, { slot: "botas", def: 1, nv: 3, v: 70 });
add(null, "botas_titanio", "Botas de Titânio", "🥾", "acessorio", 0, { slot: "botas", def: 3, nv: 12, v: 260 });
const receitas = {
    colete_kevlar: { i: { fio_seda: 8, tecido_magico: 4 }, xp: 20, nv: 4 },
    colete_magico: { i: { colete_kevlar: 1, tecido_magico: 8, cristal_miraculous: 2 }, xp: 60, nv: 12 },
    luvas_reforcadas: { i: { fio_seda: 4, tecido_magico: 2 }, xp: 12, nv: 3 },
    luvas_titanio: { i: { luvas_reforcadas: 1, titanio: 4, cristal_miraculous: 1 }, xp: 50, nv: 12 },
    botas_agil: { i: { fio_seda: 4, tecido_magico: 2 }, xp: 12, nv: 3 },
    botas_titanio: { i: { botas_agil: 1, titanio: 4, cristal_miraculous: 1 }, xp: 50, nv: 12 },
    curativo_magico: { i: { curativo: 1, fio_seda: 2, po_estelar: 1 }, xp: 15 },
    escudo_bolha: { i: { bomba_fumaca: 1, tecido_magico: 1 }, xp: 10 },
    elixir_fu: { i: { curativo: 2, mel: 1, po_estelar: 1 }, xp: 25, nv: 8 }
};
for (const k of Object.keys(MIRACULOUS)) {
    receitas[`arma_${k}_2`] = { i: { [`arma_${k}_1`]: 1, titanio: 4, fio_seda: 6 }, xp: 40, nv: 8 };
    receitas[`arma_${k}_3`] = { i: { [`arma_${k}_2`]: 1, cristal_miraculous: 3, fragmento_akuma: 8, po_estelar: 2 }, xp: 120, nv: 18 };
}

// ── DADOS ───────────────────────────────────────────────
const NPCS = {
    alya: { n: "Alya", e: "👩‍💻" }, nino: { n: "Nino", e: "🎧" }, chloe: { n: "Chloé", e: "👸" }, rose: { n: "Rose", e: "🌹" }, juleka: { n: "Juleka", e: "🖤" },
    max: { n: "Max", e: "🤖" }, kim: { n: "Kim", e: "🏊" }, alix: { n: "Alix", e: "🛼" }, mylene: { n: "Mylène", e: "🎀" }, ivan: { n: "Ivan", e: "🥁" }
};
const ROMANCES = { adrien: { n: "Adrien", e: "🧑‍🎤" }, marinette: { n: "Marinette", e: "👩‍🎨" }, luka: { n: "Luka", e: "🎸" }, kagami: { n: "Kagami", e: "🤺" }, nathaniel: { n: "Nathaniel", e: "✏️" } };
const CURIOSIDADES = [
    { q: "Qual é o nome do kwami da Ladybug?", o: ["Plagg", "Tikki", "Wayzz"], c: 1 }, { q: "Qual é o poder do Gato Negro?", o: ["Amuleto da Sorte", "Miragem", "Cataclismo"], c: 2 },
    { q: "Qual é o nome civil do Hawk Moth?", o: ["Gabriel Agreste", "Fu", "Roger Raincomprix"], c: 0 }, { q: "Em qual cidade se passa Miraculous?", o: ["Londres", "Paris", "Roma"], c: 1 },
    { q: "Qual queijo o Plagg adora?", o: ["Camembert", "Cheddar", "Parmesão"], c: 0 }, { q: "Quem é o Guardião dos Miraculous?", o: ["Gabriel", "Mestre Fu", "Nooroo"], c: 1 },
    { q: "Qual é a arma da Ladybug?", o: ["Bastão", "Escudo", "Yo-yo"], c: 2 }, { q: "Qual é o kwami da Raposa?", o: ["Trixx", "Pollen", "Sass"], c: 0 },
    { q: "Quem administra o Ladyblog?", o: ["Chloé", "Alya", "Rose"], c: 1 }, { q: "Qual é o kwami da Tartaruga?", o: ["Wayzz", "Tikki", "Plagg"], c: 0 },
    { q: "Qual é o kwami da Abelha?", o: ["Sass", "Pollen", "Trixx"], c: 1 }, { q: "Qual o nome do kwami da Cobra?", o: ["Sass", "Wayzz", "Tikki"], c: 0 }
];
const mob = (n, e, hp, atk, xp, moeda, drops, nv = 1, d = 0) => ({ n, e, hp, atk, xp, moeda, drops, nv, def: d });
const MOBS_RUA = [
    mob("Ladrão de Bolsas", "🦹", 16, 4, 12, [2, 6], [[ "foto_ladyblog", 0.15, 1, 1], ["fio_seda", 0.3, 1, 2]]),
    mob("Vândalo", "🧨", 20, 5, 14, [2, 7], [["fio_seda", 0.4, 1, 2], ["caderno", 0.2, 1, 1]]),
    mob("Assaltante", "🥷", 28, 7, 20, [4, 10], [["fio_seda", 0.5, 1, 3], ["tecido_magico", 0.1, 1, 1]], 3),
    mob("Hacker Sombrio", "💻", 34, 9, 26, [5, 12], [["tecido_magico", 0.2, 1, 1], ["titanio", 0.08, 1, 1]], 5),
    mob("Gangue de Motoqueiros", "🏍️", 46, 11, 34, [7, 16], [["titanio", 0.2, 1, 2], ["fio_seda", 0.5, 2, 3]], 7),
    mob("Contrabandista", "🕶️", 60, 13, 44, [10, 22], [["titanio", 0.3, 1, 2], ["tecido_magico", 0.3, 1, 2]], 10, 1),
    mob("Mercenário", "🪖", 80, 16, 58, [14, 30], [["cristal_miraculous", 0.06, 1, 1], ["titanio", 0.4, 1, 3]], 14, 1)
];
const dropAkuma = (extra = []) => [["fragmento_akuma", 0.75, 1, 2], ["objeto_akuma", 0.5, 1, 1], ["tecido_magico", 0.3, 1, 2], ...extra];
const VILOES = {
    coracaodepedra: mob("Coração de Pedra", "🗿", 36, 7, 22, [10, 22], dropAkuma(), 1),
    cupidonegro: mob("Cupido Negro", "💘", 48, 8, 30, [12, 26], dropAkuma(), 3),
    ladywifi: mob("Lady Wifi", "📶", 60, 9, 38, [14, 30], dropAkuma([["titanio", 0.15, 1, 1]]), 5),
    rogercop: mob("Rogercop", "🚔", 72, 10, 46, [16, 34], dropAkuma(), 6, 1),
    reflekta: mob("Reflekta", "🪞", 85, 11, 56, [18, 38], dropAkuma([["titanio", 0.2, 1, 2]]), 8),
    volpina: mob("Volpina", "🦊", 100, 12, 66, [20, 44], dropAkuma([["po_estelar", 0.08, 1, 1]]), 10, 1),
    gamer: mob("Gamer", "🎮", 118, 13, 78, [22, 50], dropAkuma(), 12),
    ilustrador: mob("Ilustrador", "🖍️", 130, 14, 90, [26, 56], dropAkuma([["po_estelar", 0.1, 1, 1]]), 14, 1),
    anansi: mob("Anansi", "🕷️", 150, 15, 104, [30, 64], dropAkuma([["cristal_miraculous", 0.08, 1, 1]]), 16, 2),
    frozer: mob("Frozer", "🧊", 165, 16, 120, [34, 72], dropAkuma([["cristal_miraculous", 0.1, 1, 1]]), 18, 2),
    reynavespa: mob("Reyna Vespa", "🐝", 185, 17, 136, [38, 80], dropAkuma([["cristal_miraculous", 0.12, 1, 1]]), 20, 2),
    sandboy: mob("Sandboy", "⏳", 200, 18, 152, [42, 90], dropAkuma([["po_estelar", 0.15, 1, 1]]), 22, 2),
    quebratempo: mob("Quebra-Tempo", "⌛", 225, 20, 175, [48, 100], dropAkuma([["cristal_miraculous", 0.2, 1, 1], ["po_estelar", 0.2, 1, 1]]), 24, 3)
};
const BASES = [
    { n: "Quarto Secreto", e: "🛏️", custo: {}, renda: 0 },
    { n: "Sótão no Terraço", e: "🏠", custo: { moeda: 200, i: { tecido_magico: 5 } }, renda: 12, nv: 3, drops: [["fio_seda", 0.5, 1, 2]] },
    { n: "Refúgio no Metrô", e: "🚇", custo: { moeda: 700, i: { titanio: 6, fio_seda: 15 } }, renda: 30, nv: 8, drops: [["tecido_magico", 0.5, 1, 2], ["fio_seda", 0.7, 1, 3]] },
    { n: "QG na Torre Eiffel", e: "🗼", custo: { moeda: 2500, i: { titanio: 15, cristal_miraculous: 2 } }, renda: 70, nv: 14, drops: [["titanio", 0.5, 1, 2], ["po_estelar", 0.1, 1, 1]] },
    { n: "Santuário do Mestre Fu", e: "🏯", custo: { moeda: 8000, i: { cristal_miraculous: 6, po_estelar: 5 } }, renda: 150, nv: 22, drops: [["cristal_miraculous", 0.3, 1, 1], ["po_estelar", 0.3, 1, 2]] }
];

const heroi = (p) => p.x.ate > Date.now();
const trajeNv = (p) => p.x.trajeNv || 0;

const M = criar({
    id: "miraculous", pf: "mr", titulo: "Miraculous RPG", emoji: "🐞",
    moeda: { n: "euros", e: E }, itens: ITENS,
    inicio: { hp: 40, en: 30, atk: 2, def: 0, moeda: 30, inv: { macaron: 3, cookie: 2, camembert: 2, regaliz: 2, salada: 2, mel: 2, granola: 2 } },
    nivelGanho: { hp: 4, en: 1, atk: 1, def: 0 },
    regen: { hp: 60000, en: 45000 },
    localInicial: "padaria", cmdDescanso: "descansar", cmdMelhorar: "melhorar", cmdLocais: "locais", tituloLocais: "lugares de Paris",
    bases: BASES, baseTitulo: "seu esconderijo",
    morte: { perda: 0.1, txt: ["💥 você foi derrotado e sua transformação acabou! _Tikki/Plagg precisam de um descanso..._", "💥 um golpe forte te derrubou! você fugiu pra se recuperar."] },
    boasVindas: "🐞 você recebeu um Miraculous do Mestre Fu! transforme-se com o seu kwami, proteja Paris das akumas e guarde seu segredo!",
    tipos: { comida: "🥐 comidas", consumivel: "🧪 consumíveis", kwami: "🐾 comida de kwami", material: "🧵 materiais", arma: "⚔️ armas", armadura: "🦺 armaduras", acessorio: "🧤 acessórios" },
    locais: {
        padaria: { n: "Padaria", e: "🥖", d: "cheirinho de pão quentinho. seu lar em Paris.", nv: 1, en: 2 },
        escola: { n: "Collège Françoise Dupont", e: "🏫", d: "aulas, amigos e fofocas.", nv: 1, en: 2 },
        telhados: { n: "Telhados de Paris", e: "🌇", d: "o playground dos heróis.", nv: 1, en: 2 },
        sena: { n: "Rio Sena", e: "🚤", d: "barcos, pontes e mistérios.", nv: 2, en: 2 },
        torreeiffel: { n: "Torre Eiffel", e: "🗼", d: "o símbolo de Paris, vigiado por heróis.", nv: 3, en: 2 },
        montmartre: { n: "Montmartre", e: "🎨", d: "artistas e vistas incríveis.", nv: 3, en: 2 },
        louvre: { n: "Museu do Louvre", e: "🖼️", d: "obras de arte (e cuidado com akumas!).", nv: 4, en: 2 },
        catacumbas: { n: "Catacumbas", e: "🦇", d: "túneis escuros sob Paris.", nv: 6, en: 3 },
        templo: { n: "Templo do Mestre Fu", e: "🏯", d: "o santuário dos Miraculous.", nv: 10, en: 3 },
        mansao: { n: "Mansão Agreste", e: "🏰", d: "segredos guardados a sete chaves.", nv: 15, en: 4 }
    },
    conquistas: [
        { id: "aluno", n: "Aluno(a) aplicado(a)", d: "assista 10 aulas", ok: p => (p.stats.aulas || 0) >= 10, moeda: 30 },
        { id: "heroi", n: "Nasce um herói", d: "transforme-se pela primeira vez", ok: p => (p.stats.transformou || 0) >= 1, moeda: 20 },
        { id: "patrulheiro", n: "Patrulheiro(a) de Paris", d: "derrote 20 bandidos", ok: p => (p.stats.vitorias || 0) >= 20, moeda: 80 },
        { id: "akumas", n: "Caçador de akumas", d: "derrote 10 akumatizados", ok: p => (p.stats.akumas || 0) >= 10, moeda: 150 },
        { id: "purificador", n: "Mão purificadora", d: "purifique 10 akumas", ok: p => (p.stats.purificou || 0) >= 10, moeda: 200 },
        { id: "blogueiro", n: "Blogueiro(a) famoso(a)", d: "poste 15 vezes no Ladyblog", ok: p => (p.stats.ladyblog || 0) >= 15, moeda: 100 },
        { id: "kwami", n: "Melhor amigo do kwami", d: "alimente seu kwami 15 vezes", ok: p => (p.stats.alimentou || 0) >= 15, moeda: 100 },
        { id: "socialite", n: "Amigo de todo mundo", d: "faça 4 amigos", ok: p => amigos(p) >= 4, moeda: 120 },
        { id: "salvador", n: "Salvador(a) da pátria", d: "salve 20 pessoas", ok: p => (p.stats.salvamentos || 0) >= 20, moeda: 150 },
        { id: "mestrefu", n: "Discípulo(a) do Mestre Fu", d: "explore o Templo 3 vezes", ok: p => (p.stats.explorar_templo || 0) >= 3, moeda: 200 },
        { id: "mayura", n: "Pavão derrubado", d: "derrote Mayura", ok: p => (p.stats.abate_mayura || 0) >= 1, moeda: 500 },
        { id: "hawkmoth", n: "Fim do Hawk Moth", d: "derrote Hawk Moth", ok: p => (p.stats.abate_hawk_moth || 0) >= 1, moeda: 1000 },
        { id: "sombra", n: "Paris Salva!", d: "derrote Shadow Moth", ok: p => (p.stats.abate_shadow_moth || 0) >= 1, moeda: 3000 },
        { id: "rico", n: "Paris é rica!", d: "junte 5000 euros", ok: p => p.moeda + p.banco >= 5000, moeda: 300 },
        { id: "nivel25", n: "Herói Lendário", d: "chegue ao nível 25", ok: p => p.nivel >= 25, moeda: 500 }
    ],
    missoes: [
        { d: "assista 2 aulas", stat: "aulas", meta: 2, moeda: 15, xp: 25 },
        { d: "patrulhe 4 vezes", stat: "vitorias", meta: 4, moeda: 25, xp: 40 },
        { d: "derrote 1 akumatizado", stat: "akumas", meta: 1, moeda: 50, xp: 50, item: ["fragmento_akuma", 2] },
        { d: "salve 3 pessoas", stat: "salvamentos", meta: 3, moeda: 30, xp: 35 },
        { d: "alimente seu kwami 2 vezes", stat: "alimentou", meta: 2, moeda: 20, xp: 25 },
        { d: "trabalhe 3 vezes na padaria", stat: "padaria", meta: 3, moeda: 25, xp: 25 },
        { d: "converse com 3 amigos", stat: "conversou", meta: 3, moeda: 20, xp: 25 },
        { d: "poste 2 vezes no Ladyblog", stat: "ladyblog", meta: 2, moeda: 25, xp: 25 },
        { d: "explore Paris 3 vezes", stat: "explorar", meta: 3, moeda: 35, xp: 40 }
    ],
    historia: [
        { t: "Um Dia Comum", d: "assista 3 aulas.", stat: "aulas", meta: 3, moeda: 30, xp: 40, item: ["macaron", 3] },
        { t: "O Miraculous", d: "transforme-se 1 vez.", stat: "transformou", meta: 1, moeda: 40, xp: 60 },
        { t: "Primeira Patrulha", d: "derrote 3 bandidos.", stat: "vitorias", meta: 3, moeda: 50, xp: 70, item: ["fio_seda", 4] },
        { t: "Akumatizado!", d: "derrote 1 akumatizado.", stat: "akumas", meta: 1, moeda: 80, xp: 100 },
        { t: "Purificação", d: "purifique 1 akuma.", stat: "purificou", meta: 1, moeda: 100, xp: 120, item: ["borboleta_branca", 1] },
        { t: "Ladyblog em Alta", d: "poste 5 vezes no Ladyblog.", stat: "ladyblog", meta: 5, moeda: 120, xp: 120 },
        { t: "Kwami Feliz", d: "alimente seu kwami 8 vezes.", stat: "alimentou", meta: 8, moeda: 150, xp: 140, item: ["tecido_magico", 3] },
        { t: "Paris em Perigo", d: "derrote 6 akumatizados.", stat: "akumas", meta: 6, moeda: 300, xp: 250 },
        { t: "O Templo Secreto", d: "explore o Templo do Mestre Fu.", stat: "explorar_templo", meta: 1, moeda: 350, xp: 300, item: ["po_estelar", 1] },
        { t: "Sombras de Pavão", d: "derrote Mayura.", stat: "abate_mayura", meta: 1, moeda: 800, xp: 600 },
        { t: "O Grande Confronto", d: "derrote Hawk Moth.", stat: "abate_hawk_moth", meta: 1, moeda: 1500, xp: 1000, item: ["cristal_miraculous", 2] },
        { t: "Paris Salva", d: "derrote Shadow Moth.", stat: "abate_shadow_moth", meta: 1, moeda: 5000, xp: 3000 }
    ],
    extras: () => ({ miraculous: "joaninha", ate: 0, kwami: { nome: "Tikki", fome: 70, afeto: 50, nivel: 1, xp: 0 }, fama: 0, susp: 0, trajeNv: 0, npcs: {}, romance: null, quiz: null, purif: null }),
    aoCriar: (p, esc) => { const m = MIRACULOUS[esc.miraculous]; p.x.kwami.nome = m.kwami; },
    bonusAtk: (p) => (heroi(p) ? 5 + trajeNv(p) * 2 + p.x.kwami.nivel : 0),
    bonusDef: (p) => (heroi(p) ? 2 + trajeNv(p) : 0),
    tick: (p, ms) => {
        const min = Math.min(ms / 60000, 240);
        p.x.kwami.fome = clamp(p.x.kwami.fome - 0.25 * min, 0, 100);
        p.x.susp = clamp(p.x.susp - min / 5, 0, 100);
    },
    aoEvento: (p, ef) => { if (ef.fama) p.x.fama += ef.fama; if (ef.susp) p.x.susp = clamp(p.x.susp + ef.susp, 0, 100); if (ef.kwami) p.x.kwami.afeto = clamp(p.x.kwami.afeto + ef.kwami, 0, 100); if (ef.amigo) { const k = pick(Object.keys(NPCS)); p.x.npcs[k] = (p.x.npcs[k] || 0) + ef.amigo; } },
    statusExtra: (p, M) => [
        heroi(p) ? `🦸 transformado(a): ${Math.ceil((p.x.ate - Date.now()) / 60000)} min restantes` : `🙂 identidade civil`,
        `${MIRACULOUS[p.x.miraculous].e} ${p.x.kwami.nome}: 🍪 fome ${M.barra(p.x.kwami.fome, 100, 8)} ${Math.round(p.x.kwami.fome)}% · 💗 ${p.x.kwami.afeto}`,
        `🕵️ suspeita: ${M.barra(p.x.susp, 100, 8)} ${Math.round(p.x.susp)}%`
    ],
    perfilExtra: (p) => [`${MIRACULOUS[p.x.miraculous].e} ${MIRACULOUS[p.x.miraculous].n} · kwami ${p.x.kwami.nome} (nv ${p.x.kwami.nivel})`, `📣 fama: ${fmt(p.x.fama)} · 👗 traje nv ${trajeNv(p)}${heroi(p) ? " · 🦸 transformado(a)" : ""}`]
});
const { def } = M;
const amigos = (p) => Object.values(p.x.npcs || {}).filter(v => v >= 50).length;
const soHeroi = (a) => (heroi(a.p) ? null : `🦋 você precisa estar transformado(a)! use ${a.cmd("transformar")}`);
const hero = (fn) => (a) => soHeroi(a) || fn(a);
const comFama = (fn, fama = 3, susp = 2) => (a) => {
    const p = a.p, v0 = p.stats.vitorias || 0;
    const r = fn(a);
    if ((p.stats.vitorias || 0) > v0) { p.x.fama += fama; p.x.susp = clamp(p.x.susp + susp, 0, 100); return `${r}\n📣 fama +${fama}`; }
    return r;
};
const exp = (titulo, e, stat, local, s) => M.evento({ titulo, e, stat, local, chave: titulo, ...s });

// ═══════════ SISTEMA (10) ═══════════
def("comecar", M.fnComecar([{ k: "miraculous", ops: Object.fromEntries(Object.entries(MIRACULOUS).map(([k, m]) => [k, { d: `${m.e} ${m.n} · kwami ${m.kwami} · ${m.d}`, bonus: m.bonus }])) }]), { livre: true });
def("perfil", M.fnPerfil());
def("status", M.fnStatus());
def("inv", M.fnInv());
def("equip", M.fnEquip());
def("equipar", (a) => {
    const { id } = M.parseItem(a.args);
    if (id && M.qtd(a.p, id) && ITENS[id].miraculous && ITENS[id].miraculous !== a.p.x.miraculous) return `❌ essa arma é do Miraculous *${MIRACULOUS[ITENS[id].miraculous].n}*, e o seu é *${MIRACULOUS[a.p.x.miraculous].n}*.`;
    return M.fnEquipar()(a);
});
def("desequipar", M.fnDesequipar());
def("ranking", M.fnRanking(), { livre: true });
def("resetar", M.fnResetar());
const SECOES = [
    { t: "⚙️ sistema", c: ["comecar", "perfil", "status", "inv", "equip", "equipar", "desequipar", "ajuda", "ranking", "resetar"] },
    { t: "📈 progresso", c: ["diario", "missoes", "historia", "conquistas", "locais", "ir", "dica", "noticias", "hora"] },
    { t: "🦸 herói", c: ["transformar", "destransformar", "poder", "kwami", "alimentarkwami", "brincarkwami", "miraculous", "treinar", "salvar", "meditar", "cura", "segredo", "traje"] },
    { t: "🧭 exploração", c: ["telhados", "catacumbas", "torreeiffel", "louvre", "sena", "montmartre", "mansao", "templo"] },
    { t: "⚔️ combate", c: ["patrulhar", "akuma", "vilao", "purificar", "duelo", "duo", "raid", "desafio", "hawkmoth", "mayura", "sombra"] },
    { t: "🎒 vida civil", c: ["escola", "padaria", "entregar", "esgrima", "musica", "ladyblog", "moda", "passear", "descansar"] },
    { t: "💬 social", c: ["conversar", "amigos", "presentear", "transferir", "romance", "quiz", "responder"] },
    { t: "🔨 itens", c: ["craftar", "receitas", "comer", "usar", "descartar", "guardar", "retirar", "bau"] },
    { t: "💶 economia", c: ["loja", "comprar", "vender", "depositar", "sacar", "saldo", "apostar", "caixa"] },
    { t: "🏠 esconderijo", c: ["base", "melhorar", "renda"] }
];
def("ajuda", M.fnAjuda(SECOES), { livre: true });

// ═══════════ PROGRESSO (9) ═══════════
def("diario", M.fnDiario({ moeda: [30, 60], itens: [["macaron", 1, 3], ["fio_seda", 1, 3]], xp: 15 }));
def("missoes", M.fnMissoes());
def("historia", M.fnHistoria());
def("conquistas", M.fnConquistas());
def("locais", M.fnLocais());
def("ir", M.fnViajar());
def("dica", M.fnTexto(["💡 sem alimentar seu kwami você não consegue se transformar!", "💡 depois de derrotar uma akumatizado, use *mrpurificar* rápido!", "💡 transformar-se muito chama atenção: cuide da sua suspeita (mrsegredo).", "💡 melhore o traje com tecido mágico pra ficar mais forte transformado.", "💡 duo com um amigo dá bônus de ataque pra vocês dois!", "💡 os chefes exigem itens raros — junte fragmentos de akuma e cristais.", "💡 o Templo do Mestre Fu tem tesouros e meditação que recarrega energia.", "💡 o Ladyblog aumenta sua fama, e fama ajuda nas recompensas.", "💡 cada Miraculous tem uma arma própria: só equipe a do seu!"]));
def("noticias", M.fnTexto((a) => {
    const p = a.p;
    const h = pick(["🚨 *Ladyblog:* nova akuma avistada perto do Louvre!", "📰 *Le Parisien:* heróis salvam ônibus na ponte, prefeito agradece.", "📺 *TVi:* Chloé promete festa gigante no Le Grand Paris.", "🎙️ *Rádio Paris:* trânsito parado por causa de um akumatizado.", "📸 *Ladyblog:* fotos inéditas dos heróis em ação!", "📰 *Gazeta:* mistério — quem são os heróis por trás das máscaras?"]);
    return `${h}\n\n📣 sua fama: ${fmt(p.x.fama)} · ${p.x.fama >= 500 ? "🌟 símbolo de Paris" : p.x.fama >= 150 ? "⭐ herói querido" : p.x.fama >= 40 ? "🙂 conhecido(a)" : "🫥 quase anônimo(a)"}`;
}));
def("hora", M.fnTexto(() => { const h = horaBR(); return `🕒 agora são ${String(h).padStart(2, "0")}h em Paris (horário do Brasil)\n${h >= 6 && h < 18 ? "☀️ *dia* — Paris tá tranquila (quase!)" : "🌙 *noite* — as borboletas da akuma voam mais! akumatizados dropam +25% de fragmentos."}`; }));

// ═══════════ HERÓI (13) ═══════════
def("transformar", (a) => {
    const p = a.p, m = MIRACULOUS[p.x.miraculous];
    if (heroi(p)) return `🦸 você já está transformado(a)! (${Math.ceil((p.x.ate - Date.now()) / 60000)} min restantes)`;
    if (p.x.kwami.fome < 20) return `🍪 ${p.x.kwami.nome} está com fome demais pra se transformar! use ${a.cmd("alimentarkwami")}.`;
    const f = M.cd(p, "transformar"); if (f) return M.msgCd(f);
    M.setCd(p, "transformar", 60000);
    p.x.ate = Date.now() + 1800000; p.x.kwami.fome -= 10; M.stat(p, "transformou");
    let extra = "";
    if (p.x.susp >= 80) { const l = Math.min(p.x.fama, 10); p.x.fama -= l; p.x.susp -= 30; extra = `\n😰 *alguém quase descobriu sua identidade!* (fama -${l}, suspeita -30)`; }
    else p.x.susp = clamp(p.x.susp + rand(1, 4), 0, 100);
    return `✨ _"${m.frase}"_\n${m.e} *${m.n}* — transformação completa!\n⚔️ ataque ${M.atk(p)} · 🛡️ defesa ${M.defesa(p)}\n⏳ 30 minutos de herói${extra}${M.ganharXp(p, 5)}`;
});
def("destransformar", (a) => {
    const p = a.p;
    if (!heroi(p)) return `🙂 você já está com sua identidade civil.`;
    p.x.ate = 0; p.x.kwami.afeto = Math.min(100, p.x.kwami.afeto + 2);
    return `🙂 _"${p.x.kwami.nome}, destransformar!"_\nvocê voltou ao normal. ${p.x.kwami.nome} agradece o descanso! 💗`;
});
const PODERES = {
    joaninha: (p) => { const [id] = pick(LUCKY); M.add(p, id, 1); M.addBuff(p, "sorte", 25, 600000); return `🍀 *Amuleto da Sorte!* surgiu ${M.nome(id)} do nada!\n✨ sorte +25 por 10 minutos`; },
    gato: (p) => { M.addBuff(p, "atk", 10, 600000); p.hp = Math.max(1, p.hp - Math.ceil(p.hpMax * 0.1)); return `☠️ *Cataclismo!* seu ataque cresce +10 por 10 minutos!\n❤️ o poder cobra 10% da sua vida.`; },
    raposa: (p) => { M.addBuff(p, "def", 7, 600000); M.addBuff(p, "moeda", 15, 600000); return `🌀 *Miragem!* ilusões te protegem: 🛡️ +7 defesa e 💶 +15% moedas por 10 min!`; },
    tartaruga: (p) => { M.addBuff(p, "def", 10, 600000); p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * 0.2)); return `🛡️ *Abrigo!* uma barreira te envolve: 🛡️ +10 defesa por 10 min e ❤️ +20% de vida!`; },
    abelha: (p) => { M.addBuff(p, "atk", 7, 600000); M.addBuff(p, "xp", 20, 600000); return `🐝 *Ferrão!* ⚔️ +7 ataque e ✨ +20% xp por 10 minutos!`; },
    cobra: (p) => { if (p.hp < p.hpMax * 0.5) { p.hp = Math.ceil(p.hpMax * 0.6); return `⏪ *Segunda Chance!* o tempo voltou e você se recuperou até 60% de vida!`; } M.addBuff(p, "sorte", 15, 600000); return `⏪ *Segunda Chance!* você sente o tempo à sua disposição: 🍀 sorte +15 por 10 min.`; }
};
def("poder", hero((a) => {
    const p = a.p;
    if (p.en < 15) return `⚡ energia insuficiente (${Math.round(p.en)}/15).`;
    const f = M.cd(p, "poder"); if (f) return M.msgCd(f);
    p.en -= 15; M.setCd(p, "poder", 900000); M.stat(p, "poderes");
    return `${MIRACULOUS[p.x.miraculous].e} *${MIRACULOUS[p.x.miraculous].poder}*\n${PODERES[p.x.miraculous](p)}\n${M.rodape(p)}${M.ganharXp(p, 10)}`;
}));
def("kwami", (a) => {
    const p = a.p, k = p.x.kwami, m = MIRACULOUS[p.x.miraculous];
    return M.box(`kwami ${k.nome}`, [`${m.e} ${k.nome} (nível ${k.nivel}) · xp ${k.xp}/${k.nivel * 40}`, `🍪 fome: ${M.barra(k.fome, 100)} ${Math.round(k.fome)}%`, `💗 afeto: ${M.barra(k.afeto, 100)} ${k.afeto}%`, `🥣 come: ${m.comida.map(M.nome).join(", ")} ou 🍪 macaron`, `⚔️ bônus de kwami: +${k.nivel} ataque (transformado)`]);
});
def("alimentarkwami", (a) => {
    const p = a.p, k = p.x.kwami, m = MIRACULOUS[p.x.miraculous];
    const comida = [...m.comida, "macaron"].find(i => M.qtd(p, i));
    if (!comida) return `🍪 você não tem comida pro(a) ${k.nome}! ele(a) come: ${m.comida.map(M.nome).join(", ")} ou ${M.nome("macaron")}`;
    M.add(p, comida, -1); k.fome = Math.min(100, k.fome + (comida === "macaron" ? 15 : 35)); k.afeto = Math.min(100, k.afeto + 5); k.xp += 10; M.stat(p, "alimentou");
    let lv = "";
    if (k.xp >= k.nivel * 40) { k.xp = 0; k.nivel++; lv = `\n🆙 *${k.nome}* subiu pro nível ${k.nivel}! (+1 ataque transformado)`; }
    return `${m.e} ${k.nome} comeu ${M.nome(comida)} com gosto!\n🍪 fome: ${Math.round(k.fome)}%${lv}`;
});
def("brincarkwami", (a) => {
    const p = a.p, k = p.x.kwami;
    const f = M.cd(p, "brincarkwami"); if (f) return M.msgCd(f);
    M.setCd(p, "brincarkwami", 600000);
    k.afeto = Math.min(100, k.afeto + rand(6, 12));
    const extra = k.afeto >= 80 && chance(0.3) ? (M.add(p, "macaron", 1), `\n🎁 ${k.nome} escondeu um macaron pra você!`) : "";
    return `${MIRACULOUS[p.x.miraculous].e} você brincou com *${k.nome}*!\n💗 afeto: ${k.afeto}%${extra}${M.ganharXp(p, 6)}`;
});
def("miraculous", (a) => {
    const p = a.p, m = MIRACULOUS[p.x.miraculous];
    return M.box("seu Miraculous", [`${m.e} *${m.n}* · kwami ${p.x.kwami.nome}`, `✨ poder: *${m.poder}* (${a.cmd("poder")})`, `🗣️ _"${m.frase}"_`, `⚔️ arma: ${m.arma.join(" → ")}`, heroi(p) ? `🦸 transformado(a) por mais ${Math.ceil((p.x.ate - Date.now()) / 60000)} min` : `🙂 civil (use ${a.cmd("transformar")})`, `⚔️ ${M.atk(p)} · 🛡️ ${M.defesa(p)}`]);
});
def("treinar", M.fnTreinar({ chave: "treino", stat: "def", custo: 90, en: 6, cd: 900000, ganho: [1, 1], e: "🥋", rotulo: "defesa base", txt: "você treinou esquiva e resistência nos telhados!", xp: 15 }));
def("salvar", hero(M.evento({ titulo: "resgatar civis", e: "🆘", stat: "salvamentos", chave: "salvar", en: 4, cd: 45000, xp: 12, pool: [
    { w: 4, t: "🐱 você resgatou um gatinho preso numa árvore!", efeito: { fama: 2 }, moeda: [3, 8] },
    { w: 3, t: "🚌 você segurou um ônibus prestes a cair da ponte!", efeito: { fama: 5, susp: 2 }, hp: -5, moeda: [8, 18] },
    { w: 3, t: "👵 você ajudou uma senhora a atravessar a rua em meio ao caos.", efeito: { fama: 1 }, drops: [["macaron", 0.6, 1, 2]] },
    { w: 2, t: "🔥 você tirou uma família de um prédio em chamas!", efeito: { fama: 6, susp: 3 }, hp: -10, moeda: [15, 30] },
    { w: 1, t: "📸 um repórter filmou seu resgate — você virou viral!", efeito: { fama: 10, susp: 5 }, moeda: [20, 40] }] })));
def("meditar", (a) => {
    const p = a.p;
    const el = M.exigeLocal(p, ["templo"]); if (el) return el;
    const f = M.cd(p, "meditar"); if (f) return M.msgCd(f);
    M.setCd(p, "meditar", 1200000);
    const g = Math.ceil(p.enMax * 0.5); p.en = Math.min(p.enMax, p.en + g); p.x.kwami.afeto = Math.min(100, p.x.kwami.afeto + 5);
    M.addBuff(p, "xp", 10, 1800000);
    return `🧘 você meditou com o Mestre Fu.\n⚡ +${g} energia · 💗 afeto do kwami +5 · ✨ +10% xp por 30 min\n${M.rodape(p)}${M.ganharXp(p, 8)}`;
});
def("cura", hero((a) => {
    const p = a.p;
    if (p.en < 10) return `⚡ energia insuficiente (10).`;
    if (p.hp >= p.hpMax) return `❤️ sua vida já está cheia!`;
    const f = M.cd(p, "cura"); if (f) return M.msgCd(f);
    p.en -= 10; M.setCd(p, "cura", 900000);
    const g = Math.ceil(p.hpMax * (p.x.miraculous === "joaninha" ? 0.5 : 0.35)); p.hp = Math.min(p.hpMax, p.hp + g);
    return `✨ *Cura Miraculosa!* a magia do kwami te restaurou.\n❤️ +${g}\n${M.rodape(p)}`;
}));
def("segredo", (a) => {
    const p = a.p;
    if (/^distrair/i.test(a.args[0] || "")) {
        if (p.moeda < 30) return `💸 distrair os curiosos custa ${E} 30.`;
        if (p.en < 8) return `⚡ energia insuficiente (8).`;
        const f = M.cd(p, "distrair"); if (f) return M.msgCd(f);
        p.moeda -= 30; p.en -= 8; M.setCd(p, "distrair", 900000); p.x.susp = clamp(p.x.susp - 25, 0, 100);
        return `🎭 você criou uma distração perfeita e ninguém desconfia mais!\n🕵️ suspeita: ${Math.round(p.x.susp)}%\n💸 -${E} 30`;
    }
    return M.box("identidade secreta", [`🕵️ suspeita: ${M.barra(p.x.susp, 100)} ${Math.round(p.x.susp)}%`, p.x.susp >= 80 ? `🚨 perigo! alguém pode descobrir você ao se transformar!` : p.x.susp >= 50 ? `⚠️ cuidado, tem gente desconfiando...` : `✅ seu segredo está a salvo.`, `reduza com ${a.cmd("segredo")} distrair (custa ${E} 30)`]);
});
def("traje", (a) => {
    const p = a.p, nv = trajeNv(p);
    if (nv >= 5) return `🌟 seu traje já está no nível máximo (5)!`;
    const custo = 100 * (nv + 1), tec = 3 * (nv + 1);
    if (!/^melhorar$/i.test(a.args[0] || "")) return M.box("traje de herói", [`👗 nível ${nv}/5 (+${nv * 2} ataque, +${nv} defesa transformado)`, `⬆️ próximo: ${E} ${custo} + ${tec}x ${M.nome("tecido_magico")} (nível ${3 * (nv + 1)})`, `use ${a.cmd("traje")} melhorar`]);
    if (p.nivel < 3 * (nv + 1)) return `🔒 precisa de nível ${3 * (nv + 1)}.`;
    if (p.moeda < custo) return `💸 faltam ${E} ${custo - p.moeda}.`;
    if (M.qtd(p, "tecido_magico") < tec) return `🧶 faltam ${tec - M.qtd(p, "tecido_magico")}x Tecido Mágico.`;
    p.moeda -= custo; M.add(p, "tecido_magico", -tec); p.x.trajeNv = nv + 1; M.stat(p, "trajes");
    return `👗 *traje melhorado pro nível ${nv + 1}!*\n⚔️ +2 ataque · 🛡️ +1 defesa (transformado)${M.ganharXp(p, 30 * (nv + 1))}`;
});

// ═══════════ EXPLORAÇÃO (8) ═══════════
def("telhados", exp("explorar os telhados", "🌇", "explorar", ["telhados"], { en: 3, cd: 90000, xp: 12, pool: [
    { w: 4, t: "🌆 você pulou de telhado em telhado e achou um esconderijo de material!", drops: [["fio_seda", 1, 2, 4], ["tecido_magico", 0.3, 1, 1]] },
    { w: 3, t: "📸 você tirou fotos incríveis da cidade lá de cima.", drops: [["foto_ladyblog", 1, 1, 2]], efeito: { fama: 1 } },
    { w: 2, t: "🐦 uma revoada de pombos te atacou!", hp: -5 },
    { w: 1, t: "🍰 uma senhora deixou um lanchinho na janela pra você!", drops: [["croissant", 1, 1, 2], ["macaron", 1, 1, 2]] }] }));
def("sena", exp("passear no Sena", "🚤", "explorar", ["sena"], { en: 3, cd: 90000, nv: 2, xp: 14, pool: [
    { w: 4, t: "🚤 você ajudou um barqueiro e ganhou uma gorjeta.", moeda: [6, 16] },
    { w: 3, t: "🔍 debaixo de uma ponte você achou materiais perdidos.", drops: [["titanio", 0.3, 1, 1], ["fio_seda", 1, 2, 3]] },
    { w: 2, t: "🌊 você caiu no rio e saiu ensopado(a)!", hp: -4, en: -2 },
    { w: 1, t: "📿 você fisgou um objeto estranho... parece akumatizável!", drops: [["objeto_akuma", 1, 1, 1], ["fragmento_akuma", 0.5, 1, 1]] }] }));
def("torreeiffel", exp("subir a Torre Eiffel", "🗼", "explorar", ["torreeiffel"], { en: 4, cd: 120000, nv: 3, xp: 18, pool: [
    { w: 4, t: "🗼 você escalou até o topo e a vista é de tirar o fôlego!", en: 5, efeito: { fama: 2 } },
    { w: 3, t: "🔧 os técnicos deixaram peças no elevador.", drops: [["titanio", 0.5, 1, 2], ["fio_seda", 1, 2, 4]] },
    { w: 2, t: "🦹 ladrões tentaram roubar um turista — você interveio!", hp: -8, moeda: [10, 25], efeito: { fama: 3 } },
    { w: 1, t: "💨 vento forte quase te derrubou!", hp: -10 }] }));
def("montmartre", exp("passear em Montmartre", "🎨", "explorar", ["montmartre"], { en: 3, cd: 90000, nv: 3, xp: 16, pool: [
    { w: 4, t: "🎨 pintores te deram um retrato de presente!", moeda: [8, 20], drops: [["caderno", 0.5, 1, 1]] },
    { w: 3, t: "🥖 uma padaria de esquina te deu pães de brinde.", drops: [["croissant", 1, 1, 3], ["pain_choc", 0.6, 1, 2]] },
    { w: 2, t: "🎶 músicos de rua te chamaram pra tocar junto!", moeda: [10, 30], efeito: { fama: 2 } },
    { w: 1, t: "💎 entre as barracas, um vendedor te ofereceu um cristal barato!", drops: [["cristal_miraculous", 1, 1, 1]] }] }));
def("louvre", exp("visitar o Louvre", "🖼️", "explorar", ["louvre"], { en: 4, cd: 120000, nv: 4, xp: 22, pool: [
    { w: 4, t: "🖼️ você admirou obras incríveis e achou pistas de tesouros.", drops: [["tecido_magico", 0.5, 1, 2], ["foto_ladyblog", 0.7, 1, 1]] },
    { w: 3, t: "🦹 um ladrão tentava roubar um quadro — você o impediu!", hp: -8, moeda: [15, 35], efeito: { fama: 4 } },
    { w: 2, t: "🗿 uma estátua parecia se mover... só o vento, mas você levou um susto.", hp: -3 },
    { w: 1, t: "📿 um objeto antigo pulsava com energia estranha...", drops: [["objeto_akuma", 1, 1, 1], ["po_estelar", 0.3, 1, 1]] }] }));
def("catacumbas", exp("explorar as catacumbas", "🦇", "explorar", ["catacumbas"], { en: 5, cd: 150000, nv: 6, xp: 30, hpMin: 15, pool: [
    { w: 4, t: "🕯️ túneis antigos guardavam materiais valiosos.", drops: [["titanio", 0.7, 1, 3], ["fio_seda", 1, 2, 4], ["tecido_magico", 0.6, 1, 2]] },
    { w: 3, t: "🦇 morcegos! você correu escuridão adentro.", hp: -8, drops: [["fragmento_akuma", 0.4, 1, 1]] },
    { w: 2, t: "🕸️ você caiu numa armadilha antiga!", hp: -12, moeda: [10, 30] },
    { w: 1, t: "🔮 uma câmara secreta com um cristal brilhante!", drops: [["cristal_miraculous", 1, 1, 1], ["po_estelar", 0.4, 1, 1]] }] }));
def("templo", exp("explorar o Templo do Mestre Fu", "🏯", "explorar_templo", ["templo"], { en: 5, cd: 180000, nv: 10, xp: 40, pool: [
    { w: 4, t: "📜 o Mestre Fu te contou histórias antigas dos Miraculous.", drops: [["po_estelar", 0.5, 1, 1], ["mel", 0.8, 1, 2]], efeito: { kwami: 3 } },
    { w: 3, t: "🎋 você treinou com o Mestre Fu e se sentiu mais forte.", buff: ["atk", 4, 900000], moeda: [10, 30] },
    { w: 2, t: "🧿 o Mestre Fu te presenteou com materiais raros.", drops: [["cristal_miraculous", 0.6, 1, 1], ["tecido_magico", 1, 2, 4], ["titanio", 0.6, 1, 2]] },
    { w: 1, t: "🐾 seu kwami encontrou um baú escondido no jardim!", drops: [["cookie", 1, 2, 3], ["camembert", 1, 2, 3], ["po_estelar", 0.8, 1, 2]] }] }));
def("mansao", exp("invadir a Mansão Agreste", "🏰", "explorar", ["mansao"], { en: 7, cd: 240000, nv: 15, xp: 70, hpMin: 25, pool: [
    { w: 3, t: "🕵️ você achou documentos secretos no escritório do Gabriel.", drops: [["pena_pavao", 0.5, 1, 1], ["fragmento_akuma", 1, 2, 4]], efeito: { susp: 8 } },
    { w: 3, t: "🤖 robôs de segurança te perseguiram pelos corredores!", hp: -20, drops: [["titanio", 1, 2, 4], ["tecido_magico", 0.6, 1, 2]] },
    { w: 2, t: "🦋 borboletas brancas e roxas voam pela estufa... você pegou algumas.", drops: [["borboleta_branca", 0.7, 1, 2]], hp: -8 },
    { w: 1, t: "⚠️ o alarme disparou e você quase foi pego!", hp: -25, efeito: { susp: 12 } }] }));

// ═══════════ COMBATE (11) ═══════════
def("patrulhar", comFama(hero(M.combate({ titulo: "patrulhar Paris", e: "🌃", mobs: MOBS_RUA, en: 2, cd: 20000, chave: "patrulhar" })), 2, 2));
const lutaAkuma = (a, vil, titulo) => {
    const p = a.p;
    const err = soHeroi(a); if (err) return err;
    if (p.nivel < vil.nv) return `🔒 *${vil.n}* exige nível ${vil.nv}.`;
    if (p.hp < 4) return `💔 você tá muito ferido! cure-se antes de lutar.`;
    if (p.en < 5) return `⚡ energia insuficiente (${Math.round(p.en)}/5).`;
    const f = M.cd(p, "akuma"); if (f) return M.msgCd(f);
    p.en -= 5; M.setCd(p, "akuma", 60000);
    const noite = horaBR() >= 18 || horaBR() < 6;
    const alvo = { ...vil, drops: vil.drops.map(d => [d[0], d[0] === "fragmento_akuma" && noite ? d[1] * 1.25 : d[1], d[2], d[3]]) };
    const r = M.lutar(p, alvo);
    let txt = M.resultadoLuta(p, alvo, r, titulo, "🦋");
    if (r.venceu) {
        p.x.purif = { n: vil.n, ate: Date.now() + 600000 }; p.x.fama += 5; p.x.susp = clamp(p.x.susp + 3, 0, 100); M.stat(p, "akumas");
        txt += `\n📣 fama +5\n🦋 a akuma escapou do objeto! use *${a.cmd("purificar")}* em até 10 minutos!`;
    }
    return txt;
};
def("akuma", (a) => {
    const el = Object.values(VILOES).filter(v => v.nv <= a.p.nivel);
    return lutaAkuma(a, el.length ? pick(el) : VILOES.coracaodepedra, "akuma na cidade");
});
def("vilao", (a) => {
    const t = norm(a.q).replace(/_/g, "");
    if (!t) return M.box("akumatizados", Object.entries(VILOES).map(([k, v]) => `${v.e} *${k}* — ${v.n} (nv ${v.nv})`).concat([`use ${a.cmd("vilao")} <nome>`]));
    const k = Object.keys(VILOES).find(x => x === t || x.startsWith(t) || norm(VILOES[x].n).replace(/_/g, "") === t);
    if (!k) return `😕 não achei esse vilão. veja a lista com *${a.cmd("vilao")}*`;
    return lutaAkuma(a, VILOES[k], `combate contra ${VILOES[k].n}`);
});
def("purificar", hero((a) => {
    const p = a.p;
    if (!p.x.purif || p.x.purif.ate < Date.now()) { p.x.purif = null; return `🦋 não há nenhuma akuma pra purificar agora. derrote um akumatizado primeiro (${a.cmd("akuma")})!`; }
    if (p.en < 3) return `⚡ energia insuficiente (3).`;
    p.en -= 3;
    const v = p.x.purif.n; p.x.purif = null;
    const g = rand(30, 80) + p.nivel * 3; p.moeda += g; M.add(p, "borboleta_branca", 1);
    const got = M.rolar(p, [["cristal_miraculous", 0.08, 1, 1], ["po_estelar", 0.08, 1, 1]]);
    p.x.fama += 8; p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * 0.1)); M.stat(p, "purificou");
    return `🕊️ _"Adeus, pequena akuma... você está livre do mal!"_\n✨ *Miraculous Ladybug!* tudo em Paris foi restaurado, e ${v} voltou ao normal.\n${E} +${g}\n🎁 1x ${M.nome("borboleta_branca")}${Object.keys(got).length ? `, ${M.txtItens(got)}` : ""}\n📣 fama +8 · ❤️ +10%${M.ganharXp(p, 30)}`;
}));
def("duelo", M.fnDuelo());
def("duo", (a) => {
    const p = a.p;
    const err = soHeroi(a); if (err) return err;
    const alvo = M.alvo(a);
    if (!alvo || alvo === a.me) return `🤝 marque (ou responda) o amigo pra fazer dupla! ex: ${a.cmd("duo")} @pessoa`;
    const o = a.bd.jogadores[alvo];
    if (!o) return `essa pessoa ainda não joga *Miraculous RPG*.`;
    if (!heroi(o)) return `🦋 ${o.nome} precisa estar transformado(a) pra lutar com você!`;
    if (p.hp < 10 || o.hp < 10) return `💔 os dois precisam estar com pelo menos 10 de vida.`;
    if (p.en < 6) return `⚡ energia insuficiente (6).`;
    const f = M.cd(p, "duo"); if (f) return M.msgCd(f);
    p.en -= 6; M.setCd(p, "duo", 300000);
    const nv = Math.round((p.nivel + o.nivel) / 2);
    const el = Object.values(VILOES).filter(v => v.nv <= nv);
    const vil = pick(el.length ? el : [VILOES.coracaodepedra]);
    const r = M.lutar(p, vil, { atk: M.atk(p) + Math.round(M.atk(o) * 0.6), def: M.defesa(p) + Math.round(M.defesa(o) * 0.4) });
    o.hp = Math.max(1, o.hp - Math.round(r.sofrido * 0.5));
    M.stat(p, "duos");
    const linhas = [`🤝 *dupla de heróis!* ${p.nome} + ${o.nome} contra ${vil.e} *${vil.n}*`, `🗡️ ${r.rounds} rounds · causaram ${r.causado} · sofreram ${r.sofrido}`];
    if (!r.venceu) { linhas.push(`💀 vocês foram derrotados...\n${M.morrer(p)}`); return linhas.join("\n"); }
    const g = Math.round(rand(...vil.moeda) * 1.3); p.moeda += g; o.moeda += g;
    const d1 = M.rolar(p, vil.drops), d2 = M.rolar(o, vil.drops);
    p.x.fama += 6; o.x.fama += 6; M.stat(p, "vitorias"); M.stat(o, "vitorias"); M.stat(p, "akumas"); M.stat(o, "akumas");
    linhas.push(`🏅 *vitória em dupla!*`, `${E} +${g} pra cada`, `🎁 ${p.nome}: ${Object.keys(d1).length ? M.txtItens(d1) : "nada"} · ${o.nome}: ${Object.keys(d2).length ? M.txtItens(d2) : "nada"}`, `📣 fama +6 pra cada${M.ganharXp(o, vil.xp)}`);
    return linhas.join("\n") + M.ganharXp(p, vil.xp);
});
def("raid", hero((a) => {
    const p = a.p;
    if (p.nivel < 10) return `🔒 raids de akuma só a partir do nível 10.`;
    if (p.hp < p.hpMax * 0.7) return `💔 comece a raid com 70%+ de vida!`;
    if (p.en < 8) return `⚡ energia insuficiente (8).`;
    const f = M.cd(p, "raid"); if (f) return M.msgCd(f);
    M.setCd(p, "raid", 1800000); p.en -= 8;
    const el = Object.values(VILOES).filter(v => v.nv <= p.nivel);
    const ondas = [pick(el), pick(el), pick(el)].map(v => ({ ...v, drops: [], moeda: null, xp: 0 }));
    if (p.nivel >= 18) ondas.push({ ...pick(el), drops: [], moeda: null, xp: 0 });
    const linhas = [`🚨 *ONDA DE AKUMAS!* ${ondas.length} akumatizados atacam Paris!`];
    let ganhou = true;
    for (let i = 0; i < ondas.length; i++) {
        const r = M.lutar(p, ondas[i]);
        linhas.push(`${r.venceu ? "✅" : "❌"} onda ${i + 1}: ${ondas[i].e} ${ondas[i].n} (${r.rounds} rounds, -${r.sofrido}❤️)`);
        if (!r.venceu) { ganhou = false; break; }
    }
    M.stat(p, "raids");
    if (ganhou) {
        const g = rand(120, 220) + p.nivel * 6; p.moeda += g; p.x.fama += 15;
        const got = M.rolar(p, [["cristal_miraculous", 0.25, 1, 1], ["po_estelar", 0.3, 1, 1], ["borboleta_branca", 1, 1, 3], ["fragmento_akuma", 1, 3, 6]]);
        linhas.push(`🏆 *Paris está salva!* ${E} +${g} · 📣 fama +15${Object.keys(got).length ? `\n🎁 ${M.txtItens(got)}` : ""}${M.ganharXp(p, 150)}`);
    } else { p.x.ate = 0; linhas.push(`💀 as akumas venceram esta rodada...\n${M.morrer(p)}`); }
    return linhas.join("\n");
}));
def("desafio", (a) => {
    const p = a.p;
    if (p.hp < 6) return `💔 você tá ferido demais pra treinar.`;
    if (p.en < 4) return `⚡ energia insuficiente (4).`;
    const f = M.cd(p, "desafio"); if (f) return M.msgCd(f);
    p.en -= 4; M.setCd(p, "desafio", 180000);
    const rival = { n: "Rival de Treino", e: "🥷", hp: 20 + p.nivel * 4, atk: 4 + p.nivel, def: 0, xp: 0 };
    const hp0 = p.hp; const r = M.lutar(p, rival);
    p.hp = Math.max(1, Math.round(hp0 - r.sofrido * 0.3)); M.stat(p, "desafios");
    const xp = r.venceu ? 30 : 8;
    return `🥊 *desafio de treino* contra ${rival.e} ${rival.n}\n🗡️ ${r.rounds} rounds · ${r.venceu ? "🏅 você venceu!" : "😅 você perdeu, mas aprendeu"}\n(sem risco de morte no treino)\n${M.rodape(p)}${M.ganharXp(p, xp)}`;
});
def("hawkmoth", hero((a) => {
    if (!a.p.flags.boss_mayura) return `🔒 derrote Mayura primeiro (${a.cmd("mayura")}) — ela protege o esconderijo dele!`;
    return M.boss({ titulo: "Hawk Moth", e: "🦋", nv: 25, en: 12, cd: 10800000, chave: "hawkmoth", exige: { borboleta_branca: 5, fragmento_akuma: 15 }, chefe: mob("Hawk Moth", "🦋", 280, 24, 2000, [1200, 2000], [["cristal_miraculous", 0.8, 1, 2], ["po_estelar", 0.6, 1, 2]], 25, 3), primeira: { moeda: 2500, xp: 1500, itens: { cristal_miraculous: 3, po_estelar: 3 } } })(a);
}));
def("mayura", hero(M.boss({ titulo: "Mayura", e: "🦚", nv: 20, en: 10, cd: 7200000, chave: "mayura", exige: { pena_pavao: 1, fragmento_akuma: 8 }, chefe: mob("Mayura", "🦚", 230, 20, 900, [500, 900], [["pena_pavao", 0.6, 1, 1], ["cristal_miraculous", 0.5, 1, 1], ["po_estelar", 0.4, 1, 1]], 20, 2), primeira: { moeda: 1200, xp: 700, itens: { cristal_miraculous: 2 } } })));
def("sombra", hero((a) => {
    if (!a.p.flags.boss_hawkmoth) return `🔒 derrote Hawk Moth primeiro (${a.cmd("hawkmoth")})!`;
    return M.boss({ titulo: "Shadow Moth", e: "🌑", nv: 30, en: 15, cd: 14400000, chave: "sombra", exige: { borboleta_branca: 10, cristal_miraculous: 2, po_estelar: 2 }, chefe: mob("Shadow Moth", "🌑", 380, 30, 4000, [2000, 3500], [["cristal_miraculous", 1, 2, 4], ["po_estelar", 1, 2, 4]], 30, 5), primeira: { moeda: 6000, xp: 3000, itens: { cristal_miraculous: 5, po_estelar: 5 } } })(a);
}));

// ═══════════ VIDA CIVIL (9) ═══════════
def("escola", M.atividade({ titulo: "assistir aula", chave: "escola", stat: "aulas", e: "🏫", en: 5, cd: 150000, xp: 12, local: ["escola"], frases: ["você prestou atenção na aula e ainda passou bilhetinhos.", "prova surpresa! mas você mandou bem.", "Chloé te provocou, mas você ignorou e focou nos estudos."], drops: [["caderno", 0.3, 1, 1], ["fio_seda", 0.05, 1, 1]], moeda: [1, 4] }));
def("padaria", M.atividade({ titulo: "ajudar na padaria", chave: "padaria", stat: "padaria", e: "🥖", en: 6, cd: 120000, xp: 10, local: ["padaria"], frases: ["você sovou massa e atendeu clientes com um sorriso.", "a fila estava enorme, mas você deu conta!"], moeda: [8, 18], drops: [["macaron", 0.4, 1, 2], ["croissant", 0.4, 1, 2], ["pain_choc", 0.2, 1, 1]] }));
def("entregar", M.atividade({ titulo: "fazer entregas", chave: "entregar", stat: "entregas", e: "🚲", en: 5, cd: 90000, xp: 9, frases: ["você pedalou por Paris entregando encomendas."], moeda: [10, 24], risco: { c: 0.06, dano: [1, 4], frases: ["um cachorro te perseguiu!"], falha: false } }));
def("esgrima", M.fnTreinar({ chave: "esgrima", stat: "atk", custo: 70, en: 8, cd: 900000, ganho: [1, 1], e: "🤺", rotulo: "ataque base", txt: "aula de esgrima: estocadas e defesas até suar!", xp: 15 }));
def("musica", M.evento({ titulo: "tocar música", e: "🎸", stat: "musica", chave: "musica", en: 6, cd: 240000, xp: 10, pool: [
    { w: 4, t: "🎶 sua banda tocou na praça e juntou uma multidão!", moeda: [6, 24], efeito: { fama: 1 } },
    { w: 2, t: "🎤 um produtor gostou do som!", moeda: [20, 45], efeito: { fama: 3 } },
    { w: 1, t: "🎸 uma corda arrebentou no meio do show...", moeda: [1, 6] }] }));
def("ladyblog", M.evento({ titulo: "postar no Ladyblog", e: "📸", stat: "ladyblog", chave: "ladyblog", en: 5, cd: 180000, xp: 10, pool: [
    { w: 4, t: "📸 você postou fotos dos heróis e o Ladyblog bombou!", efeito: { fama: 3 }, moeda: [4, 12] },
    { w: 3, t: "🗞️ uma matéria sua foi compartilhada por milhares!", efeito: { fama: 6 }, moeda: [8, 20] },
    { w: 2, t: "🤔 sua teoria sobre a identidade dos heróis deu o que falar... e a desconfiança!", efeito: { fama: 2, susp: 6 } },
    { w: 1, t: "📉 o post não teve muita audiência.", efeito: { fama: 1 } }] }));
def("moda", M.evento({ titulo: "sessão de fotos", e: "👗", stat: "moda", chave: "moda", en: 6, cd: 300000, nv: 3, xp: 14, pool: [
    { w: 4, t: "📷 a sessão de fotos foi um sucesso!", moeda: [15, 40] },
    { w: 2, t: "👗 o estilista te deu tecidos de brinde.", drops: [["tecido_magico", 1, 1, 2], ["fio_seda", 1, 2, 4]], moeda: [8, 20] },
    { w: 1, t: "🌟 seu rosto saiu na capa de uma revista!", moeda: [40, 90], efeito: { fama: 5 } }] }));
def("passear", M.evento({ titulo: "passear por Paris", e: "🚶", stat: "passeios", chave: "passear", en: 2, cd: 60000, xp: 6, pool: [
    { w: 4, t: "🥐 você tomou café e viu a vida passar na calçada.", en: 3 },
    { w: 3, t: "🪙 você achou moedas no chão!", moeda: [3, 12] },
    { w: 3, t: "👋 você encontrou uns amigos e deu boas risadas.", efeito: { amigo: 4 } },
    { w: 2, t: "🦋 uma borboleta escura voou por perto... alerta de akuma!", drops: [["fragmento_akuma", 0.4, 1, 1]] },
    { w: 1, t: "🌧️ tempestade repentina! você se molhou todo(a).", hp: -3 }] }));
def("descansar", M.fnDescansar({ e: "🛏️", txt: "você tirou um cochilo na Padaria e recarregou as energias!", cd: 300000, cura: 0.6, curaEn: 0.6 }));

// ═══════════ SOCIAL (7) ═══════════
def("conversar", (a) => {
    const p = a.p;
    if (p.en < 4) return `⚡ energia insuficiente (4).`;
    const f = M.cd(p, "conversar"); if (f) return M.msgCd(f);
    const alvo = norm(a.args[0] || "");
    const k = Object.keys(NPCS).find(x => x === alvo) || pick(Object.keys(NPCS));
    p.en -= 4; M.setCd(p, "conversar", 90000); M.stat(p, "conversou");
    const antes = p.x.npcs[k] || 0, ganho = rand(4, 9);
    p.x.npcs[k] = antes + ganho;
    const linhas = [`💬 *papo com ${NPCS[k].n}* ${NPCS[k].e}`, pick(["vocês riram de uma fofoca da escola.", "trocaram ideia sobre os heróis de Paris.", "ela(e) te contou os últimos acontecimentos.", "vocês fizeram um trabalho juntos."]), `👥 amizade: ${p.x.npcs[k]} pts${antes < 50 && p.x.npcs[k] >= 50 ? `\n🤝 *vocês agora são melhores amigos!*` : ""}`];
    if (p.x.npcs[k] >= 50 && chance(0.2)) { const g = pick(["macaron", "croissant", "crepe"]); M.add(p, g, 1); linhas.push(`🎁 seu amigo te deu 1x ${M.nome(g)}!`); }
    return linhas.join("\n") + M.ganharXp(p, 8);
});
def("amigos", (a) => {
    const l = Object.entries(a.p.x.npcs).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${NPCS[k].e} ${NPCS[k].n}: ${v} pts${v >= 50 ? " 🤝" : ""}`);
    return M.box("amigos", l.length ? [...l, `👥 melhores amigos: ${amigos(a.p)}`] : [`ninguém ainda — use ${a.cmd("conversar")}`]);
});
def("presentear", M.fnPresentear());
def("transferir", M.fnTransferir());
def("romance", (a) => {
    const p = a.p, t = norm(a.args[0] || "");
    if (t === "terminar") { if (!p.x.romance) return `💔 você não tem romance nenhum.`; const n = ROMANCES[p.x.romance.k].n; p.x.romance = null; return `💔 você terminou com ${n}.`; }
    const k = Object.keys(ROMANCES).find(x => x === t);
    if (!p.x.romance) {
        if (!k) return M.box("romances", [...Object.entries(ROMANCES).map(([id, r]) => `${r.e} *${id}* — ${r.n}`), `escolha: ${a.cmd("romance")} <nome>`]);
        p.x.romance = { k, pts: 10 };
        return `💘 você deu o primeiro passo com ${ROMANCES[k].e} *${ROMANCES[k].n}*! use ${a.cmd("romance")} pra sair em encontros.`;
    }
    const r = p.x.romance, def_ = ROMANCES[r.k];
    if (p.en < 8) return `⚡ energia insuficiente (8).`;
    if (p.moeda < 20) return `💸 o encontro custa ${E} 20.`;
    const f = M.cd(p, "romance"); if (f) return M.msgCd(f);
    p.moeda -= 20; p.en -= 8; M.setCd(p, "romance", 900000); M.stat(p, "encontros");
    const g = rand(8, 15), antes = r.pts; r.pts += g; M.addBuff(p, "sorte", 20, 1200000);
    return `🍷 *encontro com ${def_.e} ${def_.n}*\n${pick(["um passeio de barco no Sena ao pôr do sol.", "sorvete na Torre Eiffel.", "cinema e pipoca compartilhada.", "um piquenique no parque."])}\n💞 afinidade: ${r.pts}${antes < 100 && r.pts >= 100 ? `\n💖 *vocês estão namorando oficialmente!*` : ""}\n💸 -${E} 20 · 🍀 sorte +20 por 20 min${M.ganharXp(p, 12)}`;
});
def("quiz", (a) => {
    const p = a.p;
    const f = M.cd(p, "quiz"); if (f) return M.msgCd(f);
    const i = rand(0, CURIOSIDADES.length - 1), q = CURIOSIDADES[i];
    p.x.quiz = { i, ate: Date.now() + 120000 };
    return `🧠 *quiz Miraculous!*\n${q.q}\n\n${q.o.map((t, j) => `${"abc"[j]}) ${t}`).join("\n")}\n\nresponda com *${a.cmd("responder")} a|b|c* (2 min)`;
});
def("responder", (a) => {
    const p = a.p;
    if (!p.x.quiz || p.x.quiz.ate < Date.now()) { p.x.quiz = null; return `🧠 nenhum quiz ativo. use ${a.cmd("quiz")}!`; }
    const l = "abc".indexOf(norm(a.args[0] || "")[0]);
    if (l < 0) return `usa: ${a.cmd("responder")} a|b|c`;
    const q = CURIOSIDADES[p.x.quiz.i]; p.x.quiz = null; M.setCd(p, "quiz", 60000);
    if (l === q.c) { const g = rand(15, 35); p.moeda += g; M.stat(p, "quizacertos"); return `✅ *acertou!* a resposta era "${q.o[q.c]}".\n${E} +${g}${M.ganharXp(p, 15)}`; }
    return `❌ errou! a resposta certa era "${q.o[q.c]}". tente outro quiz!`;
});

// ═══════════ ITENS (8) ═══════════
def("craftar", M.fnCraft(receitas, "criou"));
def("receitas", M.fnReceitas(receitas, "receitas"));
def("comer", (a) => { a.usoNome = "comer"; return M.fnUsar(["comida"])(a); });
def("usar", (a) => { a.usoNome = "usar"; return M.fnUsar(["comida", "consumivel"])(a); });
def("descartar", M.fnDescartar());
def("guardar", M.fnGuardar());
def("retirar", M.fnRetirar());
def("bau", M.fnBau());

// ═══════════ ECONOMIA (8) ═══════════
def("loja", M.fnLoja(LOJA, "padaria & loja do Mestre Fu"));
def("comprar", M.fnComprar([LOJA]));
def("vender", M.fnVender());
def("depositar", M.fnDepositar());
def("sacar", M.fnSacar());
def("saldo", M.fnSaldo());
def("apostar", M.fnApostar({ nome: "apostar", e: "🎰", max: 2000 }));
def("caixa", (a) => {
    const p = a.p, custo = 120;
    if (p.nivel < 5) return `🔒 a Caixa Miraculous abre no nível 5.`;
    if (p.moeda < custo) return `📦 a caixa custa ${E} ${custo}. você tem ${E} ${fmt(p.moeda)}.`;
    const f = M.cd(p, "caixa"); if (f) return M.msgCd(f);
    M.setCd(p, "caixa", 600000); p.moeda -= custo;
    const r = Math.random();
    const rar = r < 0.6 ? ["⚪ comum", [["fio_seda", 1, 3, 6], ["tecido_magico", 0.6, 1, 2], ["macaron", 0.8, 1, 3]]] : r < 0.9 ? ["🔵 rara", [["titanio", 1, 1, 3], ["tecido_magico", 1, 2, 3], ["cristal_miraculous", 0.2, 1, 1]]] : r < 0.99 ? ["🟣 épica", [["cristal_miraculous", 1, 1, 2], ["po_estelar", 0.7, 1, 1], ["titanio", 1, 2, 4]]] : ["🟡 LENDÁRIA", [["pena_pavao", 1, 1, 1], ["cristal_miraculous", 1, 2, 3], ["po_estelar", 1, 2, 3]]];
    const got = M.rolar(p, rar[1]); M.stat(p, "caixas");
    return `📦 *Caixa Miraculous* (${rar[0]})\n🎁 ${Object.keys(got).length ? M.txtItens(got) : "vazia..."}\n💸 -${E} ${custo}${M.ganharXp(p, 12)}`;
});

// ═══════════ ESCONDERIJO (3) ═══════════
def("base", M.fnBase());
def("melhorar", M.fnMelhorarBase());
def("renda", M.fnRenda());

module.exports = { TABELA: M.TABELA, SECOES };
