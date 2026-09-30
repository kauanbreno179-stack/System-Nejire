const { criar, rand, pick, chance, fmt, norm, horaBR, dia } = require("./_motor.js");

// ── ITENS ───────────────────────────────────────────────
const ITENS = {};
const item = (id, n, e, tipo, extra = {}) => { ITENS[id] = { n, e, tipo, ...extra }; };

// materiais
[
    ["madeira", "Madeira", "🪵", 1], ["tabua", "Tábua", "🟫", 1], ["graveto", "Graveto", "🥢", 1], ["pedra", "Pedra", "🪨", 1],
    ["carvao", "Carvão", "⚫", 2], ["ferro_bruto", "Ferro Bruto", "🔩", 3], ["ferro", "Barra de Ferro", "⛓️", 6],
    ["ouro_bruto", "Ouro Bruto", "🪙", 5], ["ouro", "Barra de Ouro", "🥇", 12], ["redstone", "Redstone", "🔴", 3],
    ["lapis", "Lápis-lazúli", "🔵", 4], ["diamante", "Diamante", "💎", 40], ["obsidiana", "Obsidiana", "🟪", 25],
    ["terra", "Terra", "🟤", 1], ["areia", "Areia", "🏖️", 1], ["cascalho", "Cascalho", "⚪", 1], ["vidro", "Vidro", "🔲", 3],
    ["pederneira", "Pederneira", "🔥", 3], ["la", "Lã", "🧶", 3], ["couro", "Couro", "🟠", 4], ["pena", "Pena", "🪶", 2],
    ["osso", "Osso", "🦴", 2], ["polvora", "Pólvora", "💥", 5], ["fio", "Fio", "🕸️", 3], ["olho_aranha", "Olho de Aranha", "👁️", 4],
    ["perola_ender", "Pérola do Ender", "🟢", 20], ["olho_ender", "Olho do Ender", "🧿", 45], ["vara_blaze", "Vara de Blaze", "🔶", 18],
    ["po_blaze", "Pó de Blaze", "🟡", 10], ["verruga_nether", "Verruga do Nether", "🍄", 6], ["lagrima_ghast", "Lágrima de Ghast", "💧", 22],
    ["quartzo", "Quartzo", "⬜", 8], ["netherita_sucata", "Sucata de Netherita", "🟣", 90], ["netherita", "Lingote de Netherita", "🟣", 260],
    ["estrela_nether", "Estrela do Nether", "🌟", 300], ["cranio_wither", "Crânio de Wither", "💀", 60], ["areia_alma", "Areia da Alma", "🟫", 8],
    ["concha_nautilus", "Concha de Nautilus", "🐚", 30], ["coracao_mar", "Coração do Mar", "💠", 120], ["prismarina", "Prismarina", "🔷", 10],
    ["flor", "Flor", "🌼", 2], ["cogumelo", "Cogumelo", "🍄", 3], ["ovo", "Ovo", "🥚", 2], ["mel", "Mel", "🍯", 6], ["leite", "Leite", "🥛", 4],
    ["trigo", "Trigo", "🌾", 2], ["abobora", "Abóbora", "🎃", 5], ["melancia", "Melancia", "🍉", 4], ["fragmento_eco", "Fragmento de Eco", "🔮", 70],
    ["sensor_sculk", "Sensor de Sculk", "🟦", 55], ["elytra", "Elytra", "🪽", 220], ["totem", "Totem da Imortalidade", "🗿", 180],
    ["shulker_casco", "Casco de Shulker", "📦", 60], ["mapa_tesouro", "Mapa do Tesouro", "🗺️", 0]
].forEach(([id, n, e, v]) => item(id, n, e, id === "mapa_tesouro" ? "especial" : "material", { v }));
ITENS.mapa_tesouro.v = 15;
ITENS.elytra.tipo = "especial"; ITENS.totem.tipo = "especial";

// sementes / plantáveis
item("semente_trigo", "Semente de Trigo", "🌱", "semente", { v: 1 });
item("semente_abobora", "Semente de Abóbora", "🎃", "semente", { v: 2 });
item("semente_melancia", "Semente de Melancia", "🍉", "semente", { v: 2 });

// comidas
[
    ["carne_crua", "Carne Crua", "🥩", 2, 2], ["carne_cozida", "Carne Cozida", "🍖", 8, 6], ["peixe_cru", "Peixe Cru", "🐟", 2, 2],
    ["peixe_cozido", "Peixe Cozido", "🍣", 6, 5], ["pao", "Pão", "🍞", 4, 4], ["maca", "Maçã", "🍎", 3, 3], ["cenoura", "Cenoura", "🥕", 2, 2],
    ["batata", "Batata", "🥔", 2, 2], ["batata_assada", "Batata Assada", "🍠", 5, 5], ["bolo", "Bolo", "🍰", 12, 8],
    ["torta_abobora", "Torta de Abóbora", "🥧", 10, 7], ["sopa_cogumelo", "Sopa de Cogumelo", "🍲", 10, 6]
].forEach(([id, n, e, v, hp]) => item(id, n, e, "comida", { v, ef: { hp, en: id === "bolo" || id === "sopa_cogumelo" ? 8 : 0 } }));
item("maca_dourada", "Maçã Dourada", "🍏", "comida", { v: 110, ef: { hp: 20, buff: ["def", 3, 300000], msg: "✨ você sentiu um brilho dourado!" } });
item("cenoura_dourada", "Cenoura Dourada", "🥕", "comida", { v: 80, ef: { hp: 12, en: 10 } });
ITENS.mel.ef = { hp: 2, en: 6 }; ITENS.mel.tipo = "comida"; ITENS.leite.ef = { en: 6 }; ITENS.leite.tipo = "comida";
ITENS.melancia.ef = { hp: 3, en: 3 }; ITENS.melancia.tipo = "comida";

// poções
item("pocao_cura", "Poção de Cura", "🧪", "pocao", { v: 30, ef: { hp: 30 } });
item("pocao_regeneracao", "Poção de Regeneração", "💖", "pocao", { v: 60, ef: { hp: 50 } });
item("pocao_forca", "Poção de Força", "🔥", "pocao", { v: 45, ef: { buff: ["atk", 5, 420000] } });
item("pocao_velocidade", "Poção de Velocidade", "💨", "pocao", { v: 35, ef: { en: 25 } });
item("pocao_resistencia", "Poção de Resistência", "🛡️", "pocao", { v: 45, ef: { buff: ["def", 4, 420000] } });
item("pocao_sorte", "Poção da Sorte", "🍀", "pocao", { v: 50, ef: { buff: ["sorte", 35, 900000] } });

// utilitários
item("garrafa", "Garrafa de Vidro", "🍶", "item", { v: 2 });
item("bancada", "Bancada de Trabalho", "🧰", "estacao", { v: 8 });
item("suporte_pocoes", "Suporte de Poções", "⚗️", "estacao", { v: 40 });
item("mesa_encantamento", "Mesa de Encantamento", "📖", "estacao", { v: 150 });
item("cama", "Cama", "🛏️", "estacao", { v: 15 });
item("isqueiro", "Isqueiro", "🧨", "item", { v: 25 });
item("balde", "Balde", "🪣", "ferramenta", { grupo: "balde", tier: 0, v: 20 });
item("tesoura", "Tesoura", "✂️", "ferramenta", { grupo: "tesoura", tier: 0, dur: 80, v: 15 });
item("vara_pesca", "Vara de Pescar", "🎣", "ferramenta", { grupo: "vara", tier: 0, dur: 70, v: 12 });
item("escudo", "Escudo", "🛡️", "armadura", { slot: "escudo", def: 2, v: 25 });
item("tridente", "Tridente", "🔱", "arma", { slot: "arma", atk: 13, nv: 10, v: 150 });

// ferramentas e armas por nível
const TIERS = [["madeira", "de Madeira", "🪵", 0, 25, 3, "tabua"], ["pedra", "de Pedra", "🪨", 1, 50, 4, "pedra"], ["ferro", "de Ferro", "⛓️", 2, 100, 6, "ferro"], ["diamante", "de Diamante", "💎", 3, 220, 9, "diamante"], ["netherita", "de Netherita", "🟣", 4, 380, 12, "netherita"]];
const receitas = {};
const MAT_TABUA = { tabua: 1 };
for (const [t, sfx, e, tier, dur, atk, mat] of TIERS) {
    const v = [3, 6, 20, 90, 320][tier];
    item(`picareta_${t}`, `Picareta ${sfx}`, "⛏️", "ferramenta", { grupo: "picareta", tier, dur, v });
    item(`machado_${t}`, `Machado ${sfx}`, "🪓", "ferramenta", { grupo: "machado", tier, dur, v });
    item(`pa_${t}`, `Pá ${sfx}`, "🥄", "ferramenta", { grupo: "pa", tier, dur, v: Math.ceil(v * 0.6) });
    item(`espada_${t}`, `Espada ${sfx}`, "🗡️", "arma", { slot: "arma", atk, dur: dur * 2, nv: [1, 2, 4, 9, 16][tier], grupo: "espada", tier, v });
    if (t === "netherita") {
        receitas.picareta_netherita = { i: { picareta_diamante: 1, netherita: 2 }, est: "bancada", xp: 40 };
        receitas.machado_netherita = { i: { machado_diamante: 1, netherita: 2 }, est: "bancada", xp: 40 };
        receitas.pa_netherita = { i: { pa_diamante: 1, netherita: 1 }, est: "bancada", xp: 30 };
        receitas.espada_netherita = { i: { espada_diamante: 1, netherita: 2 }, est: "bancada", xp: 50 };
    } else {
        receitas[`picareta_${t}`] = { i: { [mat]: 3, graveto: 2 }, est: "bancada", xp: 8 + tier * 6 };
        receitas[`machado_${t}`] = { i: { [mat]: 3, graveto: 2 }, est: "bancada", xp: 8 + tier * 6 };
        receitas[`pa_${t}`] = { i: { [mat]: 1, graveto: 2 }, est: "bancada", xp: 5 + tier * 4 };
        receitas[`espada_${t}`] = { i: { [mat]: 2, graveto: 1 }, est: "bancada", xp: 8 + tier * 6 };
    }
}
[["couro", "Armadura de Couro", "🧥", 2, "couro", 8, 1], ["ferro", "Armadura de Ferro", "🥋", 5, "ferro", 8, 3], ["diamante", "Armadura de Diamante", "🦺", 9, "diamante", 8, 8], ["netherita", "Armadura de Netherita", "🟣", 13, null, 0, 16]].forEach(([t, n, e, def, mat, q, nv]) => {
    item(`armadura_${t}`, n, e, "armadura", { slot: "armadura", def, dur: 200, nv, v: [20, 60, 320, 900][["couro", "ferro", "diamante", "netherita"].indexOf(t)] });
    receitas[`armadura_${t}`] = t === "netherita" ? { i: { armadura_diamante: 1, netherita: 4 }, est: "bancada", xp: 90 } : { i: { [mat]: q }, est: "bancada", xp: 15 };
});

Object.assign(receitas, {
    tabua: { i: { madeira: 1 }, q: 4, xp: 1 },
    graveto: { i: { tabua: 2 }, q: 4, xp: 1 },
    bancada: { i: { tabua: 4 }, xp: 3 },
    vara_pesca: { i: { graveto: 3, fio: 2 }, est: "bancada", xp: 5 },
    tesoura: { i: { ferro: 2 }, est: "bancada", xp: 6 },
    balde: { i: { ferro: 3 }, est: "bancada", xp: 6 },
    escudo: { i: { tabua: 6, ferro: 1 }, est: "bancada", xp: 8 },
    garrafa: { i: { vidro: 3 }, q: 3, xp: 3 },
    cama: { i: { la: 3, tabua: 3 }, est: "bancada", xp: 5 },
    isqueiro: { i: { ferro: 1, pederneira: 1 }, xp: 5 },
    suporte_pocoes: { i: { graveto: 1, pedra: 3, vara_blaze: 1 }, est: "bancada", xp: 20, nv: 5 },
    mesa_encantamento: { i: { obsidiana: 4, diamante: 2, lapis: 2 }, est: "bancada", xp: 40, nv: 5 },
    olho_ender: { i: { perola_ender: 1, po_blaze: 1 }, xp: 15 },
    netherita: { i: { netherita_sucata: 4, ouro: 4 }, xp: 50 },
    po_blaze: { i: { vara_blaze: 1 }, q: 2, xp: 4 },
    pao: { i: { trigo: 3 }, xp: 3 },
    bolo: { i: { trigo: 3, ovo: 1, leite: 1 }, xp: 10 },
    torta_abobora: { i: { abobora: 1, ovo: 1, mel: 1 }, xp: 8 },
    sopa_cogumelo: { i: { cogumelo: 2 }, xp: 4 },
    maca_dourada: { i: { maca: 1, ouro: 8 }, xp: 20 },
    cenoura_dourada: { i: { cenoura: 1, ouro: 6 }, xp: 15 }
});
const POCOES = {
    pocao_cura: { i: { verruga_nether: 1, maca: 1, garrafa: 1 }, est: "suporte_pocoes", xp: 12 },
    pocao_regeneracao: { i: { verruga_nether: 1, lagrima_ghast: 1, garrafa: 1 }, est: "suporte_pocoes", xp: 25, nv: 8 },
    pocao_forca: { i: { verruga_nether: 1, po_blaze: 1, garrafa: 1 }, est: "suporte_pocoes", xp: 15 },
    pocao_velocidade: { i: { verruga_nether: 1, mel: 1, garrafa: 1 }, est: "suporte_pocoes", xp: 10 },
    pocao_resistencia: { i: { verruga_nether: 1, ferro: 1, garrafa: 1 }, est: "suporte_pocoes", xp: 12 },
    pocao_sorte: { i: { verruga_nether: 1, ouro: 1, flor: 2, garrafa: 1 }, est: "suporte_pocoes", xp: 18 }
};

// ── CONFIG DO RPG ───────────────────────────────────────
const M = criar({
    id: "minecraft", pf: "mc", titulo: "Minecraft RPG", emoji: "⛏️",
    moeda: { n: "esmeraldas", e: "💚" },
    itens: ITENS,
    inicio: { hp: 24, en: 30, atk: 2, def: 0, moeda: 15, inv: { madeira: 4, pao: 3 } },
    nivelGanho: { hp: 4, en: 1, atk: 1, def: 0 },
    regen: { hp: 45000, en: 40000 },
    localInicial: "planicie", cmdDescanso: "cama", cmdMelhorar: "construir", cmdAdotar: "domar", cmdLocais: "biomas", cmdPlantacao: "plantacao",
    baseTitulo: "sua base", tituloLocais: "biomas",
    morte: { perda: 0.1, txt: ["💀 você morreu! _\"o jogador caiu de um penhasco\"_", "💀 você foi explodido por um creeper... ssssss BOOM!", "💀 você tentou nadar na lava. não recomendo."] },
    boasVindas: "🌍 você nasceu numa planície com 4 madeiras e 3 pães. corte árvores, faça uma bancada e sobreviva à primeira noite!",
    tipos: { material: "🧱 materiais", comida: "🍖 comidas", ferramenta: "🛠️ ferramentas", arma: "⚔️ armas", armadura: "🛡️ armaduras", pocao: "🧪 poções", estacao: "🧰 estações", semente: "🌱 sementes", item: "📦 itens", especial: "🌟 especiais" },
    bases: [
        { n: "Barraca", e: "⛺", custo: {}, renda: 0 },
        { n: "Casa de Madeira", e: "🛖", custo: { moeda: 100, i: { tabua: 40 } }, renda: 10, nv: 2 },
        { n: "Casa de Pedra", e: "🏠", custo: { moeda: 300, i: { pedra: 80 } }, renda: 25, nv: 5, drops: [["trigo", 0.5, 1, 2]] },
        { n: "Fazenda Automática", e: "🚜", custo: { moeda: 800, i: { ferro: 30, redstone: 20 } }, renda: 60, nv: 9, drops: [["trigo", 0.9, 2, 4], ["cenoura", 0.6, 1, 3], ["abobora", 0.4, 1, 2]] },
        { n: "Castelo de Pedra", e: "🏰", custo: { moeda: 2500, i: { pedra: 300, ferro: 40, vidro: 20 } }, renda: 120, nv: 13, drops: [["ferro", 0.5, 1, 3], ["carvao", 0.8, 2, 5]] },
        { n: "Base Subaquática", e: "🫧", custo: { moeda: 7000, i: { prismarina: 40, vidro: 60, coracao_mar: 1 } }, renda: 250, nv: 18, drops: [["prismarina", 0.6, 1, 3], ["concha_nautilus", 0.2, 1, 1]] },
        { n: "Fortaleza de Netherita", e: "🏯", custo: { moeda: 20000, i: { netherita: 4, obsidiana: 60, diamante: 20 } }, renda: 500, nv: 24, drops: [["diamante", 0.4, 1, 2], ["netherita_sucata", 0.15, 1, 1]] }
    ],
    locais: {
        planicie: { n: "Planície", e: "🌾", d: "campo aberto, vaquinhas e ovelhas ao longe.", nv: 1 },
        floresta: { n: "Floresta", e: "🌲", d: "árvores altas e sombra fresca (cuidado à noite!).", nv: 1 },
        montanha: { n: "Montanha", e: "⛰️", d: "pedra pra todo lado. perfeito pra minerar.", nv: 1 },
        caverna: { n: "Cavernas", e: "🕳️", d: "escuro, ecos e minérios brilhando.", nv: 2 },
        deserto: { n: "Deserto", e: "🏜️", d: "areia infinita e templos escondidos.", nv: 3 },
        pantano: { n: "Pântano", e: "🐸", d: "água turva e cabanas de bruxas.", nv: 4 },
        oceano: { n: "Oceano", e: "🌊", d: "mar aberto, naufrágios e monumentos.", nv: 5 },
        selva: { n: "Selva", e: "🌴", d: "vegetação densa e templos antigos.", nv: 8 },
        nether: { n: "Nether", e: "🔥", d: "o inferno. lava, piglins e fortalezas.", nv: 15, en: 6, exige: { isqueiro: 1, obsidiana: 10 } },
        end: { n: "The End", e: "🌌", d: "ilhas flutuantes e o Dragão te esperando.", nv: 25, en: 8, exige: { olho_ender: 4 } }
    },
    conquistas: [
        { id: "madeira", n: "Tirando madeira", d: "corte 10 vezes", ok: p => (p.stats.cortar || 0) >= 10, moeda: 20 },
        { id: "mineiro", n: "Hora de minerar!", d: "minere 25 vezes", ok: p => (p.stats.minerar || 0) >= 25, moeda: 50 },
        { id: "pescador", n: "Pescador nato", d: "pesque 30 vezes", ok: p => (p.stats.pescar || 0) >= 30, moeda: 60 },
        { id: "diamantes", n: "DIAMANTES!", d: "crie uma picareta de diamante", ok: p => (p.stats.craft_picareta_diamante || 0) >= 1, moeda: 150 },
        { id: "exterminador", n: "Exterminador de zumbis", d: "derrote 25 zumbis", ok: p => (p.stats.abate_zumbi || 0) >= 25, moeda: 100 },
        { id: "fazendeiro", n: "Fazendeiro", d: "colha 20 plantações", ok: p => (p.stats.colheitas || 0) >= 20, moeda: 80 },
        { id: "domador", n: "Melhor amigo", d: "domestique um pet", ok: p => (p.stats.adotou || 0) >= 1, moeda: 40 },
        { id: "encantador", n: "Encantador", d: "encante 5 vezes", ok: p => (p.stats.encantou || 0) >= 5, moeda: 120 },
        { id: "lar", n: "Lar doce lar", d: "tenha uma casa de pedra", ok: p => p.base >= 2, moeda: 100 },
        { id: "nether", n: "Portais e chamas", d: "explore o Nether", ok: p => (p.stats.explorarnether || 0) >= 1, moeda: 200 },
        { id: "wither", n: "Matador de Wither", d: "derrote o Wither", ok: p => (p.stats.abate_wither || 0) >= 1, moeda: 500 },
        { id: "dragao", n: "O Fim... ou não?", d: "derrote o Dragão do End", ok: p => (p.stats.abate_dragao_do_end || 0) >= 1, moeda: 2000 },
        { id: "rico", n: "Magnata das esmeraldas", d: "junte 5000 esmeraldas", ok: p => p.moeda + p.banco >= 5000, moeda: 300 },
        { id: "nivel25", n: "Veterano", d: "chegue ao nível 25", ok: p => p.nivel >= 25, moeda: 400 }
    ],
    missoes: [
        { d: "corte 8 árvores", stat: "cortar", meta: 8, moeda: 30, xp: 30 },
        { d: "minere 10 vezes", stat: "minerar", meta: 10, moeda: 45, xp: 40 },
        { d: "pesque 6 vezes", stat: "pescar", meta: 6, moeda: 35, xp: 30 },
        { d: "derrote 5 monstros", stat: "vitorias", meta: 5, moeda: 50, xp: 45 },
        { d: "crie 4 itens", stat: "criou", meta: 4, moeda: 30, xp: 30 },
        { d: "colha 3 plantações", stat: "colheitas", meta: 3, moeda: 40, xp: 35, item: ["semente_trigo", 4] },
        { d: "explore 3 estruturas", stat: "explorar", meta: 3, moeda: 60, xp: 50 },
        { d: "cave terra 8 vezes", stat: "cavar", meta: 8, moeda: 25, xp: 25 },
        { d: "cozinhe 4 vezes", stat: "cozinhou", meta: 4, moeda: 30, xp: 25 }
    ],
    historia: [
        { t: "A Primeira Noite", d: "corte 10 árvores pra sobreviver.", stat: "cortar", meta: 10, moeda: 30, xp: 40, item: ["tabua", 8] },
        { t: "Ferramentas de Pedra", d: "crie 5 itens.", stat: "criou", meta: 5, moeda: 50, xp: 50 },
        { t: "Hora de Minerar", d: "minere 15 vezes.", stat: "minerar", meta: 15, moeda: 80, xp: 70, item: ["carvao", 10] },
        { t: "Fazendeiro", d: "colha 3 plantações.", stat: "colheitas", meta: 3, moeda: 90, xp: 70 },
        { t: "Sobrevivente", d: "derrote 10 monstros.", stat: "vitorias", meta: 10, moeda: 120, xp: 90 },
        { t: "Lar Doce Lar", d: "melhore sua base uma vez.", stat: "melhorias", meta: 1, moeda: 150, xp: 100 },
        { t: "Explorador", d: "explore 8 estruturas.", stat: "explorar", meta: 8, moeda: 200, xp: 130 },
        { t: "Melhor Amigo", d: "domestique um pet.", stat: "adotou", meta: 1, moeda: 150, xp: 100 },
        { t: "Feitiçaria", d: "encante 3 vezes.", stat: "encantou", meta: 3, moeda: 250, xp: 160 },
        { t: "Portais e Chamas", d: "explore o Nether 3 vezes.", stat: "explorarnether", meta: 3, moeda: 400, xp: 250, item: ["olho_ender", 2] },
        { t: "Caçador de Chefes", d: "derrote 2 chefes.", stat: "chefes", meta: 2, moeda: 800, xp: 400 },
        { t: "O Dragão do End", d: "derrote o Dragão do End.", stat: "abate_dragao_do_end", meta: 1, moeda: 3000, xp: 1500, item: ["elytra", 1] }
    ],
    pets: {
        lobo: { n: "Lobo", e: "🐺", atk: 3, custo: { i: { osso: 8 } }, dieta: ["carne_cozida", "carne_crua"] },
        gato: { n: "Gato", e: "🐱", atk: 1, custo: { i: { peixe_cru: 4 } }, dieta: ["peixe_cru", "peixe_cozido"] },
        cavalo: { n: "Cavalo", e: "🐴", atk: 2, custo: { i: { maca: 5, trigo: 10 } }, dieta: ["maca", "trigo", "cenoura"] },
        papagaio: { n: "Papagaio", e: "🦜", atk: 1, custo: { i: { semente_trigo: 6 } }, dieta: ["semente_trigo"] },
        axolote: { n: "Axolote", e: "🦎", atk: 2, custo: { moeda: 60, i: { peixe_cru: 2 } }, dieta: ["peixe_cru"], nv: 5 },
        golem: { n: "Golem de Ferro", e: "🤖", atk: 7, custo: { i: { ferro: 20, abobora: 1 } }, dieta: ["ferro"], nv: 10 }
    },
    aoCriar: (p) => { p.x.enc = {}; },
    bonusAtk: (p) => { const id = p.equip.arma; return id && p.x.enc ? (p.x.enc[id] || 0) * 2 : 0; },
    bonusDef: (p) => ["armadura", "escudo"].reduce((s, sl) => s + (p.equip[sl] && p.x.enc ? (p.x.enc[p.equip[sl]] || 0) : 0), 0),
    perfilExtra: (p) => [`⚗️ encantamentos: ${Object.keys(p.x.enc || {}).length ? Object.entries(p.x.enc).map(([i, l]) => `${ITENS[i].n} ${l}`).join(", ") : "nenhum"}`]
});

const { def } = M;

// ── MOBS ────────────────────────────────────────────────
const mob = (n, e, hp, atk, xp, moeda, drops, nv = 1, d = 0) => ({ n, e, hp, atk, xp, moeda, drops, nv, def: d });
const MOBS_MUNDO = [
    mob("Zumbi", "🧟", 16, 4, 14, [2, 6], [["carne_crua", 0.4, 1, 2], ["ferro_bruto", 0.08, 1, 1], ["batata", 0.1, 1, 1]]),
    mob("Esqueleto", "💀", 14, 5, 15, [2, 6], [["osso", 0.7, 1, 3], ["graveto", 0.3, 1, 2]]),
    mob("Aranha", "🕷️", 14, 5, 15, [2, 6], [["fio", 0.7, 1, 3], ["olho_aranha", 0.35, 1, 1]], 2),
    mob("Creeper", "🟩", 18, 9, 20, [3, 8], [["polvora", 0.8, 1, 3]], 3),
    mob("Afogado", "🧜", 24, 7, 22, [3, 9], [["concha_nautilus", 0.15, 1, 1], ["prismarina", 0.2, 1, 2]], 4),
    mob("Bruxa", "🧙", 30, 9, 32, [5, 14], [["garrafa", 0.5, 1, 2], ["polvora", 0.3, 1, 2], ["pocao_cura", 0.15, 1, 1]], 6),
    mob("Enderman", "🕴️", 45, 11, 45, [6, 16], [["perola_ender", 0.55, 1, 1]], 7, 1),
    mob("Saqueador", "🏴‍☠️", 34, 10, 38, [8, 18], [["ferro_bruto", 0.4, 1, 3], ["maca", 0.15, 1, 1]], 5)
];
const MOBS_NETHER = [
    mob("Piglin Zumbi", "🐷", 44, 12, 55, [10, 22], [["ouro_bruto", 0.6, 1, 3]], 15),
    mob("Hoglin", "🐗", 60, 15, 70, [12, 26], [["carne_crua", 0.8, 2, 4], ["couro", 0.6, 1, 2]], 16, 1),
    mob("Blaze", "🔥", 50, 16, 75, [12, 28], [["vara_blaze", 0.6, 1, 2]], 17),
    mob("Esqueleto Wither", "🦴", 58, 17, 85, [14, 30], [["carvao", 0.7, 2, 4], ["cranio_wither", 0.22, 1, 1], ["osso", 0.5, 1, 3]], 18, 1),
    mob("Ghast", "👻", 46, 18, 90, [14, 32], [["lagrima_ghast", 0.5, 1, 1], ["polvora", 0.5, 1, 3]], 19)
];
const MOBS_END = [
    mob("Endermite", "🐛", 40, 15, 80, [12, 26], [["perola_ender", 0.25, 1, 1]], 25),
    mob("Enderman Sombrio", "🕴️", 90, 22, 140, [25, 60], [["perola_ender", 0.7, 1, 2]], 25, 2),
    mob("Shulker", "📦", 80, 20, 130, [22, 55], [["shulker_casco", 0.45, 1, 1]], 25, 3)
];

// ── FUNÇÕES AUXILIARES DO RPG ───────────────────────────
const fundir = (tabela, comb, chaveStat, titulo, e) => (a) => {
    const p = a.p;
    const { id, n, tudo } = M.parseItem(a.args);
    if (!id || !tabela[id]) return `${e} *${titulo}*\nuse: ${a.cmd(titulo === "fornalha" ? "fornalha" : "cozinhar")} <item> [qtd|tudo]\nsuporta: ${Object.keys(tabela).map(M.nome).join(", ")}`;
    const q = tudo ? M.qtd(p, id) : Math.min(n, M.qtd(p, id));
    if (q <= 0) return `você não tem ${M.nome(id)}.`;
    const gasto = Math.ceil(q / 2);
    const fonte = comb.find(c => M.qtd(p, c) >= gasto);
    if (!fonte) return `🔥 combustível insuficiente! precisa de ${gasto}x ${comb.map(M.nome).join(" ou ")}.`;
    M.add(p, fonte, -gasto); M.add(p, id, -q); M.add(p, tabela[id], q);
    M.stat(p, chaveStat, q);
    return `${e} ${q}x ${M.nome(id)} → ${q}x ${M.nome(tabela[id])}\n(gastou ${gasto}x ${M.nome(fonte)})${M.ganharXp(p, 2 * q)}`;
};
const FUNDIVEL = { ferro_bruto: "ferro", ouro_bruto: "ouro", areia: "vidro", cascalho: "pederneira", netherita_sucata: "netherita_sucata" };
delete FUNDIVEL.netherita_sucata;
const COZINHAVEL = { carne_crua: "carne_cozida", peixe_cru: "peixe_cozido", batata: "batata_assada" };
const COMB = ["carvao", "madeira", "tabua"];

const exp = (titulo, e, stat, local, s) => M.evento({ titulo, e, stat, local, chave: titulo, ...s });
const RARO = [["coracao_mar", 0.02, 1, 1]];

// ═══════════ SISTEMA (10) ═══════════
def("comecar", M.fnComecar([{ k: "skin", ops: { steve: { d: "o clássico aventureiro (+2 vida)", bonus: { hp: 2 } }, alex: { d: "ágil e esperta (+3 energia)", bonus: { en: 3 } }, zumbi: { d: "resistente e podre (+1 defesa)", bonus: { def: 1 } }, enderman: { d: "misterioso (+1 ataque)", bonus: { atk: 1 } } } }]), { livre: true });
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
    { t: "📈 progresso", c: ["diario", "missoes", "historia", "conquistas", "biomas", "viajar", "mapa", "hora", "clima", "dica"] },
    { t: "🪓 coleta", c: ["cortar", "minerar", "cavar", "pescar", "cacar", "tosquiar", "ordenhar", "minerarprofundo", "pescartesouro", "coletar", "colhermel"] },
    { t: "🌱 fazenda", c: ["plantar", "colher", "plantacao"] },
    { t: "🧭 exploração", c: ["explorarcaverna", "minaabandonada", "vilarejo", "templodeserto", "temploselva", "naufragio", "mansao", "fortaleza", "bastiao", "explorarnether", "cidadeend", "tesouro", "baumisterioso"] },
    { t: "⚔️ combate", c: ["lutar", "lutarnether", "lutarend", "raid", "duelo", "guardiao", "wither", "warden", "dragao", "treinar"] },
    { t: "🔨 itens", c: ["craftar", "receitas", "fornalha", "cozinhar", "encantar", "reparar", "pocao", "comer", "usar", "descartar", "guardar", "retirar", "bau"] },
    { t: "💚 economia", c: ["loja", "comprar", "vender", "trocar", "piglin", "presentear", "transferir", "apostar"] },
    { t: "🏠 base & pets", c: ["base", "construir", "renda", "cama", "domar", "pets", "alimentarpet", "brincarpet"] }
];
def("ajuda", M.fnAjuda(SECOES), { livre: true });

// ═══════════ PROGRESSO (10) ═══════════
def("diario", M.fnDiario({ moeda: [30, 60], itens: [["pao", 2, 4], ["carvao", 1, 4]], xp: 15 }));
def("missoes", M.fnMissoes());
def("historia", M.fnHistoria());
def("conquistas", M.fnConquistas());
def("biomas", M.fnLocais());
def("viajar", M.fnViajar());
def("mapa", M.fnTexto((a) => {
    const p = a.p, mk = (k) => (p.local === k ? "📍" : M.cfg.locais[k].e);
    return M.box("mapa-múndi", [`      ${mk("end")} the end`, `      ${mk("nether")} nether`, `${mk("montanha")} ${mk("caverna")} ${mk("deserto")}`, `${mk("floresta")} ${mk("planicie")} ${mk("pantano")}`, `${mk("selva")} ${mk("oceano")} 🌊`, `📍 = você está em ${M.cfg.locais[p.local].n}`]);
}));
def("hora", M.fnTexto(() => {
    const h = horaBR();
    const fase = h >= 6 && h < 18 ? "☀️ *dia* — os monstros dormem (quase todos)" : h >= 18 && h < 20 ? "🌇 *entardecer* — hora de voltar pra casa" : "🌙 *noite* — mais zumbis e creepers por aí!";
    return `🕒 agora são ${String(h).padStart(2, "0")}h no mundo real\n${fase}\n${h >= 18 || h < 6 ? "🍀 à noite, monstros dropam mais itens!" : "🌾 de dia, plantações crescem tranquilas."}`;
}));
def("clima", M.fnTexto(() => {
    const seed = (dia().replace(/-/g, "") * 7 + Math.floor(horaBR() / 4)) % 5;
    return ["☀️ céu limpo, dia lindo pra minerar!", "⛅ nublado, mas sem problemas.", "🌧️ chovendo! ótimo pra pescar (as peixes mordem mais).", "⛈️ tempestade! cuidado com os raios.", "🌫️ neblina densa, difícil enxergar longe."][seed];
}));
def("dica", M.fnTexto(["💡 sempre leve uma bancada: sem ela você não faz ferramentas!", "💡 dica: minere de picareta melhor pra achar minérios raros.", "💡 encantar arma aumenta seu ataque de verdade — vale a pena.", "💡 pets dão bônus de ataque, mas só se estiverem alimentados!", "💡 as poções de força e resistência são vitais contra chefes.", "💡 pra ir ao Nether você precisa de isqueiro + 10 obsidianas.", "💡 fornalha: dois itens gastam só 1 carvão!", "💡 use *mcvender materiais* pra vender tudo de uma vez.", "💡 chefes só podem ser enfrentados com 60%+ de vida."]));

// ═══════════ COLETA (11) ═══════════
def("cortar", M.atividade({ titulo: "cortar árvores", chave: "cortar", stat: "cortar", e: "🪓", en: 2, cd: 15000, xp: 6, local: ["floresta", "planicie", "selva", "pantano"], ferr: "machado", ferrOpc: true, ferrNome: "um machado", frases: ["TOC TOC! a árvore cai com um estrondo.", "você derrubou o tronco mais alto da floresta!"], drops: [["madeira", 1, 3, 6], ["graveto", 0.5, 1, 3], ["maca", 0.12, 1, 1], ["semente_trigo", 0.1, 1, 2]] }));
// machado é opcional: sem ele você corta na mão (com ele rende mais)
def("minerar", M.atividade({ titulo: "minerar", chave: "minerar", stat: "minerar", e: "⛏️", en: 3, cd: 20000, xp: 9, local: ["montanha", "caverna", "deserto"], ferr: "picareta", ferrNome: "uma picareta", desgaste: 1, frases: ["pá-pá-pá! a picareta ecoa na rocha.", "você abre um veio brilhante!", "as pedras cedem e revelam minério."], risco: { c: 0.07, dano: [2, 6], falha: false, frases: ["um pedaço do teto desabou em você!", "uma poça de lava espirrou perto!"] }, drops: [["pedra", 1, 3, 7], ["carvao", 0.6, 1, 3], ["ferro_bruto", 0.4, 1, 2, 1], ["ouro_bruto", 0.2, 1, 1, 2], ["redstone", 0.25, 1, 3, 2], ["lapis", 0.22, 1, 3, 2], ["diamante", 0.07, 1, 1, 2], ["obsidiana", 0.04, 1, 1, 3]] }));
def("cavar", M.atividade({ titulo: "cavar", chave: "cavar", stat: "cavar", e: "🥄", en: 1, cd: 10000, xp: 4, ferr: "pa", ferrOpc: true, ferrNome: "uma pá", frases: ["você cavou um buraco caprichado.", "terra voando pra todo lado!"], drops: [["terra", 1, 3, 6], ["areia", 0.4, 2, 5], ["cascalho", 0.4, 1, 4], ["pederneira", 0.25, 1, 2], ["osso", 0.03, 1, 1]] }));
def("pescar", M.atividade({ titulo: "pescar", chave: "pescar", stat: "pescar", e: "🎣", en: 2, cd: 20000, xp: 8, local: ["planicie", "floresta", "pantano", "oceano", "selva"], ferr: "vara", ferrNome: "uma vara de pescar", desgaste: 1, frases: ["a boia afundou! você fisgou algo!", "silêncio, água calma... beliscou!"], drops: [["peixe_cru", 0.9, 1, 3], ["cogumelo", 0.05, 1, 1], ["graveto", 0.1, 1, 1], ["mapa_tesouro", 0.03, 1, 1], ["couro", 0.06, 1, 1]] }));
def("cacar", M.atividade({ titulo: "caçar animais", chave: "cacar", stat: "cacar", e: "🏹", en: 3, cd: 25000, xp: 10, local: ["planicie", "floresta", "selva", "pantano", "deserto"], ferr: "espada", ferrOpc: true, ferrNome: "uma espada", desgaste: 1, frases: ["você perseguiu e caçou uma presa.", "caçada rápida e eficiente!"], risco: { c: 0.06, dano: [1, 4], frases: ["um javali te acertou!"], falha: false }, drops: [["carne_crua", 1, 1, 3], ["couro", 0.6, 1, 2], ["pena", 0.4, 1, 3], ["osso", 0.2, 1, 1]] }));
def("tosquiar", M.atividade({ titulo: "tosquiar ovelhas", chave: "tosquiar", stat: "tosquiar", e: "✂️", en: 1, cd: 25000, xp: 5, local: ["planicie", "floresta", "montanha"], ferr: "tesoura", ferrNome: "uma tesoura", desgaste: 1, frases: ["bééé! a ovelha ficou peladinha e feliz."], drops: [["la", 1, 2, 4]] }));
def("ordenhar", M.atividade({ titulo: "ordenhar vacas", chave: "ordenhar", stat: "ordenhar", e: "🐄", en: 1, cd: 25000, xp: 5, local: ["planicie", "floresta"], requer: { balde: 1 }, frases: ["muuu! o balde encheu de leite fresquinho."], drops: [["leite", 1, 1, 2], ["couro", 0.05, 1, 1]] }));
def("minerarprofundo", M.atividade({ titulo: "mineração profunda", chave: "minerarprofundo", stat: "minerar", e: "🕳️", en: 6, cd: 60000, xp: 40, nv: 12, local: ["caverna"], ferr: "picareta", ferrMin: 2, ferrNome: "uma picareta de ferro ou melhor", desgaste: 3, frases: ["você desce até a camada de deepslate...", "o som de goteira ecoa no escuro profundo."], risco: { c: 0.15, dano: [6, 14], falha: false, frases: ["a lava jorrou de uma parede!", "um Warden rugiu ao longe e o chão tremeu!"] }, drops: [["diamante", 0.6, 1, 3, 2], ["redstone", 0.7, 2, 5], ["lapis", 0.6, 2, 5], ["ouro_bruto", 0.6, 1, 3], ["obsidiana", 0.25, 1, 2, 3], ["fragmento_eco", 0.05, 1, 1]] }));
def("pescartesouro", M.atividade({ titulo: "pescar tesouros", chave: "pescartesouro", stat: "pescar", e: "🌊", en: 4, cd: 60000, xp: 30, nv: 8, local: ["oceano"], ferr: "vara", ferrNome: "uma vara de pescar", desgaste: 2, frases: ["você lançou a linha nas águas profundas...", "algo pesado puxou a linha!"], drops: [["mapa_tesouro", 0.35, 1, 1], ["concha_nautilus", 0.25, 1, 1], ["prismarina", 0.4, 1, 3], ["coracao_mar", 0.03, 1, 1], ["peixe_cru", 0.8, 2, 4], ["maca_dourada", 0.03, 1, 1]] }));
def("coletar", M.atividade({ titulo: "coletar flores e cogumelos", chave: "coletar", stat: "coletar", e: "🌼", en: 1, cd: 15000, xp: 4, local: ["planicie", "floresta", "pantano", "selva"], frases: ["você passeou colhendo florzinhas."], drops: [["flor", 1, 2, 4], ["cogumelo", 0.5, 1, 3], ["semente_trigo", 0.25, 1, 3], ["semente_abobora", 0.1, 1, 1], ["semente_melancia", 0.1, 1, 1]] }));
def("colhermel", M.atividade({ titulo: "colher mel", chave: "colhermel", stat: "colhermel", e: "🐝", en: 2, cd: 40000, xp: 12, nv: 3, local: ["floresta", "planicie"], requer: { garrafa: 1 }, frases: ["você se aproximou da colmeia com cuidado..."], risco: { c: 0.35, dano: [2, 5], frases: ["as abelhas ficaram bravas e te picaram!"], falha: false }, drops: [["mel", 1, 1, 2]] }));

// ═══════════ FAZENDA (3) ═══════════
const CULTIVOS = {
    trigo: { n: "Trigo", e: "🌾", ms: 300000, custo: { semente_trigo: 1 }, colheita: [["trigo", 2, 4], ["semente_trigo", 0, 2]], xp: 8 },
    cenoura: { n: "Cenoura", e: "🥕", ms: 420000, custo: { cenoura: 1 }, colheita: [["cenoura", 2, 4]], xp: 9 },
    batata: { n: "Batata", e: "🥔", ms: 420000, custo: { batata: 1 }, colheita: [["batata", 2, 4]], xp: 9 },
    abobora: { n: "Abóbora", e: "🎃", ms: 600000, custo: { semente_abobora: 1 }, colheita: [["abobora", 1, 3]], xp: 12, nv: 3 },
    melancia: { n: "Melancia", e: "🍉", ms: 600000, custo: { semente_melancia: 1 }, colheita: [["melancia", 2, 5]], xp: 12, nv: 3 },
    verruga: { n: "Verruga do Nether", e: "🍄", ms: 900000, custo: { verruga_nether: 1 }, colheita: [["verruga_nether", 2, 4]], xp: 20, nv: 10 }
};
def("plantar", M.fnPlantar(CULTIVOS));
def("colher", M.fnColher(CULTIVOS));
def("plantacao", M.fnPlantacao(CULTIVOS));

// ═══════════ EXPLORAÇÃO (13) ═══════════
def("explorarcaverna", exp("explorar caverna", "🕳️", "explorar", ["caverna"], { en: 4, cd: 60000, nv: 2, xp: 20, pool: [
    { w: 4, t: "🕯️ você achou um veio rico de minério!", drops: [["ferro_bruto", 1, 2, 5], ["carvao", 1, 3, 6], ["ouro_bruto", 0.4, 1, 2]] },
    { w: 3, t: "🕷️ um ninho de aranhas! você lutou e escapou.", hp: -6, drops: [["fio", 1, 2, 5], ["olho_aranha", 0.6, 1, 2]] },
    { w: 2, t: "💎 um geodo de ametista brilhante!", drops: [["lapis", 1, 2, 4], ["redstone", 0.7, 2, 4], ["diamante", 0.15, 1, 1]] },
    { w: 2, t: "🌊 uma queda d'água escondida... nada de mais, mas refrescante.", en: 3 },
    { w: 1, t: "💥 um creeper apareceu atrás de você!", hp: -10, moeda: 5 }] }));
def("minaabandonada", exp("mina abandonada", "🚧", "explorar", ["caverna", "montanha"], { en: 5, cd: 90000, nv: 4, xp: 30, pool: [
    { w: 4, t: "📦 um baú esquecido sobre os trilhos!", drops: [["ferro", 0.6, 1, 3], ["pao", 0.8, 2, 4], ["redstone", 0.5, 2, 5], ["graveto", 1, 2, 4]], moeda: 20 },
    { w: 3, t: "🕸️ teias de aranha da cave spider... você foi picado!", hp: -9, drops: [["fio", 1, 3, 6]] },
    { w: 2, t: "🛤️ trilhos cheios de tábuas! ótimo material.", drops: [["tabua", 1, 8, 16], ["ferro_bruto", 0.7, 2, 4]] },
    { w: 1, t: "⚡ você mexeu numa TNT velha e ela explodiu!", hp: -14 }] }));
def("vilarejo", exp("visitar vilarejo", "🏘️", "explorar", ["planicie", "deserto", "montanha"], { en: 3, cd: 90000, nv: 2, xp: 15, pool: [
    { w: 4, t: "🧑‍🌾 os aldeões te deram pão e agradeceram sua visita!", drops: [["pao", 1, 2, 5], ["maca", 0.6, 1, 2]], moeda: 15 },
    { w: 3, t: "🧑‍🏭 o ferreiro te vendeu um mapa por uma pechincha.", item: ["mapa_tesouro", 1], moeda: -10 },
    { w: 2, t: "🌾 você ajudou na colheita e foi recompensado.", drops: [["trigo", 1, 3, 6], ["cenoura", 0.8, 1, 3], ["batata", 0.8, 1, 3]], moeda: 10 },
    { w: 1, t: "🧟 um cerco de zumbis atacou a vila! você defendeu.", hp: -8, moeda: 60, xp: 40 }] }));
def("templodeserto", exp("templo do deserto", "🏜️", "explorar", ["deserto"], { en: 5, cd: 120000, nv: 5, xp: 40, pool: [
    { w: 4, t: "🏺 você abriu os baús do templo com cuidado.", drops: [["ouro", 0.7, 1, 3], ["diamante", 0.2, 1, 1], ["osso", 1, 2, 4], ["polvora", 0.7, 2, 4]], moeda: 30 },
    { w: 2, t: "💥 você pisou na placa de pressão!!! BOOM!", hp: -20 },
    { w: 2, t: "🕳️ armadilha de areia movediça... você saiu por pouco.", hp: -5, drops: [["areia", 1, 4, 8]] }] }));
def("temploselva", exp("templo da selva", "🌴", "explorar", ["selva"], { en: 6, cd: 120000, nv: 8, xp: 55, pool: [
    { w: 4, t: "🗝️ você resolveu o puzzle das alavancas!", drops: [["ouro", 0.8, 2, 4], ["diamante", 0.35, 1, 2], ["ferro", 0.7, 2, 4]], moeda: 50 },
    { w: 3, t: "🏹 flechas de dispenser voaram na sua direção!", hp: -12, drops: [["osso", 0.8, 1, 3]] },
    { w: 1, t: "🪙 um tesouro escondido atrás da parede!", moeda: 150 }] }));
def("naufragio", exp("naufrágio", "🚢", "explorar", ["oceano"], { en: 5, cd: 120000, nv: 6, xp: 45, pool: [
    { w: 4, t: "🧭 você mergulhou e abriu o baú do capitão.", drops: [["ferro", 0.7, 1, 3], ["ouro", 0.5, 1, 2], ["mapa_tesouro", 0.6, 1, 1], ["prismarina", 0.4, 1, 3]], moeda: 25 },
    { w: 3, t: "🧜 afogados te cercaram no casco do navio!", hp: -12, drops: [["concha_nautilus", 0.5, 1, 1]] },
    { w: 1, t: "💠 você achou um Coração do Mar!!", item: ["coracao_mar", 1] }] }));
def("mansao", exp("mansão da floresta", "🏚️", "explorar", ["floresta"], { en: 8, cd: 240000, nv: 14, xp: 90, hpMin: 25, pool: [
    { w: 3, t: "🗿 você derrotou uma horda de vindicadores e achou um Totem!", hp: -25, item: ["totem", 1], moeda: 120 },
    { w: 3, t: "📚 a biblioteca secreta tinha itens valiosos.", drops: [["diamante", 0.8, 1, 3], ["lapis", 1, 4, 8], ["ouro", 0.9, 2, 5]], moeda: 80, hp: -12 },
    { w: 2, t: "☠️ um evocador invocou vexes — você mal escapou!", hp: -35, moeda: 40 }] }));
def("fortaleza", exp("fortaleza subterrânea", "🏰", "explorar", ["caverna", "montanha"], { en: 8, cd: 240000, nv: 13, xp: 85, hpMin: 25, pool: [
    { w: 3, t: "🚪 você encontrou o portal do End (inativo) e um baú de suprimentos.", drops: [["ferro", 1, 3, 6], ["pao", 1, 2, 4], ["ouro", 0.7, 1, 3]], hp: -14, moeda: 70 },
    { w: 3, t: "🐛 peixinhos-de-prata surgiram das paredes!", hp: -18, drops: [["perola_ender", 0.4, 1, 1], ["diamante", 0.25, 1, 1]] },
    { w: 1, t: "💚 salão do portal: uma pérola de ender caiu do baú!", item: ["perola_ender", 2] }] }));
def("bastiao", exp("bastião do Nether", "🏯", "explorar", ["nether"], { en: 9, cd: 300000, nv: 17, xp: 110, hpMin: 40, pool: [
    { w: 3, t: "🪙 o baú de tesouro do bastião estava cheio!", drops: [["ouro", 1, 4, 8], ["netherita_sucata", 0.3, 1, 2], ["diamante", 0.5, 1, 2]], hp: -20, moeda: 120 },
    { w: 3, t: "🐷 brutos de piglin te encurralaram!", hp: -30, drops: [["ouro_bruto", 1, 3, 6], ["netherita_sucata", 0.15, 1, 1]], moeda: 60 },
    { w: 1, t: "🔥 você caiu na lava... mas sobreviveu por milagre.", hp: -40 }] }));
def("explorarnether", exp("explorar o Nether", "🔥", "explorarnether", ["nether"], { en: 6, cd: 90000, nv: 15, xp: 60, hpMin: 20, pool: [
    { w: 4, t: "🍄 você achou um campo de verrugas do Nether.", drops: [["verruga_nether", 1, 3, 7], ["quartzo", 0.7, 2, 5]] },
    { w: 3, t: "🔥 um bando de blazes surgiu na fortaleza!", hp: -16, drops: [["vara_blaze", 0.8, 1, 3], ["po_blaze", 0.6, 1, 2]] },
    { w: 2, t: "🟫 um vale de areia da alma sussurrante...", drops: [["areia_alma", 1, 3, 6], ["osso", 0.7, 2, 4]], hp: -6 },
    { w: 2, t: "💰 ruínas de portal com um baú de ouro!", drops: [["ouro", 0.9, 2, 5], ["obsidiana", 0.6, 1, 3]], moeda: 40 },
    { w: 1, t: "👻 um Ghast disparou uma bola de fogo na sua direção!", hp: -22, drops: [["lagrima_ghast", 0.7, 1, 1]] }] }));
def("cidadeend", exp("cidade do End", "🌆", "explorar", ["end"], { en: 10, cd: 300000, nv: 25, xp: 200, hpMin: 50, pool: [
    { w: 3, t: "🪽 você achou o navio do End e uma ELYTRA!", hp: -30, item: ["elytra", 1], moeda: 200 },
    { w: 4, t: "📦 shulkers guardavam o tesouro da torre.", hp: -25, drops: [["shulker_casco", 0.9, 1, 2], ["diamante", 0.9, 1, 3], ["ouro", 1, 3, 6]], moeda: 150 },
    { w: 2, t: "🌌 uma queda no vazio... você se agarrou na beirada!", hp: -20 }] }));
def("tesouro", exp("caçar tesouro", "🗺️", "explorar", null, { en: 4, cd: 60000, exige: { mapa_tesouro: 1 }, xp: 35, pool: [
    { w: 4, t: "✨ X marca o local! você cavou e achou um baú enterrado.", drops: [["diamante", 0.5, 1, 2], ["ouro", 1, 2, 5], ["ferro", 1, 3, 6], ["lapis", 0.8, 2, 5]], moeda: 60 },
    { w: 2, t: "🏴‍☠️ o tesouro estava guardado por afogados!", hp: -10, drops: [["ouro", 1, 3, 6]], moeda: 90 },
    { w: 1, t: "💠 dentro do baú: um Coração do Mar!", item: ["coracao_mar", 1] }] }));
def("baumisterioso", (a) => {
    const p = a.p;
    const custo = 40;
    if (p.moeda < custo) return `📦 baú misterioso custa 💚 ${custo}. você tem 💚 ${fmt(p.moeda)}.`;
    const f = M.cd(p, "baumis"); if (f) return M.msgCd(f);
    M.setCd(p, "baumis", 600000); p.moeda -= custo;
    const r = Math.random();
    const raridade = r < 0.6 ? ["⚪ comum", [["ferro", 1, 2, 4], ["pao", 1, 2, 5], ["carvao", 1, 3, 6]]] : r < 0.9 ? ["🔵 raro", [["ouro", 1, 2, 4], ["lapis", 1, 3, 6], ["maca_dourada", 0.5, 1, 1]]] : r < 0.99 ? ["🟣 épico", [["diamante", 1, 1, 3], ["pocao_forca", 0.6, 1, 1], ["perola_ender", 0.7, 1, 2]]] : ["🟡 LENDÁRIO", [["netherita_sucata", 1, 2, 4], ["totem", 0.5, 1, 1], ["diamante", 1, 3, 5]]];
    const got = M.rolar(p, raridade[1]);
    M.stat(p, "baus");
    return `📦 *baú misterioso* (${raridade[0]})\n🎁 ${Object.keys(got).length ? M.txtItens(got) : "vazio... que azar!"}\n💸 -💚 ${custo}${M.ganharXp(p, 10)}`;
});

// ═══════════ COMBATE (10) ═══════════
def("lutar", M.combate({ titulo: "lutar", e: "⚔️", mobs: MOBS_MUNDO, en: 2, cd: 20000, chave: "lutar" }));
def("lutarnether", M.combate({ titulo: "lutar no Nether", e: "🔥", mobs: MOBS_NETHER, en: 4, cd: 30000, chave: "lutarnether", local: ["nether"], nv: 15 }));
def("lutarend", M.combate({ titulo: "lutar no End", e: "🌌", mobs: MOBS_END, en: 5, cd: 40000, chave: "lutarend", local: ["end"], nv: 25 }));
def("raid", (a) => {
    const p = a.p;
    if (p.nivel < 8) return `🔒 raids só a partir do nível 8.`;
    if (p.hp < p.hpMax * 0.7) return `💔 comece a raid com 70%+ de vida!`;
    if (p.en < 6) return `⚡ energia insuficiente (6).`;
    const f = M.cd(p, "raid"); if (f) return M.msgCd(f);
    M.setCd(p, "raid", 1800000); p.en -= 6;
    const ondas = [mob("Saqueador", "🏴‍☠️", 30, 9, 0, null, []), mob("Vindicador", "🪓", 42, 13, 0, null, []), mob("Evocador", "🧙", 55, 14, 0, null, [])];
    if (p.nivel >= 15) ondas.push(mob("Ravager", "🦏", 110, 20, 0, null, [], 1, 2));
    const linhas = [`🚨 *RAID!* ${ondas.length} ondas de saqueadores atacam!`];
    let ganhou = true;
    for (let i = 0; i < ondas.length; i++) {
        const r = M.lutar(p, ondas[i]);
        linhas.push(`${r.venceu ? "✅" : "❌"} onda ${i + 1}: ${ondas[i].e} ${ondas[i].n} (${r.rounds} rounds, -${r.sofrido}❤️)`);
        if (!r.venceu) { ganhou = false; break; }
    }
    M.stat(p, "raids");
    if (ganhou) {
        const g = rand(120, 220) + p.nivel * 5; p.moeda += g;
        const got = M.rolar(p, [["totem", 0.12, 1, 1], ["ferro", 1, 3, 6], ["maca_dourada", 0.3, 1, 1]]);
        linhas.push(`🏆 *a vila foi salva!* 💚 +${g}${Object.keys(got).length ? `\n🎁 ${M.txtItens(got)}` : ""}${M.ganharXp(p, 120)}`);
    } else linhas.push(`💀 a raid venceu você...\n${M.morrer(p)}`);
    return linhas.join("\n");
});
def("duelo", M.fnDuelo());
def("guardiao", M.boss({ titulo: "Guardião Ancião", e: "🐡", nv: 12, local: ["oceano"], en: 8, cd: 3600000, chefe: mob("Guardião Ancião", "🐡", 130, 15, 320, [150, 260], [["prismarina", 1, 6, 12], ["coracao_mar", 0.15, 1, 1], ["concha_nautilus", 0.5, 1, 2]], 12, 2), primeira: { moeda: 250, xp: 200, itens: { prismarina: 10 } } }));
def("wither", M.boss({ titulo: "Wither", e: "☠️", nv: 20, en: 10, cd: 7200000, exige: { cranio_wither: 3, areia_alma: 4 }, chefe: mob("Wither", "☠️", 260, 22, 800, [400, 700], [["estrela_nether", 1, 1, 1], ["netherita_sucata", 0.6, 1, 2]], 20, 3), primeira: { moeda: 600, xp: 500, itens: { diamante: 4 } } }));
def("warden", M.boss({ titulo: "Warden", e: "👹", nv: 22, local: ["caverna"], en: 10, cd: 7200000, exige: { sensor_sculk: 1 }, chefe: mob("Warden", "👹", 300, 26, 950, [500, 850], [["fragmento_eco", 1, 3, 6], ["diamante", 0.8, 2, 4], ["netherita_sucata", 0.4, 1, 2]], 22, 4), primeira: { moeda: 800, xp: 650 } }));
def("dragao", M.boss({ titulo: "Dragão do End", e: "🐉", nv: 25, local: ["end"], en: 12, cd: 10800000, chefe: mob("Dragão do End", "🐉", 340, 22, 3000, [1500, 2500], [["perola_ender", 1, 3, 6], ["totem", 0.4, 1, 1]], 25, 3), primeira: { moeda: 3000, xp: 2000, itens: { elytra: 1, diamante: 6 } } }));
def("treinar", M.fnTreinar({ chave: "treino", stat: "atk", custo: 120, en: 6, cd: 1200000, ganho: [1, 1], e: "🏋️", rotulo: "ataque base", txt: "você treinou combate no campo de treino e ficou mais forte!", xp: 15 }));

// ═══════════ ITENS (13) ═══════════
def("craftar", M.fnCraft(receitas, "craftou"));
def("receitas", M.fnReceitas(receitas, "receitas"));
def("fornalha", fundir(FUNDIVEL, COMB, "fundiu", "fornalha", "🔥"));
def("cozinhar", fundir(COZINHAVEL, COMB, "cozinhou", "cozinhar", "🍳"));
def("encantar", (a) => {
    const p = a.p;
    const { id } = M.parseItem(a.args);
    if (!id || !M.qtd(p, id)) return `usa: ${a.cmd("encantar")} <arma/armadura/escudo>`;
    const it = ITENS[id];
    if (!["arma", "armadura"].includes(it.tipo)) return `${M.nome(id)} não pode ser encantado (só armas, armaduras e escudos).`;
    if (!M.qtd(p, "mesa_encantamento")) return `📖 você precisa de uma *Mesa de Encantamento* (${a.cmd("craftar")} mesa_encantamento).`;
    p.x.enc = p.x.enc || {};
    const lv = (p.x.enc[id] || 0) + 1;
    if (lv > 5) return `✨ ${M.nome(id)} já está no encantamento máximo (5)!`;
    if (p.nivel < lv * 3) return `🔒 precisa de nível ${lv * 3} pro encantamento ${lv}.`;
    const lapis = lv * 2 + 1, custo = lv * 30;
    if (!M.tem(p, { lapis })) return `🔵 faltam ${lapis - M.qtd(p, "lapis")} lápis-lazúli.`;
    if (p.moeda < custo) return `💸 precisa de 💚 ${custo}.`;
    M.add(p, "lapis", -lapis); p.moeda -= custo; p.x.enc[id] = lv;
    M.stat(p, "encantou");
    return `✨ *${M.nome(id)}* encantado! (nível ${lv}/5)\n${it.tipo === "arma" ? `⚔️ +${lv * 2} ataque` : `🛡️ +${lv} defesa`} no total\n(-${lapis} lápis, -💚 ${custo})${M.ganharXp(p, 25 * lv)}`;
});
def("reparar", (a) => {
    const p = a.p;
    const { id } = M.parseItem(a.args);
    if (!id || !M.qtd(p, id) || !ITENS[id].dur) return `usa: ${a.cmd("reparar")} <ferramenta/arma/armadura que tem durabilidade>`;
    const it = ITENS[id];
    const atual = p.dur[id] === undefined ? it.dur : p.dur[id];
    if (atual >= it.dur) return `${M.nome(id)} já está perfeita!`;
    const mats = ["tabua", "pedra", "ferro", "diamante", "netherita_sucata"];
    const mat = mats[Math.min(it.tier ?? 1, 4)] || "ferro";
    if (!M.qtd(p, mat)) return `🔧 pra reparar você precisa de 1x ${M.nome(mat)}.`;
    M.add(p, mat, -1); p.dur[id] = it.dur;
    return `🔧 ${M.nome(id)} foi reparado(a)! (${it.dur}/${it.dur})`;
});
def("pocao", M.fnCraft(POCOES, "preparou"));
def("comer", (a) => { a.usoNome = "comer"; return M.fnUsar(["comida"])(a); });
def("usar", (a) => { a.usoNome = "usar"; return M.fnUsar(["pocao", "comida"])(a); });
def("descartar", M.fnDescartar());
def("guardar", M.fnGuardar());
def("retirar", M.fnRetirar());
def("bau", M.fnBau());

// ═══════════ ECONOMIA (8) ═══════════
const LOJA = { madeira: 4, tabua: 2, graveto: 1, pedra: 3, carvao: 6, ferro: 18, pao: 8, carne_cozida: 12, semente_trigo: 3, semente_abobora: 7, semente_melancia: 7, vara_pesca: 25, tesoura: 30, balde: 40, garrafa: 6, bancada: 15, cama: 35, isqueiro: 60, suporte_pocoes: 90, mesa_encantamento: 350, escudo: 45, cenoura: 4, batata: 4 };
const TROCAS = [
    { dar: { trigo: 20 }, moeda: 12 }, { dar: { carvao: 15 }, moeda: 12 }, { dar: { ferro: 5 }, moeda: 30 },
    { dar: { diamante: 1 }, moeda: 60 }, { dar: { couro: 6 }, moeda: 14 }, { dar: { peixe_cru: 8 }, moeda: 10 },
    { dar: { abobora: 6 }, moeda: 24 }, { moedaDar: 80, receber: { mapa_tesouro: 1 } }, { moedaDar: 120, receber: { maca_dourada: 1 } },
    { moedaDar: 200, receber: { pocao_cura: 3 } }, { moedaDar: 400, receber: { totem: 1 } }
];
def("loja", M.fnLoja(LOJA, "loja do aldeão"));
def("comprar", M.fnComprar([LOJA]));
def("vender", M.fnVender());
def("trocar", (a) => {
    const p = a.p;
    const n = parseInt(a.args[0], 10);
    const desc = (t) => `${t.dar ? M.txtItens(t.dar) : `💚 ${t.moedaDar}`} → ${t.receber ? M.txtItens(t.receber) : `💚 ${t.moeda}`}`;
    if (!n || !TROCAS[n - 1]) return M.box("trocas com aldeões", [...TROCAS.map((t, i) => `${i + 1}. ${desc(t)}`), `use ${a.cmd("trocar")} <número> [vezes]`]);
    const t = TROCAS[n - 1];
    const vezes = clampInt(a.args[1], 1, 20);
    if (t.dar) { const need = {}; for (const [i, q] of Object.entries(t.dar)) need[i] = q * vezes; if (!M.tem(p, need)) return `🎒 faltam: ${M.falta(p, need)}`; M.rem(p, need); p.moeda += t.moeda * vezes; }
    else { if (p.moeda < t.moedaDar * vezes) return `💸 precisa de 💚 ${t.moedaDar * vezes}.`; p.moeda -= t.moedaDar * vezes; for (const [i, q] of Object.entries(t.receber)) M.add(p, i, q * vezes); }
    M.stat(p, "trocas", vezes);
    return `🤝 troca feita ${vezes}x: ${desc(t)}\n"hrmm!" — o aldeão${M.ganharXp(p, 5 * vezes)}`;
});
def("piglin", (a) => {
    const p = a.p;
    if (p.local !== "nether") return `📍 os piglins só negociam no Nether!`;
    const n = clampInt(a.args[0], 1, 32);
    if (M.qtd(p, "ouro") < n) return `🥇 você precisa de ${n}x Barra de Ouro pra escambar (use ${a.cmd("piglin")} <qtd>).`;
    M.add(p, "ouro", -n);
    const got = {};
    for (let i = 0; i < n; i++) {
        const [id, mn, mx] = pick([["obsidiana", 1, 2], ["quartzo", 4, 8], ["perola_ender", 1, 2], ["cascalho", 6, 12], ["lagrima_ghast", 1, 1], ["pocao_resistencia", 1, 1], ["carvao", 5, 10], ["ferro_bruto", 2, 5], ["couro", 2, 5]]);
        const q = rand(mn, mx); M.add(p, id, q); got[id] = (got[id] || 0) + q;
    }
    M.stat(p, "escambos", n);
    return `🐷 *escambo com piglins* (${n} ouro)\n🎁 ${M.txtItens(got)}${M.ganharXp(p, 3 * n)}`;
});
def("presentear", M.fnPresentear());
def("transferir", M.fnTransferir());
def("apostar", M.fnApostar({ nome: "apostar", e: "🎲", max: 3000 }));

// ═══════════ BASE & PETS (8) ═══════════
def("base", M.fnBase());
def("construir", M.fnMelhorarBase());
def("renda", M.fnRenda());
def("cama", (a) => {
    if (!M.qtd(a.p, "cama") && a.p.base < 1) return `🛏️ você precisa de uma cama (${a.cmd("craftar")} cama) ou de uma casa pra dormir!`;
    return M.fnDescansar({ e: "🛏️", txt: "você dormiu até o amanhecer e acordou renovado!", cd: 600000, cura: 1, curaEn: 1 })(a);
});
def("domar", M.fnAdotar());
def("pets", M.fnPets());
def("alimentarpet", M.fnAlimentarPet());
def("brincarpet", M.fnBrincarPet());

function clampInt(v, a, b) { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(a, Math.min(b, n)) : a; }

module.exports = { TABELA: M.TABELA, SECOES };
