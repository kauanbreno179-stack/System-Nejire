const path = require("path");
const Db = require("../../utils/db.js");
const Economia = require("../economia.js");

const DB_LEMBRETES = path.join(__dirname, "../../database/lembretes.json");
const DB_TAREFAS = path.join(__dirname, "../../database/tarefas.json");
const DB_DIARIO = path.join(__dirname, "../../database/diario.json");
const DB_GUILDAS = path.join(__dirname, "../../database/guildas.json");
const DB_TITULOS = path.join(__dirname, "../../database/titulos.json");
const DB_NOTASGRUPO = path.join(__dirname, "../../database/notasgrupo.json");

Db.ensure(DB_LEMBRETES, []);
Db.ensure(DB_TAREFAS, {});
Db.ensure(DB_DIARIO, {});
Db.ensure(DB_GUILDAS, {});
Db.ensure(DB_TITULOS, {});
Db.ensure(DB_NOTASGRUPO, {});

let conexaoSalva = null;
let intervaloIniciado = false;

function iniciarRelogioLembretes() {
    if (intervaloIniciado) return;
    intervaloIniciado = true;
    setInterval(async () => {
        if (!conexaoSalva) return;
        const lista = Db.read(DB_LEMBRETES, []);
        const agora = Date.now();
        const pendentes = lista.filter(l => l.quando <= agora);
        if (!pendentes.length) return;
        const resto = lista.filter(l => l.quando > agora);
        Db.write(DB_LEMBRETES, resto);
        for (const l of pendentes) {
            try {
                await conexaoSalva.sendMessage(l.chat, { text: `⏰ *lembrete:* ${l.texto}` }, { quoted: null });
            } catch (err) { console.error("[lembretes] erro ao enviar:", err); }
        }
    }, 30000);
}

function parseTempo(txt) {
    const m = String(txt || "").match(/^(\d+)(m|h|d)$/i);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    const unidade = m[2].toLowerCase();
    const ms = unidade === "m" ? n * 60000 : unidade === "h" ? n * 3600000 : n * 86400000;
    return ms;
}

const TABELA = {
    addlembrete: async (ctx) => {
        conexaoSalva = ctx.conn;
        iniciarRelogioLembretes();
        const tempoTxt = ctx.args[0];
        const texto = ctx.args.slice(1).join(" ");
        const ms = parseTempo(tempoTxt);
        if (!ms || !texto) { await ctx.reply(`usa: ${ctx.prefix}addlembrete <tempo> <texto>\nex: ${ctx.prefix}addlembrete 30m beber água\n(tempo: 10m, 2h, 1d)`); return; }
        const lista = Db.read(DB_LEMBRETES, []);
        lista.push({ id: Date.now().toString(36), chat: ctx.from, autor: ctx.sender, texto, quando: Date.now() + ms });
        Db.write(DB_LEMBRETES, lista);
        await ctx.reply(`⏰ lembrete criado! vou te lembrar em ${tempoTxt}: "${texto}"`);
    },
    meuslembretes: async (ctx) => {
        const lista = Db.read(DB_LEMBRETES, []).filter(l => l.autor === ctx.sender);
        if (!lista.length) { await ctx.reply("você não tem lembretes pendentes 🐚"); return; }
        const txt = lista.map(l => `🆔 ${l.id} — "${l.texto}" (em ${Math.max(0, Math.round((l.quando - Date.now()) / 60000))}min)`).join("\n");
        await ctx.reply(`⏰ *seus lembretes:*\n\n${txt}`);
    },
    cancelarlembrete: async (ctx) => {
        const id = ctx.args[0];
        if (!id) { await ctx.reply(`usa: ${ctx.prefix}cancelarlembrete <id>`); return; }
        const lista = Db.read(DB_LEMBRETES, []);
        const existe = lista.some(l => l.id === id && l.autor === ctx.sender);
        if (!existe) { await ctx.reply("não achei esse lembrete seu."); return; }
        Db.write(DB_LEMBRETES, lista.filter(l => !(l.id === id && l.autor === ctx.sender)));
        await ctx.reply("🗑️ lembrete cancelado!");
    },

    addtarefa: async (ctx) => {
        const texto = ctx.q;
        if (!texto) { await ctx.reply(`usa: ${ctx.prefix}addtarefa <texto>`); return; }
        const banco = Db.read(DB_TAREFAS, {});
        banco[ctx.sender] = banco[ctx.sender] || [];
        banco[ctx.sender].push({ id: banco[ctx.sender].length + 1, texto, feita: false });
        Db.write(DB_TAREFAS, banco);
        await ctx.reply(`✅ tarefa #${banco[ctx.sender].length} adicionada!`);
    },
    minhastarefas: async (ctx) => {
        const banco = Db.read(DB_TAREFAS, {});
        const lista = banco[ctx.sender] || [];
        if (!lista.length) { await ctx.reply("você não tem tarefas ainda 🐚"); return; }
        const txt = lista.map(t => `${t.feita ? "✅" : "⬜"} #${t.id} — ${t.texto}`).join("\n");
        await ctx.reply(`📋 *suas tarefas:*\n\n${txt}`);
    },
    concluirtarefa: async (ctx) => {
        const id = parseInt(ctx.args[0], 10);
        const banco = Db.read(DB_TAREFAS, {});
        const lista = banco[ctx.sender] || [];
        const t = lista.find(t => t.id === id);
        if (!t) { await ctx.reply(`usa: ${ctx.prefix}concluirtarefa <número>`); return; }
        t.feita = true;
        Db.write(DB_TAREFAS, banco);
        await ctx.reply(`✅ tarefa #${id} concluída!`);
    },
    apagartarefa: async (ctx) => {
        const id = parseInt(ctx.args[0], 10);
        const banco = Db.read(DB_TAREFAS, {});
        const lista = banco[ctx.sender] || [];
        if (!lista.some(t => t.id === id)) { await ctx.reply(`usa: ${ctx.prefix}apagartarefa <número>`); return; }
        banco[ctx.sender] = lista.filter(t => t.id !== id);
        Db.write(DB_TAREFAS, banco);
        await ctx.reply(`🗑️ tarefa #${id} apagada!`);
    },
    limpartarefas: async (ctx) => {
        const banco = Db.read(DB_TAREFAS, {});
        banco[ctx.sender] = [];
        Db.write(DB_TAREFAS, banco);
        await ctx.reply("🧹 todas as suas tarefas foram apagadas!");
    },

    addiario: async (ctx) => {
        const texto = ctx.q;
        if (!texto) { await ctx.reply(`usa: ${ctx.prefix}addiario <o que você quer anotar>`); return; }
        const banco = Db.read(DB_DIARIO, {});
        banco[ctx.sender] = banco[ctx.sender] || [];
        banco[ctx.sender].push({ data: new Date().toLocaleString("pt-BR"), texto });
        Db.write(DB_DIARIO, banco);
        await ctx.reply("📔 anotado no seu diário!");
    },
    verdiario: async (ctx) => {
        const banco = Db.read(DB_DIARIO, {});
        const lista = banco[ctx.sender] || [];
        if (!lista.length) { await ctx.reply("seu diário está vazio 🐚"); return; }
        const txt = lista.slice(-10).map(l => `🗓️ ${l.data}\n${l.texto}`).join("\n\n");
        await ctx.reply(`📔 *seu diário (últimas 10 entradas):*\n\n${txt}`);
    },
    apagardiario: async (ctx) => {
        const banco = Db.read(DB_DIARIO, {});
        banco[ctx.sender] = [];
        Db.write(DB_DIARIO, banco);
        await ctx.reply("🧹 diário apagado!");
    },

    criarguilda: async (ctx) => {
        const nome = ctx.q;
        if (!nome) { await ctx.reply(`usa: ${ctx.prefix}criarguilda <nome>`); return; }
        const banco = Db.read(DB_GUILDAS, {});
        if (Object.values(banco).some(g => g.membros.includes(ctx.sender))) { await ctx.reply("você já está em uma guilda! saia com " + ctx.prefix + "sairguilda antes."); return; }
        if (banco[nome]) { await ctx.reply("já existe uma guilda com esse nome!"); return; }
        banco[nome] = { lider: ctx.sender, membros: [ctx.sender], criada: Date.now() };
        Db.write(DB_GUILDAS, banco);
        await ctx.reply(`🏰 guilda *${nome}* criada! você é o líder.`);
    },
    guilda: async (ctx) => {
        const banco = Db.read(DB_GUILDAS, {});
        const minha = Object.entries(banco).find(([, g]) => g.membros.includes(ctx.sender));
        if (!minha) { await ctx.reply(`você não está em nenhuma guilda. cria uma com ${ctx.prefix}criarguilda <nome>`); return; }
        const [nome, g] = minha;
        await ctx.reply(`🏰 *${nome}*\n👑 líder: ${g.lider.split("@")[0]}\n👥 membros: ${g.membros.length}`);
    },
    entrarguilda: async (ctx) => {
        const nome = ctx.q;
        const banco = Db.read(DB_GUILDAS, {});
        if (!nome || !banco[nome]) { await ctx.reply(`usa: ${ctx.prefix}entrarguilda <nome exato>`); return; }
        if (Object.values(banco).some(g => g.membros.includes(ctx.sender))) { await ctx.reply("você já está em uma guilda!"); return; }
        banco[nome].membros.push(ctx.sender);
        Db.write(DB_GUILDAS, banco);
        await ctx.reply(`🏰 você entrou na guilda *${nome}*!`);
    },
    sairguilda: async (ctx) => {
        const banco = Db.read(DB_GUILDAS, {});
        const minha = Object.entries(banco).find(([, g]) => g.membros.includes(ctx.sender));
        if (!minha) { await ctx.reply("você não está em nenhuma guilda."); return; }
        const [nome, g] = minha;
        g.membros = g.membros.filter(m => m !== ctx.sender);
        if (!g.membros.length) delete banco[nome];
        else if (g.lider === ctx.sender) g.lider = g.membros[0];
        Db.write(DB_GUILDAS, banco);
        await ctx.reply(`👋 você saiu da guilda *${nome}*.`);
    },
    membrosguilda: async (ctx) => {
        const banco = Db.read(DB_GUILDAS, {});
        const minha = Object.entries(banco).find(([, g]) => g.membros.includes(ctx.sender));
        if (!minha) { await ctx.reply("você não está em nenhuma guilda."); return; }
        const [nome, g] = minha;
        await ctx.reply(`🏰 *${nome}* — membros:\n${g.membros.map(m => `• ${m.split("@")[0]}${m === g.lider ? " 👑" : ""}`).join("\n")}`);
    },
    topguildas: async (ctx) => {
        const banco = Db.read(DB_GUILDAS, {});
        const lista = Object.entries(banco).sort((a, b) => b[1].membros.length - a[1].membros.length).slice(0, 10);
        if (!lista.length) { await ctx.reply("ainda não existe nenhuma guilda! crie a primeira com " + ctx.prefix + "criarguilda"); return; }
        const medalhas = ["🥇", "🥈", "🥉"];
        await ctx.reply(`🏆 *top guildas:*\n\n${lista.map(([nome, g], i) => `${medalhas[i] || `${i + 1}.`} ${nome} — ${g.membros.length} membro(s)`).join("\n")}`);
    },

    lojatitulos: async (ctx) => {
        const catalogo = { "lenda": 500, "sortudo": 150, "veterano": 300, "brabo": 200, "estrela": 250 };
        const txt = Object.entries(catalogo).map(([t, p]) => `🏷️ *${t}* — 💰 ${p}`).join("\n");
        await ctx.reply(`🛍️ *loja de títulos*\n\n${txt}\n\ncompre com ${ctx.prefix}comprartitulo <nome>`);
    },
    comprartitulo: async (ctx) => {
        const catalogo = { "lenda": 500, "sortudo": 150, "veterano": 300, "brabo": 200, "estrela": 250 };
        const nome = (ctx.q || "").toLowerCase();
        const preco = catalogo[nome];
        if (!preco) { await ctx.reply(`título não encontrado! veja ${ctx.prefix}lojatitulos`); return; }
        const saldoAtual = Economia.saldo(ctx.sender);
        if (saldoAtual < preco) { await ctx.reply(`💸 você tem 💰 ${saldoAtual} e precisa de 💰 ${preco}.`); return; }
        Economia.adicionarSaldo(ctx.sender, -preco);
        const banco = Db.read(DB_TITULOS, {});
        banco[ctx.sender] = banco[ctx.sender] || { titulos: [], equipado: null };
        if (!banco[ctx.sender].titulos.includes(nome)) banco[ctx.sender].titulos.push(nome);
        Db.write(DB_TITULOS, banco);
        await ctx.reply(`✅ título *${nome}* comprado! equipe com ${ctx.prefix}equipartitulo ${nome}`);
    },
    meustitulos: async (ctx) => {
        const banco = Db.read(DB_TITULOS, {});
        const meu = banco[ctx.sender];
        if (!meu || !meu.titulos.length) { await ctx.reply(`você ainda não tem títulos. veja ${ctx.prefix}lojatitulos`); return; }
        await ctx.reply(`🏷️ *seus títulos:*\n${meu.titulos.map(t => `${t === meu.equipado ? "⭐" : "•"} ${t}`).join("\n")}`);
    },
    equipartitulo: async (ctx) => {
        const nome = (ctx.q || "").toLowerCase();
        const banco = Db.read(DB_TITULOS, {});
        const meu = banco[ctx.sender];
        if (!meu || !meu.titulos.includes(nome)) { await ctx.reply("você não tem esse título!"); return; }
        meu.equipado = nome;
        Db.write(DB_TITULOS, banco);
        await ctx.reply(`⭐ título *${nome}* equipado!`);
    },

    addnota: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const texto = ctx.q;
        if (!texto) { await ctx.reply(`usa: ${ctx.prefix}addnota <texto>`); return; }
        const banco = Db.read(DB_NOTASGRUPO, {});
        banco[ctx.from] = banco[ctx.from] || [];
        banco[ctx.from].push({ id: banco[ctx.from].length + 1, texto, autor: ctx.sender });
        Db.write(DB_NOTASGRUPO, banco);
        await ctx.reply(`📌 nota #${banco[ctx.from].length} salva pro grupo!`);
    },
    notasgrupo: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const banco = Db.read(DB_NOTASGRUPO, {});
        const lista = banco[ctx.from] || [];
        if (!lista.length) { await ctx.reply("esse grupo ainda não tem notas salvas."); return; }
        await ctx.reply(`📌 *notas do grupo:*\n\n${lista.map(n => `#${n.id} — ${n.texto}`).join("\n")}`);
    },
    apagarnota: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const id = parseInt(ctx.args[0], 10);
        const banco = Db.read(DB_NOTASGRUPO, {});
        const lista = banco[ctx.from] || [];
        if (!lista.some(n => n.id === id)) { await ctx.reply(`usa: ${ctx.prefix}apagarnota <número>`); return; }
        banco[ctx.from] = lista.filter(n => n.id !== id);
        Db.write(DB_NOTASGRUPO, banco);
        await ctx.reply(`🗑️ nota #${id} apagada!`);
    }
};

module.exports = { TABELA };
