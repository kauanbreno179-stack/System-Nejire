// módulo autocontido: guarda o próprio estado (vara, iscas,
// local, bag de peixes, xp de pesca) em database/pesca.json e
// só empresta a moeda/saldo do sistema de economia já existente.

const path = require("path");
const db = require("../utils/db.js");
const Economia = require("./economia.js");

const DB_PATH = path.join(__dirname, "..", "database", "pesca.json");
db.ensure(DB_PATH, {});

const COOLDOWN_MS = 40 * 1000;
const MAX_BAG = 40;

// ── CATÁLOGO ──────────────────────────────────────────────
const RARIDADES = [
    { id: "comum", nome: "comum", emoji: "⚪", peso: 55, mult: 1 },
    { id: "incomum", nome: "incomum", emoji: "🟢", peso: 27, mult: 2.4 },
    { id: "raro", nome: "raro", emoji: "🔵", peso: 12, mult: 6 },
    { id: "epico", nome: "épico", emoji: "🟣", peso: 5, mult: 16 },
    { id: "lendario", nome: "lendário", emoji: "🟡", peso: 1, mult: 50 }
];

const VARAS = [
    { id: "bambu", nome: "cana de bambu", emoji: "🎋", preco: 0, bonus: 0 },
    { id: "reforcada", nome: "vara reforçada", emoji: "🪵", preco: 300, bonus: 0.12 },
    { id: "carbono", nome: "vara de carbono", emoji: "🎣", preco: 900, bonus: 0.28 },
    { id: "mistica", nome: "vara mística", emoji: "🔱", preco: 2500, bonus: 0.5 }
];

const ISCAS = [
    { id: "minhoca", nome: "minhoca", emoji: "🪱", preco: 5, bonus: 0.02 },
    { id: "camarao", nome: "camarão", emoji: "🍤", preco: 15, bonus: 0.08 },
    { id: "peixinho", nome: "peixinho-vivo", emoji: "🐟", preco: 35, bonus: 0.18 },
    { id: "magica", nome: "isca mágica", emoji: "✨", preco: 100, bonus: 0.4 }
];

const LOCAIS = [
    {
        id: "rio", nome: "rio", emoji: "🏞️", nivelMin: 1, varaMinima: "bambu",
        peixes: [
            { nome: "lambari", raridade: "comum", emoji: "🐟", preco: 6 },
            { nome: "traíra", raridade: "incomum", emoji: "🐠", preco: 14 },
            { nome: "dourado", raridade: "raro", emoji: "🐡", preco: 42 },
            { nome: "pintado", raridade: "epico", emoji: "🐋", preco: 130 },
            { nome: "piraíba gigante", raridade: "lendario", emoji: "🐉", preco: 900 }
        ]
    },
    {
        id: "lago", nome: "lago", emoji: "🏔️", nivelMin: 3, varaMinima: "bambu",
        peixes: [
            { nome: "tilápia", raridade: "comum", emoji: "🐟", preco: 8 },
            { nome: "carpa", raridade: "incomum", emoji: "🐠", preco: 18 },
            { nome: "truta", raridade: "raro", emoji: "🐡", preco: 50 },
            { nome: "esturjão", raridade: "epico", emoji: "🐋", preco: 160 },
            { nome: "peixe dourado mágico", raridade: "lendario", emoji: "🐉", preco: 1100 }
        ]
    },
    {
        id: "praia", nome: "praia", emoji: "🏖️", nivelMin: 5, varaMinima: "bambu",
        peixes: [
            { nome: "sardinha", raridade: "comum", emoji: "🐟", preco: 9 },
            { nome: "tainha", raridade: "incomum", emoji: "🐠", preco: 20 },
            { nome: "robalo", raridade: "raro", emoji: "🐡", preco: 58 },
            { nome: "garoupa", raridade: "epico", emoji: "🐋", preco: 190 },
            { nome: "peixe-espada", raridade: "lendario", emoji: "🐉", preco: 1300 }
        ]
    },
    {
        id: "recife", nome: "recife", emoji: "🪸", nivelMin: 8, varaMinima: "reforcada",
        peixes: [
            { nome: "peixe-palhaço", raridade: "comum", emoji: "🐟", preco: 11 },
            { nome: "peixe-borboleta", raridade: "incomum", emoji: "🐠", preco: 24 },
            { nome: "baiacu", raridade: "raro", emoji: "🐡", preco: 68 },
            { nome: "moreia", raridade: "epico", emoji: "🐋", preco: 230 },
            { nome: "cavalo-marinho real", raridade: "lendario", emoji: "🐉", preco: 1600 }
        ]
    },
    {
        id: "maraberto", nome: "mar aberto", emoji: "🌊", nivelMin: 12, varaMinima: "carbono",
        peixes: [
            { nome: "cavala", raridade: "comum", emoji: "🐟", preco: 14 },
            { nome: "atum", raridade: "incomum", emoji: "🐠", preco: 30 },
            { nome: "marlim", raridade: "raro", emoji: "🐡", preco: 85 },
            { nome: "tubarão-martelo", raridade: "epico", emoji: "🐋", preco: 300 },
            { nome: "espadarte gigante", raridade: "lendario", emoji: "🐉", preco: 2100 }
        ]
    },
    {
        id: "abismo", nome: "abismo", emoji: "🕳️", nivelMin: 20, varaMinima: "mistica",
        peixes: [
            { nome: "peixe-cego", raridade: "comum", emoji: "🐟", preco: 20 },
            { nome: "enguia-abissal", raridade: "incomum", emoji: "🐠", preco: 45 },
            { nome: "peixe-lanterna", raridade: "raro", emoji: "🐡", preco: 120 },
            { nome: "peixe-víbora", raridade: "epico", emoji: "🐋", preco: 420 },
            { nome: "kraken bebê", raridade: "lendario", emoji: "🐙", preco: 3200 }
        ]
    }
];

const ORDEM_VARAS = VARAS.map(v => v.id);

// ── PERSISTÊNCIA ──────────────────────────────────────────
function padrao() {
    return {
        xpPesca: 0,
        vara: "bambu",
        varasCompradas: ["bambu"],
        iscas: {},
        local: "rio",
        peixes: [],
        proximaPescaEm: 0,
        totalPescarias: 0,
        maiorCaptura: null,
        temBarco: false
    };
}

function tudo() {
    return db.read(DB_PATH, {});
}

function perfil(jid) {
    const all = tudo();
    if (!all[jid]) {
        all[jid] = padrao();
        db.write(DB_PATH, all);
    }
    return { ...padrao(), ...all[jid] };
}

function salvar(jid, patch) {
    const all = tudo();
    all[jid] = { ...padrao(), ...(all[jid] || {}), ...patch };
    db.write(DB_PATH, all);
    return all[jid];
}

// ── PROGRESSO ─────────────────────────────────────────────
function calcularNivel(xpPesca = 0) {
    return Math.floor(0.08 * Math.sqrt(xpPesca)) + 1;
}

function xpParaNivel(nivel) {
    return Math.ceil(Math.pow((nivel - 1) / 0.08, 2));
}

function varaPorId(id) {
    return VARAS.find(v => v.id === id) || VARAS[0];
}

function iscaPorId(id) {
    return ISCAS.find(i => i.id === id);
}

function localPorId(id) {
    return LOCAIS.find(l => l.id === id) || LOCAIS[0];
}

function raridadePorId(id) {
    return RARIDADES.find(r => r.id === id) || RARIDADES[0];
}

// ── LOCAIS DISPONÍVEIS ────────────────────────────────────
function locaisDisponiveis(jid) {
    const p = perfil(jid);
    const nivel = calcularNivel(p.xpPesca);
    const indiceVara = ORDEM_VARAS.indexOf(p.vara);

    return LOCAIS.map(local => ({
        ...local,
        liberado: nivel >= local.nivelMin && indiceVara >= ORDEM_VARAS.indexOf(local.varaMinima)
    }));
}

function definirLocal(jid, localId) {
    const local = localPorId(localId);
    if (!LOCAIS.some(l => l.id === localId)) return { ok: false, motivo: "local_invalido" };

    const disponiveis = locaisDisponiveis(jid);
    const alvo = disponiveis.find(l => l.id === localId);
    if (!alvo.liberado) return { ok: false, motivo: "bloqueado", local: alvo };

    salvar(jid, { local: localId });
    return { ok: true, local: alvo };
}

// ── LOJA (varas e iscas) ──────────────────────────────────
function comprarVara(jid, varaId) {
    const vara = varaPorId(varaId);
    if (!VARAS.some(v => v.id === varaId)) return { ok: false, motivo: "vara_invalida" };

    const p = perfil(jid);
    if (p.varasCompradas.includes(varaId)) {
        salvar(jid, { vara: varaId });
        return { ok: true, jaTinha: true, vara };
    }

    if (Economia.saldo(jid) < vara.preco) return { ok: false, motivo: "saldo", vara };

    Economia.adicionarSaldo(jid, -vara.preco);
    salvar(jid, {
        varasCompradas: [...p.varasCompradas, varaId],
        vara: varaId
    });
    return { ok: true, vara };
}

// ── PESCA 2: BARCO (mercado da beira-rio) ────────────────
const PRECO_BARCO = 250;

function comprarBarco(jid) {
    const p = perfil(jid);
    if (p.temBarco) return { ok: true, jaTinha: true, preco: PRECO_BARCO };

    if (Economia.saldo(jid) < PRECO_BARCO) {
        return { ok: false, motivo: "saldo", preco: PRECO_BARCO };
    }

    Economia.adicionarSaldo(jid, -PRECO_BARCO);
    salvar(jid, { temBarco: true });
    return { ok: true, preco: PRECO_BARCO };
}

function comprarIsca(jid, iscaId, qtd = 1) {
    const isca = iscaPorId(iscaId);
    if (!isca) return { ok: false, motivo: "isca_invalida" };

    qtd = Math.max(1, Math.min(50, Math.floor(qtd) || 1));
    const custo = isca.preco * qtd;
    if (Economia.saldo(jid) < custo) return { ok: false, motivo: "saldo", isca, custo };

    Economia.adicionarSaldo(jid, -custo);
    const p = perfil(jid);
    const iscas = { ...p.iscas, [iscaId]: (p.iscas[iscaId] || 0) + qtd };
    salvar(jid, { iscas });
    return { ok: true, isca, qtd, custo };
}

function equiparVara(jid, varaId) {
    const p = perfil(jid);
    if (!p.varasCompradas.includes(varaId)) return { ok: false, motivo: "nao_possui" };
    salvar(jid, { vara: varaId });
    return { ok: true, vara: varaPorId(varaId) };
}

function melhorIscaDisponivel(jid) {
    const p = perfil(jid);
    const posse = Object.entries(p.iscas || {}).filter(([, qtd]) => qtd > 0);
    if (!posse.length) return null;
    posse.sort((a, b) => iscaPorId(b[0]).bonus - iscaPorId(a[0]).bonus);
    return iscaPorId(posse[0][0]);
}

// ── SORTEIO ───────────────────────────────────────────────
function sortearRaridade(bonus) {
    const pesos = RARIDADES.map((r, i) => r.peso * (1 + bonus * i * 1.8));
    const total = pesos.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < RARIDADES.length; i++) {
        if (roll < pesos[i]) return RARIDADES[i];
        roll -= pesos[i];
    }
    return RARIDADES[0];
}

// ── PESCAR ────────────────────────────────────────────────
function podePescar(jid) {
    const p = perfil(jid);
    const faltam = p.proximaPescaEm - Date.now();
    return faltam > 0 ? { ok: false, faltamMs: faltam } : { ok: true };
}

function pescar(jid) {
    const check = podePescar(jid);
    if (!check.ok) return { ok: false, motivo: "cooldown", faltamMs: check.faltamMs };

    const p = perfil(jid);
    if (p.peixes.length >= MAX_BAG) return { ok: false, motivo: "bag_cheia" };

    const local = localPorId(p.local);
    const disponivel = locaisDisponiveis(jid).find(l => l.id === p.local);
    if (!disponivel?.liberado) return { ok: false, motivo: "local_bloqueado", local };

    const vara = varaPorId(p.vara);
    const isca = melhorIscaDisponivel(jid);
    const bonus = vara.bonus + (isca?.bonus || 0);

    const raridadeSorteada = sortearRaridade(bonus);
    let candidatos = local.peixes.filter(pe => pe.raridade === raridadeSorteada.id);
    if (!candidatos.length) candidatos = local.peixes.filter(pe => pe.raridade === "comum");
    const peixeBase = candidatos[Math.floor(Math.random() * candidatos.length)];

    const raridade = raridadePorId(peixeBase.raridade);
    const pesoKg = +(0.2 + Math.random() * 1.8 * (RARIDADES.indexOf(raridade) + 1)).toFixed(2);
    const variancao = 0.85 + Math.random() * 0.4;
    const valor = Math.max(1, Math.round(peixeBase.preco * variancao));

    if (isca) {
        const iscas = { ...p.iscas, [isca.id]: p.iscas[isca.id] - 1 };
        if (iscas[isca.id] <= 0) delete iscas[isca.id];
        salvar(jid, { iscas });
    }

    const captura = {
        nome: peixeBase.nome,
        emoji: peixeBase.emoji,
        raridade: raridade.id,
        raridadeEmoji: raridade.emoji,
        peso: pesoKg,
        valor,
        local: local.id,
        capturadoEm: Date.now()
    };

    const xpGanho = Math.round(4 * raridade.mult);
    const nivelAntes = calcularNivel(p.xpPesca);
    const peixes = [...p.peixes, captura];
    const maiorCaptura = (!p.maiorCaptura || valor > p.maiorCaptura.valor) ? captura : p.maiorCaptura;

    const atualizado = salvar(jid, {
        peixes,
        xpPesca: p.xpPesca + xpGanho,
        totalPescarias: p.totalPescarias + 1,
        proximaPescaEm: Date.now() + COOLDOWN_MS,
        maiorCaptura
    });

    const nivelDepois = calcularNivel(atualizado.xpPesca);

    return {
        ok: true,
        captura,
        xpGanho,
        subiuDeNivel: nivelDepois > nivelAntes,
        nivel: nivelDepois,
        usouIsca: isca,
        cooldownMs: COOLDOWN_MS
    };
}

// ── BAG / VENDA ───────────────────────────────────────────
function inventarioPesca(jid) {
    const p = perfil(jid);
    const valorTotal = p.peixes.reduce((acc, pe) => acc + pe.valor, 0);
    return { peixes: p.peixes, valorTotal, capacidade: MAX_BAG };
}

function venderPeixe(jid, indice) {
    const p = perfil(jid);
    if (indice < 0 || indice >= p.peixes.length) return { ok: false, motivo: "indice" };

    const peixe = p.peixes[indice];
    const peixes = p.peixes.filter((_, i) => i !== indice);
    salvar(jid, { peixes });
    Economia.adicionarSaldo(jid, peixe.valor);
    return { ok: true, peixe };
}

function venderTudoPesca(jid) {
    const p = perfil(jid);
    if (!p.peixes.length) return { ok: false, motivo: "bag_vazia" };

    const total = p.peixes.reduce((acc, pe) => acc + pe.valor, 0);
    const quantidade = p.peixes.length;
    salvar(jid, { peixes: [] });
    Economia.adicionarSaldo(jid, total);
    return { ok: true, total, quantidade };
}

// ── RANKING ───────────────────────────────────────────────
function rankingPesca(limite = 10) {
    const all = tudo();
    return Object.entries(all)
        .map(([jid, dados]) => ({
            jid,
            nivel: calcularNivel(dados.xpPesca || 0),
            xpPesca: dados.xpPesca || 0,
            totalPescarias: dados.totalPescarias || 0,
            maiorCaptura: dados.maiorCaptura || null
        }))
        .sort((a, b) => b.xpPesca - a.xpPesca)
        .slice(0, limite);
}

// ── SNAPSHOT (usado pelo comando e pela mini app) ────────
function estadoPublico(jid) {
    const p = perfil(jid);
    const nivel = calcularNivel(p.xpPesca);
    const cooldown = podePescar(jid);

    return {
        jid,
        nivel,
        xpPesca: p.xpPesca,
        xpProximoNivel: xpParaNivel(nivel + 1),
        saldo: Economia.saldo(jid),
        vara: varaPorId(p.vara),
        varasCompradas: p.varasCompradas.map(varaPorId),
        iscas: Object.entries(p.iscas || {}).map(([id, qtd]) => ({ ...iscaPorId(id), qtd })),
        local: localPorId(p.local),
        locaisDisponiveis: locaisDisponiveis(jid),
        bag: inventarioPesca(jid),
        totalPescarias: p.totalPescarias,
        maiorCaptura: p.maiorCaptura,
        podePescar: cooldown.ok,
        cooldownRestanteMs: cooldown.ok ? 0 : cooldown.faltamMs,
        temBarco: !!p.temBarco,
        precoBarco: PRECO_BARCO
    };
}

// ── TOKENS DO PAINEL (mini app) ──────────────────────────
// evita expor o jid cru na url — o token é curto, expira sozinho
// e só serve pra resolver o dono dele no servidor da mini app.
const crypto = require("crypto");
const TOKENS_PATH = path.join(__dirname, "..", "database", "pesca-tokens.json");
db.ensure(TOKENS_PATH, {});
const TOKEN_TTL_MS = 20 * 60 * 1000;

function gerarTokenPainel(jid) {
    const all = db.read(TOKENS_PATH, {});
    const token = crypto.randomBytes(12).toString("hex");
    all[token] = { jid, exp: Date.now() + TOKEN_TTL_MS };

    // aproveita e limpa token expirado enquanto mexe no arquivo
    for (const t of Object.keys(all)) {
        if (all[t].exp < Date.now()) delete all[t];
    }

    db.write(TOKENS_PATH, all);
    return token;
}

function resolverToken(token) {
    const all = db.read(TOKENS_PATH, {});
    const registro = all[token];
    if (!registro || registro.exp < Date.now()) return null;
    return registro.jid;
}

// ── TEXTOS ────────────────────────────────────────────────
function textoLoja() {
    const varas = VARAS.map(v => `▸ *${v.id}* — ${v.emoji} ${v.nome} — ${v.preco === 0 ? "grátis" : v.preco + " moedas"}`).join("\n");
    const iscas = ISCAS.map(i => `▸ *${i.id}* — ${i.emoji} ${i.nome} — ${i.preco} moedas/unid.`).join("\n");
    return `🎣 *varas*\n${varas}\n\n🪱 *iscas*\n${iscas}`;
}

function textoLocais(jid) {
    return locaisDisponiveis(jid).map(l =>
        `${l.liberado ? "✅" : "🔒"} ${l.emoji} *${l.id}* — ${l.nome}${l.liberado ? "" : ` (nível ${l.nivelMin}, vara ${l.varaMinima})`}`
    ).join("\n");
}

function textoBag(jid) {
    const { peixes, valorTotal } = inventarioPesca(jid);
    if (!peixes.length) return "🎒 sua bag de pesca tá vazia! usa #pescar pra começar";

    const linhas = peixes.map((p, i) =>
        `${i + 1}. ${p.raridadeEmoji} ${p.emoji} ${p.nome} — ${p.peso}kg — 💰 ${p.valor}`
    ).join("\n");

    return `🎒 *sua bag (${peixes.length}/${MAX_BAG})*\n\n${linhas}\n\n💰 valor total: ${valorTotal} moedas\nvende com #venderpeixe <número> ou #venderpeixe tudo`;
}

function textoCaptura(resultado) {
    if (!resultado.ok) {
        if (resultado.motivo === "cooldown") {
            const s = Math.ceil(resultado.faltamMs / 1000);
            return `⏳ calma, sua isca ainda tá na água! espera mais ${s}s`;
        }
        if (resultado.motivo === "bag_cheia") return `🎒 sua bag encheu! vende uns peixes com #venderpeixe tudo antes de pescar de novo`;
        if (resultado.motivo === "local_bloqueado") return `🔒 você ainda não pode pescar aqui. usa #localpesca pra ver os locais liberados`;
        return "❌ não deu pra pescar agora";
    }

    const { captura, xpGanho, subiuDeNivel, nivel, usouIsca } = resultado;
    let texto = `${captura.emoji} você fisgou um(a) *${captura.nome}*!\n`;
    texto += `${captura.raridadeEmoji} raridade: ${captura.raridade} · ⚖️ ${captura.peso}kg · 💰 ${captura.valor} moedas\n`;
    texto += usouIsca ? `🪱 usou ${usouIsca.emoji} ${usouIsca.nome}` : "🪱 pescou sem isca (compra uma pra ter mais sorte!)";
    texto += `\n✨ +${xpGanho} xp de pesca`;
    if (subiuDeNivel) texto += `\n🆙 subiu pro nível ${nivel} de pesca!`;
    return texto;
}

function textoPainel(jid) {
    const e = estadoPublico(jid);
    let texto = `🎣 *painel de pesca*\n\n`;
    texto += `🏅 nível ${e.nivel} (${e.xpPesca}/${e.xpProximoNivel} xp)\n`;
    texto += `${e.vara.emoji} vara: ${e.vara.nome}\n`;
    texto += `${e.local.emoji} local: ${e.local.nome}\n`;
    texto += `🎒 bag: ${e.bag.peixes.length}/${MAX_BAG} (💰 ${e.bag.valorTotal})\n`;
    texto += `💰 saldo: ${e.saldo} moedas\n`;
    texto += e.podePescar ? `\n✅ pronto pra pescar!` : `\n⏳ espera ${Math.ceil(e.cooldownRestanteMs / 1000)}s pra pescar de novo`;
    return texto;
}

module.exports = {
    RARIDADES,
    VARAS,
    ISCAS,
    LOCAIS,
    calcularNivel,
    xpParaNivel,
    varaPorId,
    iscaPorId,
    localPorId,
    locaisDisponiveis,
    definirLocal,
    comprarVara,
    comprarIsca,
    comprarBarco,
    PRECO_BARCO,
    equiparVara,
    podePescar,
    pescar,
    inventarioPesca,
    venderPeixe,
    venderTudoPesca,
    rankingPesca,
    estadoPublico,
    gerarTokenPainel,
    resolverToken,
    textoLoja,
    textoLocais,
    textoBag,
    textoCaptura,
    textoPainel,
    MAX_BAG
}