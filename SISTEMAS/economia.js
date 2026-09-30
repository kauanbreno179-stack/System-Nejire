const config = require("../config.json");
const { getPerfil, salvarPerfil } = require("./perfil.js");

const UM_DIA_MS = 24 * 60 * 60 * 1000;

function calcularNivel(xp = 0) {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
}

function saldo(jid) {
    return getPerfil(jid).saldo || 0;
}

function adicionarSaldo(jid, valor) {
    const perfil = getPerfil(jid);
    return salvarPerfil(jid, { saldo: (perfil.saldo || 0) + valor });
}

function ganharXp(jid, quantidade = 5) {
    const perfil = getPerfil(jid);
    const nivelAntes = calcularNivel(perfil.xp || 0);
    const atualizado = salvarPerfil(jid, { xp: (perfil.xp || 0) + quantidade });
    const nivelDepois = calcularNivel(atualizado.xp);
    return { perfil: atualizado, subiuDeNivel: nivelDepois > nivelAntes, nivel: nivelDepois };
}

function resgatarDaily(jid) {
    const perfil = getPerfil(jid);
    const passou = Date.now() - (perfil.ultimoDaily || 0);

    if (passou < UM_DIA_MS) {
        return { ok: false, faltam: UM_DIA_MS - passou };
    }

    const min = config.economia?.dailyMin ?? 50;
    const max = config.economia?.dailyMax ?? 200;
    const ganho = Math.floor(Math.random() * (max - min + 1)) + min;

    const atualizado = salvarPerfil(jid, {
        saldo: (perfil.saldo || 0) + ganho,
        ultimoDaily: Date.now()
    });

    return { ok: true, ganho, perfil: atualizado };
}

function formatarTempo(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h${m}m`;
}

// ── TRABALHAR (cooldown de 1h) ───────────────────────────
const UMA_HORA_MS = 60 * 60 * 1000;
const TRABALHOS = ["organizou uns arquivos", "ajudou num grupo de estudos", "vendeu figurinha", "passeou com um cachorro", "regou umas plantas"];

function trabalhar(jid) {
    const perfil = getPerfil(jid);
    const passou = Date.now() - (perfil.ultimoTrabalho || 0);

    if (passou < UMA_HORA_MS) {
        return { ok: false, faltam: UMA_HORA_MS - passou };
    }

    const ganho = Math.floor(Math.random() * 80) + 20;
    const tarefa = TRABALHOS[Math.floor(Math.random() * TRABALHOS.length)];
    const atualizado = salvarPerfil(jid, {
        saldo: (perfil.saldo || 0) + ganho,
        ultimoTrabalho: Date.now()
    });

    return { ok: true, ganho, tarefa, perfil: atualizado };
}

// ── ROUBAR (cooldown de 2h, chance de 40%) ───────────────
const DUAS_HORAS_MS = 2 * 60 * 60 * 1000;

function roubar(jidLadrao, jidAlvo) {
    const ladrao = getPerfil(jidLadrao);
    const passou = Date.now() - (ladrao.ultimoRoubo || 0);
    if (passou < DUAS_HORAS_MS) return { ok: false, cooldown: true, faltam: DUAS_HORAS_MS - passou };

    const alvo = getPerfil(jidAlvo);
    salvarPerfil(jidLadrao, { ultimoRoubo: Date.now() });

    if ((alvo.saldo || 0) < 20) return { ok: false, semGrana: true };

    const sucesso = Math.random() < 0.4;
    if (!sucesso) {
        const multa = Math.min(ladrao.saldo || 0, 30);
        salvarPerfil(jidLadrao, { saldo: (ladrao.saldo || 0) - multa });
        return { ok: true, roubou: false, multa };
    }

    const valor = Math.floor((alvo.saldo || 0) * (Math.random() * 0.2 + 0.05));
    salvarPerfil(jidAlvo, { saldo: (alvo.saldo || 0) - valor });
    salvarPerfil(jidLadrao, { saldo: (ladrao.saldo || 0) + valor });
    return { ok: true, roubou: true, valor };
}

// ── APOSTAR (dobra ou perde) ─────────────────────────────
function apostar(jid, valor) {
    const perfil = getPerfil(jid);
    if (valor <= 0 || valor > (perfil.saldo || 0)) return { ok: false };

    const ganhou = Math.random() < 0.45;
    const novoSaldo = ganhou ? (perfil.saldo || 0) + valor : (perfil.saldo || 0) - valor;
    salvarPerfil(jid, { saldo: novoSaldo });
    return { ok: true, ganhou, valor, saldo: novoSaldo };
}

// ── TRANSFERIR ────────────────────────────────────────────
function transferir(jidDe, jidPara, valor) {
    const de = getPerfil(jidDe);
    if (valor <= 0 || valor > (de.saldo || 0)) return { ok: false };

    const para = getPerfil(jidPara);
    salvarPerfil(jidDe, { saldo: (de.saldo || 0) - valor });
    salvarPerfil(jidPara, { saldo: (para.saldo || 0) + valor });
    return { ok: true };
}

// ── LOJA / INVENTÁRIO ─────────────────────────────────────
const LOJA = [
    { id: "coroa", nome: "coroa dourada", emoji: "👑", preco: 300 },
    { id: "concha", nome: "concha da sorte", emoji: "🐚", preco: 80 },
    { id: "estrela", nome: "estrela do mar", emoji: "⭐", preco: 150 },
    { id: "prancha", nome: "prancha de surf", emoji: "🏄", preco: 220 },
    { id: "coquetel", nome: "coquetel tropical", emoji: "🍹", preco: 60 }
];

function listarLoja() {
    return LOJA.map(i => `▸ *${i.id}* — ${i.emoji} ${i.nome} — ${i.preco} moedas`).join("\n");
}

function comprarItem(jid, itemId) {
    const item = LOJA.find(i => i.id === itemId);
    if (!item) return { ok: false, motivo: "item" };

    const perfil = getPerfil(jid);
    if ((perfil.saldo || 0) < item.preco) return { ok: false, motivo: "saldo" };

    const inventario = [...(perfil.inventario || []), item.id];
    salvarPerfil(jid, { saldo: perfil.saldo - item.preco, inventario });
    return { ok: true, item };
}

function listarInventario(jid) {
    const perfil = getPerfil(jid);
    const itens = perfil.inventario || [];
    if (!itens.length) return null;

    const contagem = {};
    for (const id of itens) contagem[id] = (contagem[id] || 0) + 1;

    return Object.entries(contagem).map(([id, qtd]) => {
        const item = LOJA.find(i => i.id === id);
        return `▸ ${item?.emoji || "📦"} ${item?.nome || id} x${qtd}`;
    }).join("\n");
}

// ── CONQUISTAS ────────────────────────────────────────────
function conquistas(jid) {
    const perfil = getPerfil(jid);
    const lista = [];

    if ((perfil.comandosUsados || 0) >= 10) lista.push("🌊 usou 10+ comandos");
    if ((perfil.comandosUsados || 0) >= 100) lista.push("🏖️ usou 100+ comandos");
    if ((perfil.saldo || 0) >= 500) lista.push("💰 juntou 500+ moedas");
    if ((perfil.xp || 0) >= 200) lista.push("⭐ passou de 200 xp");
    if ((perfil.inventario || []).length >= 3) lista.push("🎒 tem 3+ itens no inventário");

    return lista;
}

// ── NÍVEL DETALHADO (progresso até o próximo nível) ──────
function infoNivel(jid) {
    const perfil = getPerfil(jid);
    const xpAtual = perfil.xp || 0;
    const nivelAtual = calcularNivel(xpAtual);
    const xpProximoNivel = Math.pow(nivelAtual * 10, 2);
    const xpNivelAtual = Math.pow((nivelAtual - 1) * 10, 2);
    const faltam = Math.max(0, xpProximoNivel - xpAtual);
    return { nivel: nivelAtual, xp: xpAtual, faltam, xpNivelAtual, xpProximoNivel };
}

// ── PATENTE (título baseado no nível) ────────────────────
const PATENTES = [
    { min: 1, titulo: "🐚 recém-chegada(o)" },
    { min: 5, titulo: "🌊 aprendiz das marés" },
    { min: 10, titulo: "🏖️ exploradora(or) da praia" },
    { min: 20, titulo: "🐬 nadadora(or) experiente" },
    { min: 35, titulo: "⭐ guardiã(o) do recife" },
    { min: 50, titulo: "💎 lenda do oceano" }
];

function patente(jid) {
    const nivel = calcularNivel(getPerfil(jid).xp || 0);
    let atual = PATENTES[0].titulo;
    for (const p of PATENTES) {
        if (nivel >= p.min) atual = p.titulo;
    }
    return { nivel, titulo: atual };
}

// ── BÔNUS SEMANAL (cooldown de 7 dias) ───────────────────
const SETE_DIAS_MS = 7 * UM_DIA_MS;

function bonusSemanal(jid) {
    const perfil = getPerfil(jid);
    const passou = Date.now() - (perfil.ultimoBonusSemanal || 0);

    if (passou < SETE_DIAS_MS) {
        return { ok: false, faltam: SETE_DIAS_MS - passou };
    }

    const ganho = Math.floor(Math.random() * 300) + 200;
    const atualizado = salvarPerfil(jid, {
        saldo: (perfil.saldo || 0) + ganho,
        ultimoBonusSemanal: Date.now()
    });

    return { ok: true, ganho, perfil: atualizado };
}

// ── CAIXA MISTERIOSA (cooldown de 24h, recompensa aleatória) ─
function caixaMisteriosa(jid) {
    const perfil = getPerfil(jid);
    const passou = Date.now() - (perfil.ultimaCaixa || 0);

    if (passou < UM_DIA_MS) {
        return { ok: false, faltam: UM_DIA_MS - passou };
    }

    salvarPerfil(jid, { ultimaCaixa: Date.now() });

    const sorte = Math.random();
    if (sorte < 0.1) {
        const item = LOJA[Math.floor(Math.random() * LOJA.length)];
        const atualizado = salvarPerfil(jid, { inventario: [...(perfil.inventario || []), item.id] });
        return { ok: true, tipo: "item", item, perfil: atualizado };
    }

    if (sorte < 0.85) {
        const ganho = Math.floor(Math.random() * 100) + 10;
        const atualizado = salvarPerfil(jid, { saldo: (perfil.saldo || 0) + ganho });
        return { ok: true, tipo: "moedas", ganho, perfil: atualizado };
    }

    return { ok: true, tipo: "nada" };
}

// ── COMPARAR DOIS PERFIS ─────────────────────────────────
function compararPerfis(jid1, jid2) {
    const p1 = getPerfil(jid1);
    const p2 = getPerfil(jid2);
    return {
        saldo: { p1: p1.saldo || 0, p2: p2.saldo || 0 },
        xp: { p1: p1.xp || 0, p2: p2.xp || 0 },
        nivel: { p1: calcularNivel(p1.xp || 0), p2: calcularNivel(p2.xp || 0) },
        comandosUsados: { p1: p1.comandosUsados || 0, p2: p2.comandosUsados || 0 }
    };
}

// ── META ECONÔMICA PESSOAL ───────────────────────────────
function definirMeta(jid, valor) {
    return salvarPerfil(jid, { metaEconomica: Math.max(1, Math.floor(valor)) });
}

function verMeta(jid) {
    const perfil = getPerfil(jid);
    if (!perfil.metaEconomica) return null;
    const atual = perfil.saldo || 0;
    const meta = perfil.metaEconomica;
    return { atual, meta, porcentagem: Math.min(100, Math.floor((atual / meta) * 100)) };
}

// ── PRESENTEAR ITEM DO INVENTÁRIO ────────────────────────
function presentearItem(jidDe, jidPara, itemId) {
    const de = getPerfil(jidDe);
    const inventarioDe = de.inventario || [];
    const posicao = inventarioDe.indexOf(itemId);
    if (posicao === -1) return { ok: false, motivo: "sem_item" };

    const novoInventarioDe = [...inventarioDe];
    novoInventarioDe.splice(posicao, 1);
    salvarPerfil(jidDe, { inventario: novoInventarioDe });

    const para = getPerfil(jidPara);
    salvarPerfil(jidPara, { inventario: [...(para.inventario || []), itemId] });

    return { ok: true };
}

// ── VENDER ITEM (metade do preço de volta) ───────────────
function venderItem(jid, itemId) {
    const item = LOJA.find(i => i.id === itemId);
    if (!item) return { ok: false, motivo: "item" };

    const perfil = getPerfil(jid);
    const inventario = perfil.inventario || [];
    const posicao = inventario.indexOf(itemId);
    if (posicao === -1) return { ok: false, motivo: "sem_item" };

    const novoInventario = [...inventario];
    novoInventario.splice(posicao, 1);

    const reembolso = Math.floor(item.preco / 2);
    salvarPerfil(jid, { inventario: novoInventario, saldo: (perfil.saldo || 0) + reembolso });

    return { ok: true, reembolso, item };
}

// ── RESETAR SÓ O PRÓPRIO INVENTÁRIO ──────────────────────
function resetarInventario(jid) {
    return salvarPerfil(jid, { inventario: [] });
}

// ── ESTATÍSTICAS PESSOAIS DE ECONOMIA ────────────────────
function estatisticasEconomia(jid) {
    const perfil = getPerfil(jid);
    const valorInventario = (perfil.inventario || []).reduce((acc, id) => {
        const item = LOJA.find(i => i.id === id);
        return acc + (item?.preco || 0);
    }, 0);

    return {
        saldo: perfil.saldo || 0,
        xp: perfil.xp || 0,
        nivel: calcularNivel(perfil.xp || 0),
        itensNoInventario: (perfil.inventario || []).length,
        valorInventario,
        patrimonioTotal: (perfil.saldo || 0) + valorInventario
    };
}

// ── RANKINGS POR SALDO/XP ─────────────────────────────────
function rankingPorSaldo(todosPerfis, limite = 10) {
    return Object.entries(todosPerfis)
        .map(([jid, dados]) => ({ jid, ...dados }))
        .sort((a, b) => (b.saldo || 0) - (a.saldo || 0))
        .slice(0, limite);
}

function rankingPorXp(todosPerfis, limite = 10) {
    return Object.entries(todosPerfis)
        .map(([jid, dados]) => ({ jid, ...dados }))
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, limite);
}

module.exports = {
    calcularNivel,
    saldo,
    adicionarSaldo,
    ganharXp,
    resgatarDaily,
    formatarTempo,
    trabalhar,
    roubar,
    apostar,
    transferir,
    listarLoja,
    comprarItem,
    listarInventario,
    conquistas,
    infoNivel,
    patente,
    bonusSemanal,
    caixaMisteriosa,
    compararPerfis,
    definirMeta,
    verMeta,
    presentearItem,
    venderItem,
    resetarInventario,
    estatisticasEconomia,
    rankingPorSaldo,
    rankingPorXp,
    LOJA
};
