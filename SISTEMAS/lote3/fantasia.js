const { criar, rand, pick, chance, fmt, norm, clamp, horaBR, dia } = require("./_motor.js");
const G = "🪙";

// ── ITENS ───────────────────────────────────────────────
const ITENS = {}, LOJA = {};
const add = (cat, id, n, e, tipo, preco, extra = {}) => {
    ITENS[id] = { n, e, tipo, v: Math.max(1, Math.floor(preco * 0.4)), ...extra };
    if (cat) cat[id] = preco;
};
// materiais (id, nome, emoji, valor de venda)
[["madeira", "Madeira", "🪵", 2], ["pedra", "Pedra", "🪨", 2], ["carvao", "Carvão", "⚫", 3], ["ferro_bruto", "Minério de Ferro", "🔩", 6],
 ["prata_bruta", "Prata Bruta", "🥈", 14], ["ouro_bruto", "Ouro Bruto", "🥇", 20], ["mithril_bruto", "Mithril Bruto", "🔷", 45], ["adamantita_bruta", "Adamantita Bruta", "🟣", 90],
 ["lingote_ferro", "Lingote de Ferro", "⛓️", 14], ["lingote_aco", "Lingote de Aço", "🔗", 30], ["lingote_prata", "Lingote de Prata", "🥈", 35], ["lingote_ouro", "Lingote de Ouro", "🥇", 50],
 ["lingote_mithril", "Lingote de Mithril", "🔹", 110], ["lingote_adamantita", "Lingote de Adamantita", "💠", 220], ["lingote_draconico", "Lingote Dracônico", "🐲", 600],
 ["escama_dragao", "Escama de Dragão", "🐉", 300], ["couro", "Couro", "🟫", 5], ["pele_lobo", "Pele de Lobo", "🐺", 8], ["osso", "Osso", "🦴", 3], ["presa", "Presa", "🦷", 10],
 ["fio_aranha", "Fio de Aranha", "🕸️", 6], ["erva_cura", "Erva Curativa", "🌿", 4], ["erva_mana", "Flor de Mana", "🌸", 6], ["raiz_forte", "Raiz Forte", "🥕", 6],
 ["cogumelo", "Cogumelo", "🍄", 4], ["essencia", "Essência Mágica", "✨", 25], ["gema_rubi", "Rubi", "❤️", 60], ["gema_safira", "Safira", "💙", 60], ["gema_esmeralda", "Esmeralda", "💚", 70],
 ["gema_diamante", "Diamante", "💎", 150], ["cristal_mana", "Cristal de Mana", "🔮", 40], ["osso_antigo", "Osso Antigo", "💀", 30], ["ectoplasma", "Ectoplasma", "👻", 35],
 ["coracao_hidra", "Coração de Hidra", "🫀", 200], ["olho_lich", "Olho do Lich", "👁️", 250], ["chifre_demonio", "Chifre de Demônio", "😈", 320], ["pena_grifo", "Pena de Grifo", "🪶", 50],
 ["carne_crua", "Carne Crua", "🥩", 4], ["peixe_cru", "Peixe Cru", "🐟", 4], ["ovo", "Ovo", "🥚", 3], ["pergaminho", "Pergaminho Antigo", "📜", 35], ["ovo_dragao", "Ovo de Dragão", "🥚", 900],
 ["chave_abismo", "Chave do Abismo", "🗝️", 5], ["coroa_goblin", "Coroa Goblin", "👑", 80]]
    .forEach(([id, n, e, v]) => add(null, id, n, e, "material", 0, { v }));
// comidas e poções
add(LOJA, "pao", "Pão", "🍞", "comida", 8, { ef: { hp: 8 } });
add(LOJA, "carne_assada", "Carne Assada", "🍖", "comida", 12, { ef: { hp: 18 } });
add(null, "peixe_assado", "Peixe Assado", "🍣", "comida", 0, { ef: { hp: 14, en: 3 }, v: 6 });
add(null, "sopa_cogumelo", "Sopa de Cogumelo", "🍲", "comida", 0, { ef: { hp: 20, en: 6 }, v: 8 });
add(null, "guisado", "Guisado Rico", "🥘", "comida", 0, { ef: { hp: 35, en: 8 }, v: 16 });
add(null, "torta", "Torta de Maçã", "🥧", "comida", 0, { ef: { hp: 15, en: 10 }, v: 10 });
add(LOJA, "frasco", "Frasco Vazio", "🧪", "item", 5);
add(LOJA, "pocao_cura", "Poção de Cura", "🧪", "pocao", 30, { ef: { hp: 40 } });
add(null, "pocao_cura_maior", "Poção de Cura Maior", "💖", "pocao", 0, { ef: { hp: 100 }, v: 60 });
add(LOJA, "pocao_mana", "Poção de Mana", "🔷", "pocao", 30, { ef: { en: 30 } });
add(null, "pocao_forca", "Poção de Força", "💪", "pocao", 0, { ef: { buff: ["atk", 6, 600000] }, v: 25 });
add(null, "pocao_defesa", "Poção de Defesa", "🛡️", "pocao", 0, { ef: { buff: ["def", 5, 600000] }, v: 25 });
add(null, "pocao_sorte", "Poção da Sorte", "🍀", "pocao", 0, { ef: { buff: ["sorte", 30, 900000] }, v: 30 });
add(null, "elixir_sabedoria", "Elixir da Sabedoria", "📖", "pocao", 0, { ef: { buff: ["xp", 25, 900000] }, v: 60 });
// estações e utilitários
add(LOJA, "forja", "Forja", "🔥", "estacao", 120);
add(LOJA, "alambique", "Alambique", "⚗️", "estacao", 150);
add(LOJA, "altar_encantamento", "Altar de Encantamento", "🕯️", "estacao", 400);
add(LOJA, "tocha", "Tocha", "🔦", "item", 5);
add(LOJA, "vara_pesca", "Vara de Pescar", "🎣", "ferramenta", 30, { grupo: "vara", tier: 0, dur: 70 });
// ferramentas e armas por tier
const TIERS = [["ferro", "de Ferro", "lingote_ferro"], ["aco", "de Aço", "lingote_aco"], ["mithril", "de Mithril", "lingote_mithril"], ["adamantita", "de Adamantita", "lingote_adamantita"], ["draconico", "Dracônico", "lingote_draconico"]];
const FAMILIAS = { espada: { n: "Espada", e: "🗡️", fem: true }, cajado: { n: "Cajado", e: "🪄", fem: false }, arco: { n: "Arco", e: "🏹", fem: false }, adaga: { n: "Adaga", e: "🔪", fem: true }, maca: { n: "Maça", e: "🔨", fem: true } };
const ATK = [4, 8, 14, 22, 34], DEFA = [3, 6, 10, 16, 25], NVT = [1, 6, 12, 20, 30], DUR = [80, 150, 260, 420, 700], VAL = [30, 90, 260, 700, 2500];
const receitas = {};
TIERS.forEach(([t, sfx, mat], i) => {
    const suf = (fem) => (t === "draconico" ? (fem ? "Dracônica" : "Dracônico") : sfx);
    for (const [k, f] of Object.entries(FAMILIAS)) {
        add(i === 0 ? LOJA : null, `${k}_${t}`, `${f.n} ${suf(f.fem)}`, f.e, "arma", i === 0 ? 70 : 0, { slot: "arma", atk: ATK[i], dur: DUR[i], nv: NVT[i], classe: k, tier: i, v: VAL[i] });
        receitas[`${k}_${t}`] = i === 4 ? { i: { [mat]: 3, essencia: 5, osso_antigo: 3 }, est: "forja", xp: 200, nv: NVT[i] } : { i: { [mat]: 3 + i * 2, madeira: 2 }, est: "forja", xp: 15 + i * 25, nv: NVT[i] };
    }
    add(i === 0 ? LOJA : null, `armadura_${t}`, `Armadura ${suf(true)}`, "🛡️", "armadura", i === 0 ? 120 : 0, { slot: "armadura", def: DEFA[i], dur: DUR[i], nv: NVT[i], tier: i, v: VAL[i] });
    receitas[`armadura_${t}`] = i === 4 ? { i: { [mat]: 5, essencia: 8, escama_dragao: 3 }, est: "forja", xp: 260, nv: NVT[i] } : { i: { [mat]: 5 + i * 3, couro: 4 }, est: "forja", xp: 20 + i * 30, nv: NVT[i] };
    if (i <= 3) {
        [["picareta", "Picareta", "⛏️"], ["machado", "Machado", "🪓"], ["foice", "Foice", "🌾"]].forEach(([g, n, e]) => {
            if (!(g === "picareta" && false)) add(i === 0 ? LOJA : null, `${g}_${t}`, `${n} ${sfx}`, e, "ferramenta", i === 0 ? 40 : 0, { grupo: g, tier: i, dur: [70, 130, 240, 400][i], v: [15, 60, 200, 600][i] });
            receitas[`${g}_${t}`] = { i: { [mat]: 2 + i, madeira: 2 }, est: "forja", xp: 10 + i * 20, nv: [1, 5, 11, 19][i] };
        });
    }
});
add(null, "anel_bronze", "Anel de Bronze", "💍", "acessorio", 0, { slot: "anel", atk: 1, v: 40 });
add(null, "anel_prata", "Anel de Prata", "💍", "acessorio", 0, { slot: "anel", atk: 3, nv: 5, v: 150 });
add(null, "anel_ouro", "Anel de Ouro", "💍", "acessorio", 0, { slot: "anel", atk: 5, nv: 15, v: 500 });
add(null, "anel_lich", "Anel do Lich", "💍", "acessorio", 0, { slot: "anel", atk: 8, nv: 22, v: 1500 });
add(null, "amuleto_madeira", "Amuleto de Madeira", "📿", "acessorio", 0, { slot: "amuleto", def: 1, v: 40 });
add(null, "amuleto_prata", "Amuleto de Prata", "📿", "acessorio", 0, { slot: "amuleto", def: 3, nv: 5, v: 150 });
add(null, "amuleto_ouro", "Amuleto de Ouro", "📿", "acessorio", 0, { slot: "amuleto", def: 5, nv: 15, v: 500 });
add(null, "amuleto_dragao", "Amuleto do Dragão", "📿", "acessorio", 0, { slot: "amuleto", def: 9, nv: 28, v: 2000 });
add(LOJA, "anel_bronze", "Anel de Bronze", "💍", "acessorio", 150, { slot: "anel", atk: 1 });
add(LOJA, "amuleto_madeira", "Amuleto de Madeira", "📿", "acessorio", 120, { slot: "amuleto", def: 1 });
Object.assign(receitas, {
    lingote_aco: { i: { lingote_ferro: 2, carvao: 3 }, est: "forja", xp: 8 },
    lingote_draconico: { i: { lingote_adamantita: 2, escama_dragao: 3 }, est: "forja", xp: 80, nv: 25 },
    anel_prata: { i: { lingote_prata: 3, gema_rubi: 1 }, est: "forja", xp: 40, nv: 5 },
    anel_ouro: { i: { lingote_ouro: 3, gema_diamante: 1 }, est: "forja", xp: 90, nv: 15 },
    amuleto_prata: { i: { lingote_prata: 4, gema_safira: 1 }, est: "forja", xp: 40, nv: 5 },
    amuleto_ouro: { i: { lingote_ouro: 4, gema_esmeralda: 1, essencia: 2 }, est: "forja", xp: 90, nv: 15 }
});
const POCOES = {
    pocao_cura: { i: { erva_cura: 2, frasco: 1 }, est: "alambique", xp: 8 },
    pocao_cura_maior: { i: { erva_cura: 4, essencia: 1, frasco: 1 }, est: "alambique", xp: 20, nv: 8 },
    pocao_mana: { i: { erva_mana: 2, frasco: 1 }, est: "alambique", xp: 8 },
    pocao_forca: { i: { raiz_forte: 2, erva_mana: 1, frasco: 1 }, est: "alambique", xp: 14, nv: 3 },
    pocao_defesa: { i: { raiz_forte: 2, cogumelo: 1, frasco: 1 }, est: "alambique", xp: 14, nv: 3 },
    pocao_sorte: { i: { erva_cura: 1, gema_esmeralda: 1, frasco: 1 }, est: "alambique", xp: 20, nv: 6 },
    elixir_sabedoria: { i: { erva_mana: 3, cristal_mana: 1, essencia: 1, frasco: 1 }, est: "alambique", xp: 30, nv: 10 }
};
const COZINHA = {
    carne_assada: { i: { carne_crua: 1 }, xp: 3 }, peixe_assado: { i: { peixe_cru: 1 }, xp: 3 }, sopa_cogumelo: { i: { cogumelo: 2, erva_cura: 1 }, xp: 6 },
    guisado: { i: { carne_crua: 2, raiz_forte: 1, cogumelo: 1 }, xp: 10, nv: 4 }, torta: { i: { ovo: 2, erva_mana: 1 }, xp: 8, nv: 3 }
};
const FUNDIVEL = { ferro_bruto: "lingote_ferro", prata_bruta: "lingote_prata", ouro_bruto: "lingote_ouro", mithril_bruto: "lingote_mithril", adamantita_bruta: "lingote_adamantita" };

// ── CLASSES / MAGIAS ────────────────────────────────────
const CLASSES = {
    guerreiro: { n: "Guerreiro", e: "⚔️", fam: "espada", d: "resistente e forte (+6 vida, +1 defesa)", bonus: { hp: 6, def: 1 }, poder: "Golpe Furioso",
        passivas: [{ nv: 3, def: 1 }, { nv: 6, atk: 2 }, { nv: 10, def: 2 }, { nv: 15, atk: 3 }, { nv: 20, def: 3 }, { nv: 25, atk: 4 }], sub: ["paladino", "Paladino", 0, 3] },
    mago: { n: "Mago", e: "🧙", fam: "cajado", d: "poder arcano (+8 energia, +1 ataque)", bonus: { en: 8, atk: 1 }, poder: "Bola de Fogo",
        passivas: [{ nv: 3, atk: 1 }, { nv: 6, atk: 2 }, { nv: 10, atk: 2 }, { nv: 15, atk: 3 }, { nv: 20, atk: 3 }, { nv: 25, def: 2 }], sub: ["arquimago", "Arquimago", 4, 0] },
    arqueiro: { n: "Arqueiro", e: "🏹", fam: "arco", d: "precisão mortal (+2 ataque)", bonus: { atk: 2 }, poder: "Olho de Águia",
        passivas: [{ nv: 3, atk: 1 }, { nv: 6, atk: 2 }, { nv: 10, def: 1 }, { nv: 15, atk: 3 }, { nv: 20, atk: 3 }, { nv: 25, atk: 4 }], sub: ["patrulheiro", "Patrulheiro", 3, 1] },
    ladino: { n: "Ladino", e: "🗡️", fam: "adaga", d: "ágil e esperto (+3 energia, +1 ataque, +30 ouro)", bonus: { en: 3, atk: 1, moeda: 30 }, poder: "Sombras",
        passivas: [{ nv: 3, atk: 1 }, { nv: 6, def: 1 }, { nv: 10, atk: 2 }, { nv: 15, atk: 3 }, { nv: 20, def: 2 }, { nv: 25, atk: 4 }], sub: ["assassino", "Assassino", 4, 0] },
    clerigo: { n: "Clérigo", e: "✝️", fam: "maca", d: "cura e proteção (+4 vida, +4 energia)", bonus: { hp: 4, en: 4 }, poder: "Luz Sagrada",
        passivas: [{ nv: 3, def: 1 }, { nv: 6, def: 1 }, { nv: 10, atk: 1 }, { nv: 15, def: 2 }, { nv: 20, def: 3 }, { nv: 25, def: 3 }], sub: ["sumosacerdote", "Sumo Sacerdote", 0, 3] }
};
const MAGIAS = {
    curar: { n: "Curar", e: "💚", nv: 1, custo: 0, en: 8, cd: 60000, run: (p) => { const g = Math.ceil(p.hpMax * 0.35); p.hp = Math.min(p.hpMax, p.hp + g); return `❤️ +${g} de vida`; } },
    bolafogo: { n: "Bola de Fogo", e: "🔥", nv: 3, custo: 100, en: 10, cd: 120000, run: (p, M) => { M.addBuff(p, "atk", 8, 300000); return `⚔️ ataque +8 por 5 min`; } },
    escudoarcano: { n: "Escudo Arcano", e: "🔰", nv: 5, custo: 150, en: 8, cd: 120000, run: (p, M) => { M.addBuff(p, "def", 6, 300000); return `🛡️ defesa +6 por 5 min`; } },
    sabedoria: { n: "Sabedoria", e: "📖", nv: 7, custo: 250, en: 8, cd: 300000, run: (p, M) => { M.addBuff(p, "xp", 25, 600000); return `✨ xp +25% por 10 min`; } },
    sorte: { n: "Fortuna", e: "🍀", nv: 9, custo: 300, en: 10, cd: 300000, run: (p, M) => { M.addBuff(p, "sorte", 30, 600000); return `🍀 sorte +30 por 10 min`; } },
    trovao: { n: "Ira do Trovão", e: "⚡", nv: 12, custo: 600, en: 16, cd: 300000, run: (p, M) => { M.addBuff(p, "atk", 14, 300000); return `⚔️ ataque +14 por 5 min`; } },
    renovacao: { n: "Renovação", e: "🌟", nv: 15, custo: 900, en: 18, cd: 300000, run: (p) => { const g = Math.ceil(p.hpMax * 0.7); p.hp = Math.min(p.hpMax, p.hp + g); return `❤️ +${g} de vida`; } }
};
const PODERES = {
    guerreiro: (p, M) => { M.addBuff(p, "atk", 10, 600000); return `⚔️ *Golpe Furioso!* ataque +10 por 10 min!`; },
    mago: (p, M) => { M.addBuff(p, "atk", 12, 600000); return `🔥 *Bola de Fogo!* ataque +12 por 10 min!`; },
    arqueiro: (p, M) => { M.addBuff(p, "atk", 5, 600000); M.addBuff(p, "sorte", 25, 600000); return `🦅 *Olho de Águia!* ataque +5 e sorte +25 por 10 min!`; },
    ladino: (p, M) => { M.addBuff(p, "moeda", 25, 600000); M.addBuff(p, "def", 5, 600000); return `🌑 *Sombras!* defesa +5 e ouro +25% por 10 min!`; },
    clerigo: (p, M) => { p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * 0.4)); M.addBuff(p, "def", 5, 600000); return `✝️ *Luz Sagrada!* +40% de vida e defesa +5 por 10 min!`; }
};
const passivas = (p) => { const c = CLASSES[p.x.classe]; return c.passivas.filter(x => p.nivel >= x.nv).reduce((s, x) => ({ atk: s.atk + (x.atk || 0), def: s.def + (x.def || 0) }), { atk: 0, def: 0 }); };
const subBonus = (p) => { const c = CLASSES[p.x.classe]; return p.x.sub ? { atk: c.sub[2], def: c.sub[3] } : { atk: 0, def: 0 }; };

// ── INIMIGOS ────────────────────────────────────────────
const mob = (n, e, hp, atk, xp, moeda, drops, nv = 1, d = 0) => ({ n, e, hp, atk, xp, moeda, drops, nv, def: d });
const MOBS_MUNDO = [
    mob("Goblin", "👺", 16, 4, 12, [2, 7], [["couro", 0.4, 1, 2], ["ferro_bruto", 0.1, 1, 1]]),
    mob("Lobo", "🐺", 18, 5, 14, [1, 5], [["pele_lobo", 0.7, 1, 2], ["presa", 0.3, 1, 1], ["carne_crua", 0.5, 1, 2]]),
    mob("Esqueleto", "💀", 22, 6, 18, [3, 9], [["osso", 0.8, 1, 3]]),
    mob("Bandido", "🥷", 28, 7, 24, [6, 16], [["ferro_bruto", 0.3, 1, 2], ["pocao_cura", 0.1, 1, 1]], 3),
    mob("Aranha Gigante", "🕷️", 32, 8, 28, [4, 12], [["fio_aranha", 0.9, 1, 3], ["presa", 0.3, 1, 1]], 4),
    mob("Orc", "👹", 46, 10, 40, [8, 20], [["ferro_bruto", 0.5, 1, 3], ["couro", 0.5, 1, 2], ["prata_bruta", 0.15, 1, 1]], 6),
    mob("Harpia", "🦅", 40, 11, 44, [8, 22], [["pena_grifo", 0.2, 1, 1], ["couro", 0.4, 1, 2]], 8),
    mob("Ogro", "🧌", 70, 13, 60, [12, 30], [["prata_bruta", 0.4, 1, 2], ["presa", 0.5, 1, 2]], 10, 1),
    mob("Troll", "🧌", 90, 15, 78, [16, 38], [["mithril_bruto", 0.1, 1, 1], ["prata_bruta", 0.5, 1, 3]], 13, 1),
    mob("Elemental", "🌪️", 100, 17, 92, [18, 44], [["cristal_mana", 0.4, 1, 1], ["essencia", 0.25, 1, 1]], 16, 2)
];
const MOBS_CRIPTA = [
    mob("Morto-Vivo", "🧟", 60, 12, 55, [10, 26], [["osso_antigo", 0.5, 1, 2], ["ectoplasma", 0.2, 1, 1]], 12),
    mob("Espectro", "👻", 70, 14, 68, [12, 30], [["ectoplasma", 0.6, 1, 2], ["essencia", 0.2, 1, 1]], 14),
    mob("Cavaleiro Negro", "🏴", 95, 17, 90, [18, 44], [["lingote_aco", 0.3, 1, 2], ["osso_antigo", 0.5, 1, 3]], 16, 2),
    mob("Necromante", "🧙‍♂️", 85, 19, 100, [20, 50], [["olho_lich", 0.05, 1, 1], ["pergaminho", 0.3, 1, 1], ["essencia", 0.35, 1, 2]], 18, 1),
    mob("Górgula", "🗿", 120, 20, 118, [24, 58], [["cristal_mana", 0.5, 1, 2], ["gema_safira", 0.2, 1, 1]], 20, 3)
];
const MOBS_ABISMO = [
    mob("Diabrete", "😈", 110, 22, 150, [30, 70], [["chifre_demonio", 0.1, 1, 1], ["essencia", 0.5, 1, 2]], 30, 2),
    mob("Cão Infernal", "🐕‍🦺", 140, 26, 190, [36, 84], [["presa", 0.8, 1, 3], ["chifre_demonio", 0.15, 1, 1]], 30, 3),
    mob("Cavaleiro do Abismo", "☠️", 170, 29, 240, [44, 100], [["lingote_adamantita", 0.3, 1, 2], ["gema_diamante", 0.15, 1, 1]], 30, 4)
];
const BASES = [
    { n: "Barraca", e: "⛺", custo: {}, renda: 0 },
    { n: "Cabana", e: "🛖", custo: { moeda: 150, i: { madeira: 40 } }, renda: 8, nv: 2 },
    { n: "Casa de Pedra", e: "🏠", custo: { moeda: 500, i: { pedra: 80, madeira: 30 } }, renda: 20, nv: 6, drops: [["madeira", 0.6, 1, 3]] },
    { n: "Torre de Guarda", e: "🗼", custo: { moeda: 1800, i: { pedra: 200, lingote_ferro: 20 } }, renda: 50, nv: 11, drops: [["ferro_bruto", 0.5, 1, 3], ["carvao", 0.7, 2, 5]] },
    { n: "Fortaleza", e: "🏯", custo: { moeda: 6000, i: { pedra: 400, lingote_aco: 30 } }, renda: 110, nv: 16, drops: [["lingote_ferro", 0.4, 1, 2], ["prata_bruta", 0.3, 1, 2]] },
    { n: "Castelo", e: "🏰", custo: { moeda: 20000, i: { lingote_mithril: 20, gema_rubi: 5 } }, renda: 240, nv: 22, drops: [["gema_rubi", 0.2, 1, 1], ["mithril_bruto", 0.3, 1, 2]] },
    { n: "Cidadela Real", e: "👑", custo: { moeda: 60000, i: { lingote_adamantita: 20, gema_diamante: 5, essencia: 20 } }, renda: 500, nv: 28, drops: [["gema_diamante", 0.2, 1, 1], ["adamantita_bruta", 0.3, 1, 2]] }
];
const M = criar({
    id: "fantasia", pf: "fa", titulo: "Fantasia RPG", emoji: "🐉",
    moeda: { n: "ouro", e: G }, itens: ITENS,
    inicio: { hp: 28, en: 30, atk: 2, def: 0, moeda: 40, inv: { pao: 3, pocao_cura: 1, tocha: 2 } },
    nivelGanho: { hp: 4, en: 1, atk: 1, def: 0 },
    regen: { hp: 45000, en: 40000 },
    localInicial: "aldeia", cmdDescanso: "taverna", cmdMelhorar: "construir", cmdAdotar: "domar", cmdLocais: "locais", tituloLocais: "reinos e regiões",
    bases: BASES, baseTitulo: "seu domínio",
    morte: { perda: 0.1, txt: ["💀 você tombou em combate... _um curandeiro te achou desacordado._", "💀 suas forças acabaram e tudo escureceu.", "💀 você foi derrotado. sua alma retorna à aldeia!"] },
    boasVindas: "🐉 você chega à aldeia de Eldoria com sua arma, uma tocha e muita coragem. o reino precisa de heróis!",
    tipos: { material: "🧱 materiais", comida: "🍖 comidas", pocao: "🧪 poções", ferramenta: "🛠️ ferramentas", arma: "⚔️ armas", armadura: "🛡️ armaduras", acessorio: "💍 acessórios", estacao: "🔥 estações", item: "📦 itens" },
    locais: {
        aldeia: { n: "Aldeia de Eldoria", e: "🏘️", d: "sua cidade natal, com taverna e mercado.", nv: 1 },
        planicie: { n: "Planícies Verdes", e: "🌾", d: "campos abertos e caminhos de terra.", nv: 1 },
        floresta: { n: "Floresta Encantada", e: "🌲", d: "árvores antigas e criaturas mágicas.", nv: 1 },
        montanha: { n: "Montanhas de Ferro", e: "⛰️", d: "rico em minérios (e trolls).", nv: 2 },
        litoral: { n: "Litoral", e: "🏖️", d: "mar aberto, redes e pescadores.", nv: 3 },
        pantano: { n: "Pântano Sombrio", e: "🐸", d: "névoa densa e criaturas venenosas.", nv: 5 },
        deserto: { n: "Deserto Escaldante", e: "🏜️", d: "areia infinita e tumbas escondidas.", nv: 6 },
        caverna: { n: "Cavernas de Cristal", e: "💎", d: "cristais que brilham no escuro.", nv: 7, exige: { tocha: 1 } },
        ruinas: { n: "Ruínas Antigas", e: "🏛️", d: "restos de um império esquecido.", nv: 9 },
        cripta: { n: "Cripta dos Mortos", e: "⚰️", d: "onde os mortos não descansam.", nv: 12, exige: { tocha: 1 } },
        torre: { n: "Torre do Mago", e: "🗼", d: "magia arcana em cada andar.", nv: 14 },
        vulcao: { n: "Vulcão Ígneo", e: "🌋", d: "lava, cinzas e o covil do dragão.", nv: 20, en: 6, exige: { pocao_defesa: 1 } },
        abismo: { n: "O Abismo", e: "🕳️", d: "o portal para o reino do Senhor Demônio.", nv: 30, en: 8, exige: { chave_abismo: 1 } }
    },
    conquistas: [
        { id: "lenhador", n: "Lenhador", d: "corte 15 árvores", ok: p => (p.stats.lenhar || 0) >= 15, moeda: 30 },
        { id: "mineiro", n: "Mineiro", d: "minere 25 vezes", ok: p => (p.stats.minerar || 0) >= 25, moeda: 60 },
        { id: "ferreiro", n: "Ferreiro", d: "forje 10 itens", ok: p => (p.stats.forjou || 0) >= 10, moeda: 100 },
        { id: "alquimista", n: "Alquimista", d: "prepare 10 poções", ok: p => (p.stats.alquimia || 0) >= 10, moeda: 100 },
        { id: "monstros", n: "Caçador de monstros", d: "derrote 50 inimigos", ok: p => (p.stats.vitorias || 0) >= 50, moeda: 200 },
        { id: "goblinrei", n: "Rei destronado", d: "derrote o Rei Goblin", ok: p => (p.stats.abate_rei_goblin || 0) >= 1, moeda: 150 },
        { id: "hidra", n: "Cortando cabeças", d: "derrote a Hidra", ok: p => (p.stats.abate_hidra_do_pantano || 0) >= 1, moeda: 300 },
        { id: "lich", n: "Morte da Morte", d: "derrote o Lich", ok: p => (p.stats.abate_lich_rei || 0) >= 1, moeda: 600 },
        { id: "dragao", n: "Matador de dragões", d: "derrote o Dragão Ancião", ok: p => (p.stats.abate_dragao_anciao || 0) >= 1, moeda: 1500 },
        { id: "demonio", n: "Salvador de Eldoria", d: "derrote o Senhor Demônio", ok: p => (p.stats.abate_senhor_demonio || 0) >= 1, moeda: 5000 },
        { id: "encantador", n: "Encantador", d: "encante 5 vezes", ok: p => (p.stats.encantou || 0) >= 5, moeda: 150 },
        { id: "domador", n: "Mestre das feras", d: "domestique 2 companheiros", ok: p => (p.stats.domou || 0) >= 2, moeda: 120 },
        { id: "evoluiu", n: "Ascensão", d: "evolua sua classe", ok: p => !!p.x.sub, moeda: 400 },
        { id: "castelo", n: "Senhor das terras", d: "construa um Castelo", ok: p => p.base >= 5, moeda: 800 },
        { id: "rico", n: "Rei do ouro", d: "junte 10.000 de ouro", ok: p => p.moeda + p.banco >= 10000, moeda: 500 },
        { id: "nivel30", n: "Herói lendário", d: "chegue ao nível 30", ok: p => p.nivel >= 30, moeda: 1000 }
    ],
    missoes: [
        { d: "corte 8 árvores", stat: "lenhar", meta: 8, moeda: 30, xp: 30 },
        { d: "minere 8 vezes", stat: "minerar", meta: 8, moeda: 40, xp: 35 },
        { d: "colha ervas 6 vezes", stat: "ervas", meta: 6, moeda: 35, xp: 30 },
        { d: "derrote 5 inimigos", stat: "vitorias", meta: 5, moeda: 50, xp: 45 },
        { d: "forje 2 itens", stat: "forjou", meta: 2, moeda: 40, xp: 35 },
        { d: "prepare 2 poções", stat: "alquimia", meta: 2, moeda: 45, xp: 40 },
        { d: "explore 3 locais", stat: "explorar", meta: 3, moeda: 60, xp: 50 },
        { d: "pesque 5 vezes", stat: "pescar", meta: 5, moeda: 30, xp: 30 },
        { d: "cozinhe 3 pratos", stat: "cozinhou", meta: 3, moeda: 35, xp: 30 }
    ],
    historia: [
        { t: "O Chamado", d: "derrote 3 inimigos.", stat: "vitorias", meta: 3, moeda: 40, xp: 50, item: ["pocao_cura", 2] },
        { t: "Mãos à Obra", d: "corte 10 árvores.", stat: "lenhar", meta: 10, moeda: 60, xp: 60 },
        { t: "Fogo da Forja", d: "forje 3 itens.", stat: "forjou", meta: 3, moeda: 100, xp: 90, item: ["lingote_ferro", 5] },
        { t: "O Rei Goblin", d: "derrote o Rei Goblin.", stat: "abate_rei_goblin", meta: 1, moeda: 250, xp: 200 },
        { t: "Segredos das Ervas", d: "prepare 5 poções.", stat: "alquimia", meta: 5, moeda: 200, xp: 150 },
        { t: "Sombras no Pântano", d: "derrote a Hidra do Pântano.", stat: "abate_hidra_do_pantano", meta: 1, moeda: 500, xp: 350, item: ["essencia", 3] },
        { t: "Poder Arcano", d: "encante 3 vezes.", stat: "encantou", meta: 3, moeda: 400, xp: 300 },
        { t: "Ascensão", d: "explore 10 locais.", stat: "explorar", meta: 10, moeda: 600, xp: 400 },
        { t: "O Rei dos Mortos", d: "derrote o Lich Rei.", stat: "abate_lich_rei", meta: 1, moeda: 1500, xp: 800, item: ["gema_diamante", 2] },
        { t: "Chamas do Vulcão", d: "derrote o Dragão Ancião.", stat: "abate_dragao_anciao", meta: 1, moeda: 3000, xp: 1500, item: ["escama_dragao", 3] },
        { t: "O Portal", d: "explore o portal antigo.", stat: "explorar_portal", meta: 1, moeda: 2000, xp: 1000 },
        { t: "O Senhor Demônio", d: "derrote o Senhor Demônio.", stat: "abate_senhor_demonio", meta: 1, moeda: 8000, xp: 4000 }
    ],
    pets: {
        lobo: { n: "Lobo", e: "🐺", atk: 3, custo: { i: { osso: 6, carne_crua: 3 } }, dieta: ["carne_crua", "carne_assada"] },
        falcao: { n: "Falcão", e: "🦅", atk: 2, custo: { moeda: 80, i: { carne_crua: 2 } }, dieta: ["carne_crua"] },
        cavalo: { n: "Cavalo de Guerra", e: "🐴", atk: 3, custo: { moeda: 250 }, dieta: ["pao", "raiz_forte"], nv: 4 },
        grifo: { n: "Grifo", e: "🦁", atk: 7, custo: { moeda: 900, i: { pena_grifo: 5 } }, dieta: ["carne_assada", "guisado"], nv: 15 },
        golem: { n: "Golem de Pedra", e: "🗿", atk: 6, custo: { moeda: 500, i: { pedra: 40, cristal_mana: 3 } }, dieta: ["cristal_mana"], nv: 12 },
        dragaozinho: { n: "Dragão Filhote", e: "🐲", atk: 11, custo: { moeda: 2000, i: { ovo_dragao: 1 } }, dieta: ["carne_assada", "guisado"], nv: 25 }
    },
    extras: () => ({ classe: "guerreiro", sub: null, magias: ["curar"], enc: {}, contrato: null }),
    aoCriar: (p, esc) => { const f = CLASSES[esc.classe].fam; M.add(p, `${f}_ferro`, 1); p.equip.arma = `${f}_ferro`; },
    bonusAtk: (p) => { const e = p.x.enc, id = p.equip.arma; return passivas(p).atk + subBonus(p).atk + (id && e ? (e[id] || 0) * 2 : 0); },
    bonusDef: (p) => { const e = p.x.enc; return passivas(p).def + subBonus(p).def + ["armadura"].reduce((s, sl) => s + (p.equip[sl] && e ? (e[p.equip[sl]] || 0) : 0), 0); },
    perfilExtra: (p) => [`${CLASSES[p.x.classe].e} classe: ${CLASSES[p.x.classe].n}${p.x.sub ? ` → ${CLASSES[p.x.classe].sub[1]}` : ""}`, `🔮 magias: ${p.x.magias.map(k => MAGIAS[k].n).join(", ")}`, `⚗️ encantamentos: ${Object.keys(p.x.enc).length ? Object.entries(p.x.enc).map(([i, l]) => `${ITENS[i].n} ${l}`).join(", ") : "nenhum"}`]
});
const { def } = M;

const exp = (titulo, e, stat, local, s) => M.evento({ titulo, e, stat, local, chave: titulo, ...s });

// ═══════════ SISTEMA (10) ═══════════
def("comecar", M.fnComecar([{ k: "classe", ops: Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, { d: `${c.e} ${c.d} — poder: ${c.poder}`, bonus: c.bonus }])) }]), { livre: true });
def("perfil", M.fnPerfil());
def("status", M.fnStatus());
def("inv", M.fnInv());
def("equip", M.fnEquip());
def("equipar", (a) => {
    const { id } = M.parseItem(a.args);
    if (id && M.qtd(a.p, id) && ITENS[id].classe && ITENS[id].classe !== CLASSES[a.p.x.classe].fam) return `❌ essa arma é de outra classe. como *${CLASSES[a.p.x.classe].n}* você usa: ${FAMILIAS[CLASSES[a.p.x.classe].fam].n}.`;
    return M.fnEquipar()(a);
});
def("desequipar", M.fnDesequipar());
def("ranking", M.fnRanking(), { livre: true });
def("resetar", M.fnResetar());
const SECOES = [
    { t: "⚙️ sistema", c: ["comecar", "perfil", "status", "inv", "equip", "equipar", "desequipar", "ajuda", "ranking", "resetar"] },
    { t: "📈 progresso", c: ["diario", "missoes", "historia", "conquistas", "locais", "viajar", "dica", "hora", "bestiario"] },
    { t: "⛏️ coleta", c: ["minerar", "lenhar", "ervas", "pescar", "cacar", "garimpar", "cristais", "cavar"] },
    { t: "🔨 ofícios", c: ["forjar", "receitas", "fundir", "cozinhar", "alquimia", "encantar", "reparar", "desmontar"] },
    { t: "🧭 exploração", c: ["ruinas", "cripta", "caverna", "pantano", "torre", "tumba", "vulcao", "floresta", "portal"] },
    { t: "⚔️ combate", c: ["lutar", "lutarcripta", "lutarabismo", "duelo", "arena", "contrato", "goblinrei", "hidra", "lich", "dragao", "demonio"] },
    { t: "🔮 magia & classe", c: ["poder", "magia", "habilidades", "aprender", "classe", "evoluir", "meditar"] },
    { t: "🪙 economia", c: ["loja", "comprar", "vender", "depositar", "sacar", "saldo", "apostar", "taverna", "mercadonegro"] },
    { t: "🐾 companheiros", c: ["domar", "pets", "alimentarpet", "brincarpet"] },
    { t: "🏰 domínio", c: ["base", "construir", "renda"] },
    { t: "🎒 itens & social", c: ["usar", "comer", "descartar", "guardar", "retirar", "bau", "presentear", "transferir"] }
];
def("ajuda", M.fnAjuda(SECOES), { livre: true });

// ═══════════ PROGRESSO (9) ═══════════
def("diario", M.fnDiario({ moeda: [30, 70], itens: [["pao", 2, 4], ["carvao", 1, 4]], xp: 15 }));
def("missoes", M.fnMissoes());
def("historia", M.fnHistoria());
def("conquistas", M.fnConquistas());
def("locais", M.fnLocais());
def("viajar", M.fnViajar());
def("dica", M.fnTexto(["💡 sem forja você não faz armas: compre uma na loja!", "💡 armas só servem pra sua classe — cada uma tem a sua família de armas.", "💡 fundir minério em lingote exige uma forja e carvão.", "💡 magias buffam ataque e defesa — use antes de chefes!", "💡 chefes exigem itens raros: junte essência, ossos antigos e gemas.", "💡 a taverna cura tudo por uma moedinha.", "💡 no nível 15 você pode evoluir sua classe (faevoluir).", "💡 contratos de caça dão bom ouro — veja facontrato.", "💡 poções de defesa são obrigatórias pra entrar no vulcão."]));
def("hora", M.fnTexto(() => { const h = horaBR(); return `🕒 agora são ${String(h).padStart(2, "0")}h em Eldoria\n${h >= 6 && h < 18 ? "☀️ *dia* — as estradas estão seguras (quase)" : "🌙 *noite* — monstros vagam soltos! coragem, herói."}`; }));
def("bestiario", (a) => {
    const l = Object.entries(a.p.stats).filter(([k]) => k.startsWith("abate_")).sort((x, y) => y[1] - x[1]).map(([k, v]) => `• ${k.slice(6).replace(/_/g, " ")}: ${v}`);
    return M.box("bestiário", l.length ? [...l, `total: ${a.p.stats.vitorias || 0} vitórias`] : [`você ainda não derrotou ninguém. use ${a.cmd("lutar")}!`]);
});

// ═══════════ COLETA (8) ═══════════
def("minerar", M.atividade({ titulo: "minerar", chave: "minerar", stat: "minerar", e: "⛏️", en: 3, cd: 20000, xp: 9, local: ["montanha", "caverna", "deserto"], ferr: "picareta", ferrNome: "uma picareta", desgaste: 1, frases: ["pá-pá-pá! a picareta ecoa na rocha.", "você abre um veio brilhante!"], risco: { c: 0.07, dano: [2, 6], falha: false, frases: ["um desabamento te atingiu!", "gases tóxicos da mina te deixaram tonto!"] }, drops: [["pedra", 1, 3, 7], ["carvao", 0.6, 1, 3], ["ferro_bruto", 0.5, 1, 3], ["prata_bruta", 0.2, 1, 2, 1], ["ouro_bruto", 0.15, 1, 1, 1], ["mithril_bruto", 0.07, 1, 1, 2], ["adamantita_bruta", 0.03, 1, 1, 3]] }));
def("lenhar", M.atividade({ titulo: "cortar árvores", chave: "lenhar", stat: "lenhar", e: "🪓", en: 2, cd: 15000, xp: 6, local: ["floresta", "planicie", "pantano"], ferr: "machado", ferrOpc: true, ferrNome: "um machado", desgaste: 1, frases: ["TOC TOC! a árvore cai com um estrondo.", "você derrubou um carvalho centenário!"], drops: [["madeira", 1, 3, 6], ["erva_cura", 0.15, 1, 2], ["cogumelo", 0.2, 1, 2]] }));
def("ervas", M.atividade({ titulo: "colher ervas", chave: "ervas", stat: "ervas", e: "🌿", en: 2, cd: 20000, xp: 7, local: ["floresta", "pantano", "planicie"], ferr: "foice", ferrOpc: true, ferrNome: "uma foice", desgaste: 1, frases: ["você vasculhou o mato atrás de ervas raras."], drops: [["erva_cura", 0.9, 1, 3], ["erva_mana", 0.5, 1, 2], ["raiz_forte", 0.4, 1, 2], ["cogumelo", 0.4, 1, 3]] }));
def("pescar", M.atividade({ titulo: "pescar", chave: "pescar", stat: "pescar", e: "🎣", en: 2, cd: 20000, xp: 8, local: ["litoral", "pantano", "planicie"], ferr: "vara", ferrNome: "uma vara de pescar", desgaste: 1, frases: ["a linha esticou! algo mordeu.", "silêncio, água calma... beliscou!"], drops: [["peixe_cru", 0.9, 1, 3], ["gema_safira", 0.02, 1, 1], ["pergaminho", 0.04, 1, 1]] }));
def("cacar", M.atividade({ titulo: "caçar", chave: "cacar", stat: "cacar", e: "🏹", en: 3, cd: 25000, xp: 10, local: ["floresta", "planicie", "deserto"], frases: ["você rastreou e abateu uma presa."], risco: { c: 0.07, dano: [2, 6], falha: false, frases: ["um javali te acertou!"] }, drops: [["carne_crua", 1, 1, 3], ["couro", 0.6, 1, 2], ["pele_lobo", 0.3, 1, 1], ["osso", 0.2, 1, 1]] }));
def("garimpar", M.atividade({ titulo: "garimpar", chave: "garimpar", stat: "garimpar", e: "🥇", en: 3, cd: 25000, xp: 9, local: ["montanha", "deserto", "caverna"], frases: ["você peneirou cascalho no riacho."], drops: [["ouro_bruto", 0.35, 1, 2], ["prata_bruta", 0.4, 1, 2], ["gema_rubi", 0.04, 1, 1], ["gema_esmeralda", 0.04, 1, 1]], moeda: [3, 12] }));
def("cristais", M.atividade({ titulo: "extrair cristais", chave: "cristais", stat: "cristais", e: "🔮", en: 5, cd: 45000, xp: 25, nv: 7, local: ["caverna", "torre"], ferr: "picareta", ferrMin: 1, ferrNome: "picareta de aço ou melhor", desgaste: 2, frases: ["os cristais cantam quando a picareta os toca."], risco: { c: 0.1, dano: [4, 10], falha: false, frases: ["um cristal explodiu em energia!"] }, drops: [["cristal_mana", 0.8, 1, 3], ["gema_safira", 0.15, 1, 1], ["gema_rubi", 0.15, 1, 1], ["gema_diamante", 0.04, 1, 1, 2], ["essencia", 0.1, 1, 1]] }));
def("cavar", M.atividade({ titulo: "escavar ruínas", chave: "cavar", stat: "cavar", e: "🏺", en: 3, cd: 30000, xp: 12, local: ["ruinas", "deserto", "planicie"], frases: ["você cavou entre pedras antigas e cerâmicas quebradas."], drops: [["pergaminho", 0.25, 1, 1], ["osso_antigo", 0.4, 1, 2], ["ouro_bruto", 0.2, 1, 1]], moeda: [4, 16] }));

// ═══════════ OFÍCIOS (8) ═══════════
def("forjar", M.fnCraft(receitas, "forjou"));
def("receitas", (a) => {
    const t = norm(a.args[0] || "");
    if (t === "pocoes" || t === "alquimia") return M.fnReceitas(POCOES, "poções")({ ...a, args: a.args.slice(1), q: a.args.slice(1).join(" ") });
    if (t === "cozinha") return M.fnReceitas(COZINHA, "cozinha")({ ...a, args: a.args.slice(1), q: a.args.slice(1).join(" ") });
    return M.fnReceitas(receitas, "forja")(a);
});
def("fundir", (a) => {
    const p = a.p;
    const { id, n, tudo } = M.parseItem(a.args);
    if (!id || !FUNDIVEL[id]) return `🔥 *fundir* (precisa de forja + carvão)\nuse: ${a.cmd("fundir")} <minério> [qtd|tudo]\nsuporta: ${Object.keys(FUNDIVEL).map(M.nome).join(", ")}`;
    if (!M.qtd(p, "forja")) return `🔥 você precisa de uma *Forja* (compre na ${a.cmd("loja")}).`;
    const q = tudo ? M.qtd(p, id) : Math.min(n, M.qtd(p, id));
    if (q <= 0) return `você não tem ${M.nome(id)}.`;
    const gasto = Math.ceil(q / 2);
    if (M.qtd(p, "carvao") < gasto) return `⚫ faltam ${gasto - M.qtd(p, "carvao")}x carvão (precisa de ${gasto}).`;
    M.add(p, "carvao", -gasto); M.add(p, id, -q); M.add(p, FUNDIVEL[id], q); M.stat(p, "fundiu", q);
    return `🔥 ${q}x ${M.nome(id)} → ${q}x ${M.nome(FUNDIVEL[id])}\n(gastou ${gasto}x carvão)${M.ganharXp(p, 2 * q)}`;
});
def("cozinhar", M.fnCraft(COZINHA, "cozinhou"));
def("alquimia", M.fnCraft(POCOES, "alquimia"));
def("encantar", (a) => {
    const p = a.p;
    const { id } = M.parseItem(a.args);
    if (!id || !M.qtd(p, id)) return `usa: ${a.cmd("encantar")} <arma ou armadura>`;
    const it = ITENS[id];
    if (!["arma", "armadura"].includes(it.tipo)) return `${M.nome(id)} não pode ser encantado (só armas e armaduras).`;
    if (!M.qtd(p, "altar_encantamento")) return `🕯️ você precisa de um *Altar de Encantamento* (compre na ${a.cmd("loja")}).`;
    const lv = (p.x.enc[id] || 0) + 1;
    if (lv > 5) return `✨ ${M.nome(id)} já está no encantamento máximo (5)!`;
    if (p.nivel < lv * 4) return `🔒 precisa de nível ${lv * 4} pro encantamento ${lv}.`;
    const ess = lv, custo = lv * 60;
    if (M.qtd(p, "essencia") < ess) return `✨ faltam ${ess - M.qtd(p, "essencia")}x Essência Mágica.`;
    if (p.moeda < custo) return `💸 precisa de ${G} ${custo}.`;
    M.add(p, "essencia", -ess); p.moeda -= custo; p.x.enc[id] = lv; M.stat(p, "encantou");
    return `✨ *${M.nome(id)}* encantado! (nível ${lv}/5)\n${it.tipo === "arma" ? `⚔️ +${lv * 2} ataque` : `🛡️ +${lv} defesa`} no total\n(-${ess} essência, -${G} ${custo})${M.ganharXp(p, 30 * lv)}`;
});
def("reparar", (a) => {
    const p = a.p;
    const { id } = M.parseItem(a.args);
    if (!id || !M.qtd(p, id) || !ITENS[id].dur) return `usa: ${a.cmd("reparar")} <item com durabilidade>`;
    const it = ITENS[id], atual = p.dur[id] === undefined ? it.dur : p.dur[id];
    if (atual >= it.dur) return `${M.nome(id)} já está perfeito(a)!`;
    const mat = TIERS[Math.min(it.tier ?? 0, 4)][2];
    if (!M.qtd(p, mat)) return `🔧 pra reparar você precisa de 1x ${M.nome(mat)}.`;
    M.add(p, mat, -1); p.dur[id] = it.dur;
    return `🔧 ${M.nome(id)} foi reparado(a)! (${it.dur}/${it.dur})`;
});
def("desmontar", (a) => {
    const p = a.p;
    const { id } = M.parseItem(a.args);
    if (!id || !M.qtd(p, id)) return `usa: ${a.cmd("desmontar")} <item> — devolve metade dos materiais.`;
    const r = receitas[id];
    if (!r || Object.values(p.equip).includes(id)) return `${M.nome(id)} não pode ser desmontado${Object.values(p.equip).includes(id) ? " (está equipado)" : ""}.`;
    M.add(p, id, -1);
    const got = {};
    for (const [i, q] of Object.entries(r.i)) { const b = Math.floor(q / 2); if (b > 0) { M.add(p, i, b); got[i] = b; } }
    return `🔩 você desmontou ${M.nome(id)}!\n🎁 ${Object.keys(got).length ? M.txtItens(got) : "nada aproveitável..."}`;
});

// ═══════════ EXPLORAÇÃO (9) ═══════════
def("ruinas", exp("explorar as ruínas", "🏛️", "explorar", ["ruinas"], { en: 5, cd: 90000, nv: 9, xp: 45, pool: [
    { w: 4, t: "🏺 você abriu um baú empoeirado entre os escombros.", drops: [["pergaminho", 0.6, 1, 2], ["ouro_bruto", 0.6, 1, 3], ["osso_antigo", 0.5, 1, 2]], moeda: [20, 60] },
    { w: 3, t: "🗿 uma estátua-guardiã despertou e atacou!", hp: -14, drops: [["cristal_mana", 0.5, 1, 2], ["gema_safira", 0.2, 1, 1]] },
    { w: 2, t: "📜 você decifrou uma inscrição antiga.", drops: [["pergaminho", 1, 1, 2], ["essencia", 0.3, 1, 1]] },
    { w: 1, t: "🕳️ o chão cedeu! você caiu num fosso.", hp: -12 }] }));
def("cripta", exp("saquear a cripta", "⚰️", "explorar", ["cripta"], { en: 6, cd: 120000, nv: 12, xp: 60, hpMin: 20, pool: [
    { w: 4, t: "🕯️ você achou tesouros entre os caixões.", drops: [["osso_antigo", 1, 2, 4], ["ectoplasma", 0.5, 1, 2], ["prata_bruta", 0.7, 1, 3]], moeda: [30, 80] },
    { w: 3, t: "👻 fantasmas gritaram e drenaram sua força!", hp: -18, en: -3, drops: [["ectoplasma", 1, 1, 3]] },
    { w: 2, t: "💀 uma maldição antiga te atingiu... mas você resistiu.", hp: -10, drops: [["essencia", 0.5, 1, 1]] },
    { w: 1, t: "💍 dentro do sarcófago real, um anel brilhante!", item: ["anel_prata", 1] }] }));
def("caverna", exp("explorar as cavernas de cristal", "💎", "explorar", ["caverna"], { en: 5, cd: 90000, nv: 7, xp: 40, pool: [
    { w: 4, t: "💎 um veio de cristais puros!", drops: [["cristal_mana", 1, 2, 4], ["gema_rubi", 0.2, 1, 1], ["gema_safira", 0.2, 1, 1]] },
    { w: 3, t: "🕷️ um ninho de aranhas gigantes!", hp: -12, drops: [["fio_aranha", 1, 3, 6], ["presa", 0.5, 1, 1]] },
    { w: 2, t: "🌊 um lago subterrâneo escondia um baú.", moeda: [25, 60], drops: [["ouro_bruto", 0.6, 1, 2]] },
    { w: 1, t: "💥 os cristais explodiram em energia!", hp: -15 }] }));
def("pantano", exp("explorar o pântano", "🐸", "explorar", ["pantano"], { en: 4, cd: 90000, nv: 5, xp: 30, pool: [
    { w: 4, t: "🍄 um campo de cogumelos raros!", drops: [["cogumelo", 1, 3, 6], ["erva_cura", 0.8, 1, 3]] },
    { w: 3, t: "🐍 cobras venenosas te morderam!", hp: -10, drops: [["presa", 0.6, 1, 2]] },
    { w: 2, t: "🧙 uma bruxa do pântano trocou poções com você.", drops: [["pocao_cura", 1, 1, 2], ["erva_mana", 0.7, 1, 2]], moeda: -10 },
    { w: 1, t: "🪞 você achou os restos de um aventureiro com um baú.", moeda: [30, 80], drops: [["gema_esmeralda", 0.3, 1, 1]] }] }));
def("torre", exp("subir a Torre do Mago", "🗼", "explorar", ["torre"], { en: 6, cd: 120000, nv: 14, xp: 65, pool: [
    { w: 4, t: "📚 a biblioteca da torre tinha grimórios úteis.", drops: [["pergaminho", 1, 1, 3], ["essencia", 0.6, 1, 2], ["erva_mana", 1, 2, 4]] },
    { w: 3, t: "🔮 armadilhas mágicas dispararam!", hp: -16, drops: [["cristal_mana", 1, 1, 3]] },
    { w: 2, t: "🧙 o mago te recompensou por ajudar num experimento.", moeda: [40, 100], drops: [["elixir_sabedoria", 0.3, 1, 1]] },
    { w: 1, t: "🎁 um gólem arcano guardava um tesouro.", hp: -20, drops: [["gema_diamante", 0.4, 1, 1], ["essencia", 1, 2, 3]] }] }));
def("tumba", exp("violar a tumba do faraó", "🏜️", "explorar", ["deserto"], { en: 5, cd: 120000, nv: 6, xp: 40, pool: [
    { w: 4, t: "🏺 a câmara real cheia de joias antigas!", drops: [["ouro_bruto", 1, 2, 4], ["gema_rubi", 0.3, 1, 1]], moeda: [30, 80] },
    { w: 3, t: "🦂 escorpiões gigantes surgiram das paredes!", hp: -12, drops: [["presa", 0.6, 1, 2]] },
    { w: 2, t: "💀 as múmias despertaram!", hp: -15, drops: [["osso_antigo", 1, 1, 3]] },
    { w: 1, t: "👑 o sarcófago escondia uma joia real!", drops: [["gema_esmeralda", 1, 1, 1], ["gema_diamante", 0.2, 1, 1]] }] }));
def("vulcao", exp("explorar o vulcão", "🌋", "explorar", ["vulcao"], { en: 8, cd: 180000, nv: 20, xp: 100, hpMin: 40, pool: [
    { w: 4, t: "🔥 lava cristalizou minérios raros ao seu redor.", drops: [["mithril_bruto", 0.8, 1, 3], ["adamantita_bruta", 0.3, 1, 1], ["carvao", 1, 3, 6]], hp: -18 },
    { w: 3, t: "🐉 filhotes de dragão te atacaram!", hp: -25, drops: [["escama_dragao", 0.2, 1, 1], ["ovo_dragao", 0.03, 1, 1]] },
    { w: 2, t: "🌋 uma erupção! você correu pra salvar a vida.", hp: -30, moeda: [50, 120] },
    { w: 1, t: "💎 um geodo de fogo com uma gema incrível!", drops: [["gema_rubi", 1, 1, 2], ["gema_diamante", 0.4, 1, 1]] }] }));
def("floresta", exp("explorar a floresta encantada", "🌲", "explorar", ["floresta"], { en: 3, cd: 70000, nv: 2, xp: 22, pool: [
    { w: 4, t: "🧚 fadas te guiaram até uma clareira secreta.", drops: [["erva_mana", 1, 2, 4], ["erva_cura", 1, 2, 4], ["essencia", 0.1, 1, 1]] },
    { w: 3, t: "🐺 uma matilha de lobos te cercou!", hp: -8, drops: [["pele_lobo", 1, 1, 3], ["presa", 0.5, 1, 1]] },
    { w: 2, t: "🌳 um ent antigo te deu um presente.", drops: [["madeira", 1, 5, 10], ["pena_grifo", 0.1, 1, 1]] },
    { w: 1, t: "👑 você achou um baú esquecido por um rei goblin.", moeda: [20, 60], drops: [["coroa_goblin", 0.2, 1, 1]] }] }));
def("portal", exp("investigar o portal antigo", "🌀", "explorar_portal", ["ruinas"], { en: 8, cd: 240000, nv: 15, xp: 120, hpMin: 30, pool: [
    { w: 3, t: "🌀 o portal pulsou e uma chave sombria caiu aos seus pés.", item: ["chave_abismo", 1], hp: -10 },
    { w: 3, t: "👁️ olhos sem corpo te observaram do outro lado.", hp: -14, drops: [["essencia", 1, 1, 3], ["ectoplasma", 0.5, 1, 2]] },
    { w: 2, t: "⚡ o portal soltou uma descarga de energia!", hp: -22, drops: [["cristal_mana", 1, 2, 4]] },
    { w: 1, t: "😈 um diabrete escapou e deixou cair um tesouro.", moeda: [80, 180], drops: [["gema_diamante", 0.3, 1, 1]] }] }));

// ═══════════ COMBATE (11) ═══════════
def("lutar", M.combate({ titulo: "lutar pelos caminhos", e: "⚔️", mobs: MOBS_MUNDO, en: 2, cd: 20000, chave: "lutar" }));
def("lutarcripta", M.combate({ titulo: "lutar na cripta", e: "⚰️", mobs: MOBS_CRIPTA, en: 4, cd: 30000, chave: "lutarcripta", local: ["cripta"], nv: 12 }));
def("lutarabismo", M.combate({ titulo: "lutar no Abismo", e: "😈", mobs: MOBS_ABISMO, en: 6, cd: 40000, chave: "lutarabismo", local: ["abismo"], nv: 30 }));
def("duelo", M.fnDuelo());
def("arena", (a) => {
    const p = a.p;
    if (p.nivel < 5) return `🔒 a arena abre no nível 5.`;
    if (p.hp < p.hpMax * 0.7) return `💔 entre na arena com 70%+ de vida!`;
    if (p.en < 5) return `⚡ energia insuficiente (5).`;
    const f = M.cd(p, "arena"); if (f) return M.msgCd(f);
    M.setCd(p, "arena", 1500000); p.en -= 5;
    const el = MOBS_MUNDO.filter(m => m.nv <= p.nivel);
    const n = p.nivel >= 15 ? 5 : p.nivel >= 10 ? 4 : 3;
    const linhas = [`🏟️ *ARENA DE ELDORIA!* ${n} desafiantes te esperam!`];
    let ok = true;
    for (let i = 1; i <= n; i++) {
        const m = { ...pick(el), drops: [], moeda: null, xp: 0 };
        const r = M.lutar(p, m);
        linhas.push(`${r.venceu ? "✅" : "❌"} luta ${i}: ${m.e} ${m.n} (${r.rounds} rounds, -${r.sofrido}❤️)`);
        if (!r.venceu) { ok = false; break; }
    }
    M.stat(p, "arenas");
    if (ok) {
        const g = rand(80, 160) + p.nivel * 8;
        p.moeda += g;
        const got = M.rolar(p, [["essencia", 0.3, 1, 2], ["gema_rubi", 0.1, 1, 1], ["lingote_ferro", 0.6, 2, 5], ["pocao_cura", 0.5, 1, 2]]);
        linhas.push(`🏆 *campeão da arena!* ${G} +${g}${Object.keys(got).length ? `\n🎁 ${M.txtItens(got)}` : ""}${M.ganharXp(p, 90 + p.nivel * 5)}`);
    } else linhas.push(`💀 a plateia vaia...\n${M.morrer(p)}`);
    return linhas.join("\n");
});
def("contrato", (a) => {
    const p = a.p, c = p.x.contrato;
    const prog = c ? (p.stats[`abate_${c.k}`] || 0) - c.b : 0;
    if (/^entregar/i.test(a.args[0] || "")) {
        if (!c) return `📜 você não tem contrato.`;
        if (prog < c.meta) return `📜 faltam ${c.meta - prog} ${c.n} pro contrato.`;
        p.moeda += c.premio; p.x.contrato = null; M.stat(p, "contratos");
        return `📜 *contrato cumprido!* ${G} +${fmt(c.premio)}${M.ganharXp(p, c.meta * 12)}`;
    }
    if (/^abandonar/i.test(a.args[0] || "")) { p.x.contrato = null; return `📜 contrato abandonado.`; }
    if (c) return M.box("contrato ativo", [`🎯 derrotar ${c.meta}x ${c.n}`, `📊 progresso: ${Math.min(prog, c.meta)}/${c.meta}`, `💰 recompensa: ${G} ${fmt(c.premio)}`, prog >= c.meta ? `✅ pronto! use ${a.cmd("contrato")} entregar` : `⚔️ lute e depois entregue`]);
    const el = MOBS_MUNDO.filter(m => m.nv <= p.nivel);
    const m = pick(el), meta = rand(4, 8);
    p.x.contrato = { k: norm(m.n), n: m.n, b: p.stats[`abate_${norm(m.n)}`] || 0, meta, premio: Math.round(meta * (m.xp * 1.4 + (m.moeda ? (m.moeda[0] + m.moeda[1]) / 2 : 0))) };
    return `📜 *novo contrato aceito!*\n🎯 derrote ${meta}x ${m.e} ${m.n}\n💰 recompensa: ${G} ${fmt(p.x.contrato.premio)}\ncumpra e use ${a.cmd("contrato")} entregar`;
});
def("goblinrei", M.boss({ titulo: "Rei Goblin", e: "👑", nv: 8, local: ["floresta"], en: 6, cd: 3600000, chave: "goblinrei", chefe: mob("Rei Goblin", "👺", 110, 12, 300, [80, 160], [["coroa_goblin", 1, 1, 1], ["ferro_bruto", 1, 3, 6], ["couro", 1, 2, 4]], 8, 1), primeira: { moeda: 400, xp: 300, itens: { pocao_cura_maior: 2 } } }));
def("hidra", M.boss({ titulo: "Hidra do Pântano", e: "🐍", nv: 15, local: ["pantano"], en: 10, cd: 7200000, chave: "hidra", exige: { pocao_cura: 2 }, chefe: mob("Hidra do Pântano", "🐉", 200, 19, 900, [300, 600], [["coracao_hidra", 1, 1, 1], ["presa", 1, 3, 6], ["essencia", 0.6, 1, 2]], 15, 2), primeira: { moeda: 800, xp: 600, itens: { gema_esmeralda: 2 } } }));
def("lich", M.boss({ titulo: "Lich Rei", e: "💀", nv: 22, local: ["cripta"], en: 12, cd: 10800000, chave: "lich", exige: { osso_antigo: 5, ectoplasma: 3 }, chefe: mob("Lich Rei", "☠️", 300, 26, 1800, [700, 1200], [["olho_lich", 1, 1, 1], ["anel_lich", 0.3, 1, 1], ["essencia", 1, 2, 4]], 22, 3), primeira: { moeda: 2000, xp: 1200, itens: { anel_lich: 1, gema_diamante: 2 } } }));
def("dragao", M.boss({ titulo: "Dragão Ancião", e: "🐉", nv: 28, local: ["vulcao"], en: 14, cd: 14400000, chave: "dragao", exige: { pocao_defesa: 1, pocao_cura_maior: 1 }, chefe: mob("Dragão Ancião", "🐲", 420, 32, 3500, [1500, 2500], [["escama_dragao", 1, 3, 6], ["ovo_dragao", 0.15, 1, 1], ["gema_diamante", 0.7, 1, 2]], 28, 4), primeira: { moeda: 5000, xp: 2500, itens: { amuleto_dragao: 1, escama_dragao: 5 } } }));
def("demonio", (a) => {
    if (!a.p.flags.boss_dragao) return `🔒 derrote o Dragão Ancião primeiro (${a.cmd("dragao")})!`;
    return M.boss({ titulo: "Senhor Demônio", e: "👿", nv: 33, local: ["abismo"], en: 18, cd: 21600000, chave: "demonio", exige: { chifre_demonio: 2, pocao_cura_maior: 2 }, chefe: mob("Senhor Demônio", "👿", 620, 40, 8000, [3000, 5000], [["chifre_demonio", 1, 2, 4], ["gema_diamante", 1, 2, 4], ["lingote_adamantita", 1, 3, 6]], 33, 5), primeira: { moeda: 15000, xp: 6000, itens: { lingote_draconico: 3, gema_diamante: 5 } } })(a);
});

// ═══════════ MAGIA & CLASSE (7) ═══════════
def("poder", (a) => {
    const p = a.p, c = CLASSES[p.x.classe];
    if (p.en < 15) return `⚡ energia insuficiente (${Math.round(p.en)}/15).`;
    const f = M.cd(p, "poder"); if (f) return M.msgCd(f);
    p.en -= 15; M.setCd(p, "poder", 900000); M.stat(p, "poderes");
    return `${c.e} *${c.poder}*\n${PODERES[p.x.classe](p, M)}\n${M.rodape(p)}${M.ganharXp(p, 10)}`;
});
def("magia", (a) => {
    const p = a.p, t = norm(a.args[0] || "").replace(/_/g, "");
    if (!t) return M.box("grimório", [...Object.entries(MAGIAS).map(([k, m]) => `${p.x.magias.includes(k) ? "✅" : "🔒"} ${m.e} *${k}* — ${m.n} (⚡ ${m.en} · nv ${m.nv})`), `lançar: ${a.cmd("magia")} <nome>`, `aprender: ${a.cmd("aprender")} <nome>`]);
    const k = Object.keys(MAGIAS).find(x => x === t || x.startsWith(t));
    if (!k) return `😕 magia não encontrada. veja ${a.cmd("magia")}`;
    if (!p.x.magias.includes(k)) return `🔒 você ainda não aprendeu *${MAGIAS[k].n}* (${a.cmd("aprender")} ${k}).`;
    const m = MAGIAS[k];
    if (p.en < m.en) return `⚡ energia insuficiente (${Math.round(p.en)}/${m.en}).`;
    const f = M.cd(p, `magia_${k}`); if (f) return M.msgCd(f);
    p.en -= m.en; M.setCd(p, `magia_${k}`, m.cd); M.stat(p, "magias");
    return `${m.e} *${m.n}!*\n${m.run(p, M)}\n${M.rodape(p)}${M.ganharXp(p, 6)}`;
});
def("habilidades", (a) => {
    const p = a.p, c = CLASSES[p.x.classe];
    return M.box(`habilidades — ${c.n}`, [...c.passivas.map(x => `${p.nivel >= x.nv ? "✅" : "🔒"} nv ${x.nv}: ${x.atk ? `⚔️ +${x.atk} ataque ` : ""}${x.def ? `🛡️ +${x.def} defesa` : ""}`), `✨ poder ativo: *${c.poder}* (${a.cmd("poder")})`, p.x.sub ? `🌟 evolução: ${c.sub[1]} (+${c.sub[2]} ataque, +${c.sub[3]} defesa)` : `🌟 evolua no nível 15: ${c.sub[1]}`]);
});
def("aprender", (a) => {
    const p = a.p, t = norm(a.args[0] || "").replace(/_/g, "");
    const k = Object.keys(MAGIAS).find(x => x === t || x.startsWith(t));
    if (!k) return `usa: ${a.cmd("aprender")} <magia> (veja ${a.cmd("magia")})`;
    if (p.x.magias.includes(k)) return `✅ você já sabe *${MAGIAS[k].n}*.`;
    const m = MAGIAS[k];
    if (p.nivel < m.nv) return `🔒 precisa de nível ${m.nv}.`;
    const custo = Math.round(m.custo * (p.x.classe === "mago" ? 0.7 : 1));
    if (p.moeda < custo) return `💸 essa magia custa ${G} ${custo}.`;
    p.moeda -= custo; p.x.magias.push(k); M.stat(p, "aprendeu");
    return `📖 você aprendeu *${m.n}*! ${m.e}\n💸 -${G} ${custo}${M.ganharXp(p, 20)}`;
});
def("classe", (a) => {
    const p = a.p, c = CLASSES[p.x.classe];
    return M.box("sua classe", [`${c.e} *${c.n}*${p.x.sub ? ` → ${c.sub[1]}` : ""}`, c.d, `🗡️ arma: ${FAMILIAS[c.fam].n}`, `✨ poder: ${c.poder}`, `⚔️ ${M.atk(p)} ataque · 🛡️ ${M.defesa(p)} defesa`, p.nivel >= 15 && !p.x.sub ? `🌟 você pode evoluir! ${a.cmd("evoluir")}` : ""].filter(Boolean));
});
def("evoluir", (a) => {
    const p = a.p, c = CLASSES[p.x.classe];
    if (p.x.sub) return `🌟 você já é *${c.sub[1]}*!`;
    if (p.nivel < 15) return `🔒 evolução de classe a partir do nível 15.`;
    if (p.moeda < 800 || M.qtd(p, "essencia") < 5) return `🌟 evoluir pra *${c.sub[1]}* custa ${G} 800 + 5x Essência Mágica.`;
    p.moeda -= 800; M.add(p, "essencia", -5); p.x.sub = c.sub[0]; M.stat(p, "evoluiu");
    if (c.sub[0] === "sumosacerdote") { p.hpMax += 20; p.hp += 20; }
    return `🌟 *ASCENSÃO!* você agora é *${c.sub[1]}*!\n⚔️ +${c.sub[2]} ataque · 🛡️ +${c.sub[3]} defesa${M.ganharXp(p, 300)}`;
});
def("meditar", (a) => {
    const p = a.p;
    const f = M.cd(p, "meditar"); if (f) return M.msgCd(f);
    if (p.en >= p.enMax) return `⚡ sua energia já está cheia.`;
    M.setCd(p, "meditar", 600000);
    const g = Math.ceil(p.enMax * (p.x.classe === "mago" ? 0.6 : 0.4)); p.en = Math.min(p.enMax, p.en + g);
    return `🧘 você meditou em silêncio.\n⚡ +${g} energia\n${M.rodape(p)}${M.ganharXp(p, 4)}`;
});

// ═══════════ ECONOMIA (9) ═══════════
def("loja", M.fnLoja(LOJA, "mercado de Eldoria"));
def("comprar", M.fnComprar([LOJA]));
def("vender", M.fnVender());
def("depositar", M.fnDepositar());
def("sacar", M.fnSacar());
def("saldo", M.fnSaldo());
def("apostar", M.fnApostar({ nome: "apostar", e: "🎲", max: 3000 }));
def("taverna", M.fnDescansar({ e: "🍺", txt: "você se hospedou na Taverna do Javali Dourado e dormiu como uma pedra!", custo: 15, cd: 300000, cura: 1, curaEn: 1 }));
const NEGRO = { essencia: 180, pergaminho: 250, gema_rubi: 400, gema_safira: 400, escama_dragao: 1500, pocao_cura_maior: 150, elixir_sabedoria: 500, pena_grifo: 300, cristal_mana: 250, lingote_mithril: 600, gema_esmeralda: 450, lingote_prata: 200 };
const ofertasNegro = () => { const ks = Object.keys(NEGRO); const d = String(dia()); let h = 0; for (const c of d) h = (h * 31 + c.charCodeAt(0)) % 9973; const r = []; let i = h; while (r.length < 4) { const k = ks[i % ks.length]; if (!r.includes(k)) r.push(k); i += 7; } return r; };
def("mercadonegro", (a) => {
    const p = a.p, of = ofertasNegro();
    if (p.nivel < 8) return `🔒 o mercado negro só aceita heróis a partir do nível 8.`;
    const n = parseInt(a.args[0], 10);
    if (!n) return M.box("mercado negro (renova todo dia)", [...of.map((k, i) => `${i + 1}. ${M.nome(k)} — ${G} ${fmt(NEGRO[k])}`), `comprar: ${a.cmd("mercadonegro")} <número>`, `saldo: ${G} ${fmt(p.moeda)}`]);
    const k = of[n - 1];
    if (!k) return `escolha um número de 1 a ${of.length}.`;
    if (p.moeda < NEGRO[k]) return `💸 faltam ${G} ${fmt(NEGRO[k] - p.moeda)}.`;
    p.moeda -= NEGRO[k]; M.add(p, k, 1); M.stat(p, "compras");
    return `🕶️ negócio fechado: 1x ${M.nome(k)}\n💸 -${G} ${fmt(NEGRO[k])}`;
});

// ═══════════ COMPANHEIROS (4) ═══════════
def("domar", M.fnAdotar());
def("pets", M.fnPets());
def("alimentarpet", M.fnAlimentarPet());
def("brincarpet", M.fnBrincarPet());

// ═══════════ DOMÍNIO (3) ═══════════
def("base", M.fnBase());
def("construir", M.fnMelhorarBase());
def("renda", M.fnRenda());

// ═══════════ ITENS & SOCIAL (6+2) ═══════════
def("usar", (a) => { a.usoNome = "usar"; return M.fnUsar(["pocao", "comida"])(a); });
def("comer", (a) => { a.usoNome = "comer"; return M.fnUsar(["comida"])(a); });
def("descartar", M.fnDescartar());
def("guardar", M.fnGuardar());
def("retirar", M.fnRetirar());
def("bau", M.fnBau());
def("presentear", M.fnPresentear());
def("transferir", M.fnTransferir());

module.exports = { TABELA: M.TABELA, SECOES };
