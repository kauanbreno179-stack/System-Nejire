// ── CASES CRIADOS PELA IA ────────────────────────────────
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const config = require("../config.json");
const { client, caminhoEndpoint } = require("../utils/zoneApi.js");

const PASTA = path.join(__dirname, "..", "data", "casesia");
const ARQUIVO = path.join(PASTA, "cases.json");

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const GERENCIAMENTO = ["addcase", "delcase", "vercase", "menucases"];
const ALIASES_GER = { addcase: ["criarcase", "novocase"], delcase: ["remcase", "rmcase"], vercase: ["codigocase"], menucases: ["casesia"] };

const MAX_CASES = 60;
const MAX_CODIGO = 12000;
const TENTATIVAS = 3;

// ── ARMAZENAMENTO ────────────────────────────────────────
const BANCO = new Map();

const REGISTRO = new Map();

function salvarDisco() {
    try {
        fs.mkdirSync(PASTA, { recursive: true });
        const obj = Object.fromEntries(BANCO);
        const tmp = ARQUIVO + ".tmp";
        fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
        fs.renameSync(tmp, ARQUIVO);
    } catch (err) {
        console.error("[casesia] erro ao salvar:", err.message);
    }
}

// ── VALIDAÇÃO / COMPILAÇÃO ───────────────────────────────
const PROIBIDOS = [
    [/child_process/, "child_process"],
    [/\bprocess\b/, "process"],
    [/\bglobal(This)?\b/, "global/globalThis"],
    [/\beval\s*\(|\bFunction\s*\(|new\s+Function|\.constructor\b|\bconstructor\s*\(/, "eval/Function/constructor"],
    [/\bimport\s*\(|\bimport\s+/, "import"],
    [/\b__dirname\b|\b__filename\b|\bmodule\b|\bexports\b/, "module/__dirname"],
    [/\bfs\b|\bfs-extra\b|writeFile|readFile|unlink|rmSync|rmdir|mkdirSync|appendFile/, "acesso a arquivos"],
    [/config\.json|\.env\b|creds\.json|auth_info|session\//i, "arquivos sensíveis"],
    [/while\s*\(\s*(true|1)\s*\)|for\s*\(\s*;\s*;\s*\)/, "loop infinito"],
    [/\bsetInterval\s*\(/, "setInterval"],
    [/updateBlockStatus|groupLeave|logout\s*\(|\.end\s*\(/, "ação destrutiva na conta"]
];

// require liberado só pra módulos seguros
const MODULOS_OK = { axios, crypto, path };
function requireSeguro(nome) {
    if (Object.prototype.hasOwnProperty.call(MODULOS_OK, nome)) return MODULOS_OK[nome];
    throw new Error(`módulo "${nome}" não é permitido nos cases da IA`);
}

const sleep = (ms) => new Promise(r => setTimeout(r, Math.min(Math.max(Number(ms) || 0, 0), 15000)));
const sortear = (lista) => (Array.isArray(lista) && lista.length ? lista[Math.floor(Math.random() * lista.length)] : undefined);
const numero = (jid) => String(jid || "").split("@")[0].split(":")[0];

function extrairNomes(codigo) {
    const nomes = [];
    const re = /(?<=^|[\n{;:])\s*case\s+(["'`])([^"'`\s]+)\1\s*:/g;
    let m;
    while ((m = re.exec(codigo))) nomes.push(m[2].toLowerCase());
    return [...new Set(nomes)];
}

function validarNome(nome) {
    return /^[a-z0-9_-]{2,32}$/.test(nome);
}

function analisar(codigo) {
    if (!codigo || codigo.length > MAX_CODIGO) return { erro: "código vazio ou grande demais" };
    if (!/^\s*(\/\/[^\n]*\n\s*)*case\s/.test(codigo)) return { erro: "o código não começa com `case`" };

    for (const [re, rotulo] of PROIBIDOS) {
        if (re.test(codigo)) return { erro: `usa algo proibido (${rotulo})` };
    }

    const nomes = extrairNomes(codigo);
    if (!nomes.length) return { erro: "não achei nenhum `case \"nome\":`" };
    for (const n of nomes) if (!validarNome(n)) return { erro: `nome de comando inválido: ${n}` };

    let fn;
    try {
        fn = compilar(codigo);
    } catch (err) {
        return { erro: `erro de sintaxe: ${err.message}` };
    }
    return { nomes, fn };
}

function compilar(codigo) {
    const corpo = `
        const { conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
                reply, reagir, enviar, getMediaBuffer, exigirGrupo, exigirAdmin, exigirDono,
                mencionados, alvo, membros, sortear, sleep, numero, axios, crypto, path } = ctx;
        switch (command) {
        ${codigo}
        }
    `;
    // process/global/etc. entram como parâmetros "vazios" pra ficarem invisíveis pro código
    return new AsyncFunction("ctx", "require", "process", "global", "globalThis", "module", "exports", corpo);
}

function extrairDesc(codigo, pedido) {
    const m = codigo.match(/\/\/\s*desc:\s*([^\n]+)/i);
    const bruto = (m ? m[1] : pedido || "comando criado pela ia").trim();
    return bruto.length > 70 ? bruto.slice(0, 67) + "..." : bruto;
}

// ── REGISTRO ─────────────────────────────────────────────
function registrar(reg) {
    const analise = analisar(reg.codigo);
    if (analise.erro) throw new Error(analise.erro);
    for (const n of reg.nomes) REGISTRO.set(n, { reg, fn: analise.fn });
}

function desregistrar(reg) {
    for (const n of reg.nomes) REGISTRO.delete(n);
}

function carregar() {
    try {
        if (!fs.existsSync(ARQUIVO)) return;
        const obj = JSON.parse(fs.readFileSync(ARQUIVO, "utf-8"));
        for (const [id, reg] of Object.entries(obj)) {
            try {
                registrar(reg);
                BANCO.set(id, reg);
            } catch (err) {
                console.error(`[casesia] pulei "${id}": ${err.message}`);
            }
        }
    } catch (err) {
        console.error("[casesia] erro ao carregar:", err.message);
    }
}

// nomes que já existem no bot (menu + `case "x"` do index.js) pra IA não sobrescrever nada
let _nomesDoBot = null;
function nomesDoBot(todosComandos) {
    if (!_nomesDoBot) {
        _nomesDoBot = new Set();
        try {
            const src = fs.readFileSync(path.join(__dirname, "..", "index.js"), "utf-8");
            const re = /case\s+["']([a-z0-9_-]+)["']\s*:/gi;
            let m;
            while ((m = re.exec(src))) _nomesDoBot.add(m[1].toLowerCase());
        } catch {}
    }
    const extra = new Set(_nomesDoBot);
    try { for (const c of (todosComandos ? todosComandos() : [])) extra.add(String(c).toLowerCase()); } catch {}
    for (const g of GERENCIAMENTO) { extra.add(g); (ALIASES_GER[g] || []).forEach(a => extra.add(a)); }
    return extra;
}

// ── IA (zone.api.br /api/ia/gpt-6-luna) ──────────────────
const PROMPT_BASE =
    "Aja como um desenvolvedor de bots de WhatsApp (Node.js + Baileys). " +
    "Você escreve comandos no formato `case` de um switch(command). " +
    "RESPONDA APENAS COM O CÓDIGO DO CASE, sem markdown, sem ```, sem explicação antes ou depois. " +
    "A primeira linha deve ser um comentário `// desc: descrição curta do comando (até 60 caracteres)`. " +
    "Depois: case \"nome\": { ...código... break; } — o nome é minúsculo, sem espaço, sem prefixo. Aliases: case \"a\": case \"b\": { ... }. " +
    "Variáveis já disponíveis (NÃO redeclare): conn, info, from, sender, isGroup, isDono, args (array), q (texto depois do comando), command, prefix, config, " +
    "reply(texto) responde citando, reagir(emoji), enviar(conn, from, conteudo, { quoted: info }) envia qualquer mensagem do Baileys, " +
    "getMediaBuffer(msg, tipo), exigirGrupo(), exigirAdmin(), exigirDono() (retornam false se não puder; use `if (!(await exigirGrupo())) break;`), " +
    "mencionados (array de JIDs marcados ou do usuário respondido), alvo (primeiro mencionado ou undefined), await membros() (JIDs dos participantes do grupo), " +
    "sortear(array), sleep(ms), numero(jid) (só o número), axios, crypto, path. " +
    "Para marcar pessoas use enviar(conn, from, { text: `... @${numero(jid)}`, mentions: [jid] }, { quoted: info }). " +
    "PROIBIDO: require, import, process, fs, eval, child_process, loops infinitos, mexer em arquivos ou config. " +
    "Textos em português do Brasil, com emojis, tom divertido. Use await. Trate erros com try/catch. Termine cada case com break;";

async function pedirParaIA(pedido, sessao, erroAnterior) {
    const texto = erroAnterior
        ? `Faça um comando em case: ${pedido}\n\nATENÇÃO: sua versão anterior falhou (${erroAnterior}). Corrija e devolva SÓ o código do case.`
        : `Faça um comando em case: ${pedido}`;

    const resp = await client().get(caminhoEndpoint("gpt6luna"), {
        params: {
            apikey: config.zoneApi?.apikey || " ",
            text: texto,
            prompt: PROMPT_BASE,
            session: sessao
        },
        timeout: 90000
    });

    return extrairTexto(resp.data);
}

function extrairTexto(dados) {
    if (typeof dados === "string") return dados;
    const chaves = ["result", "message", "response", "answer", "text", "reply", "output", "content", "data"];
    for (const k of chaves) {
        const v = dados?.[k];
        if (typeof v === "string" && v.trim()) return v;
        if (v && typeof v === "object") {
            const r = extrairTexto(v);
            if (r) return r;
        }
    }
    return null;
}

function limparCodigo(bruto) {
    let t = String(bruto || "").replace(/\r/g, "").trim();
    const bloco = t.match(/```(?:javascript|js|node)?\s*\n([\s\S]*?)```/i);
    if (bloco) t = bloco[1].trim();
    else t = t.replace(/^```(?:javascript|js)?/i, "").replace(/```$/, "").trim();

    const ini = t.search(/(\/\/\s*desc:|\bcase\s+["'`])/i);
    if (ini > 0) t = t.slice(ini);
    return t.trim();
}

async function gerarCase(pedido, nomesExistentes) {
    const sessao = "casesia-" + crypto.randomBytes(4).toString("hex");
    let erro = null;

    for (let i = 0; i < TENTATIVAS; i++) {
        let bruto;
        try {
            bruto = await pedirParaIA(pedido, sessao, erro);
        } catch (err) {
            const st = err?.response?.status;
            erro = st ? `a api respondeu ${st}` : (err?.message || "falha ao chamar a api");
            if (i === TENTATIVAS - 1) return { erro };
            continue;
        }

        const codigo = limparCodigo(bruto);
        const analise = analisar(codigo);
        if (analise.erro) { erro = analise.erro; continue; }

        let final = codigo;
        const renomeados = [];
        for (const n of analise.nomes.filter(x => nomesExistentes.has(x))) {
            let novo = n + "ia";
            for (let k = 2; nomesExistentes.has(novo) || analise.nomes.includes(novo); k++) novo = `${n}ia${k}`;
            final = final.replace(new RegExp(`(case\\s+)(["'\`])${n}\\2(\\s*:)`, "g"), `$1$2${novo}$2$3`);
            renomeados.push([n, novo]);
        }

        if (renomeados.length) {
            const rean = analisar(final);
            if (rean.erro) { erro = rean.erro; continue; }
            return { codigo: final, nomes: rean.nomes, renomeados };
        }
        return { codigo, nomes: analise.nomes, renomeados };
    }
    return { erro: erro || "a ia não devolveu um case válido" };
}

// ── EXECUÇÃO DOS CASES ───────────────────────────────────
function montarAjudantes(ctx) {
    const { conn, info, from } = ctx;
    const citado = info.message?.extendedTextMessage?.contextInfo;
    const mencionados = [
        ...(citado?.mentionedJid || []),
        ...(citado?.participant && citado?.quotedMessage ? [citado.participant] : [])
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    return {
        mencionados,
        alvo: mencionados[0],
        membros: async () => {
            if (!from?.endsWith("@g.us")) return [];
            const meta = await conn.groupMetadata(from);
            return (meta?.participants || []).map(p => p.phoneNumber || p.jid || p.id).filter(Boolean);
        },
        sortear, sleep, numero, axios, crypto, path
    };
}

async function executar(entrada, ctx) {
    const extra = montarAjudantes(ctx);
    try {
        await entrada.fn({ ...ctx, ...extra }, requireSeguro, undefined, undefined, undefined, undefined, undefined);
    } catch (err) {
        console.error(`[casesia] erro em ${ctx.command}:`, err);
        try { await ctx.reply("❌ esse comando deu erro aqui 😔 o dono pode usar " + ctx.prefix + "vercase " + ctx.command + " pra conferir."); } catch {}
    }
}

function resolverGer(command) {
    for (const g of GERENCIAMENTO) {
        if (g === command || (ALIASES_GER[g] || []).includes(command)) return g;
    }
    return null;
}

function textoDaResposta(info) {
    const m = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    return m?.conversation || m?.extendedTextMessage?.text || "";
}

function instalar({ codigo, nomes, pedido, por }) {
    const id = nomes[0];
    const antigo = BANCO.get(id);
    if (antigo) { desregistrar(antigo); BANCO.delete(id); }

    const reg = { nomes, desc: extrairDesc(codigo, pedido), pedido: pedido || "", codigo, criadoEm: new Date().toISOString(), por: por || "" };
    registrar(reg);
    BANCO.set(id, reg);
    salvarDisco();
    return { reg, substituiu: !!antigo };
}

function acharRegistro(nome) {
    const n = String(nome || "").toLowerCase().replace(/^[^a-z0-9]+/, "");
    const e = REGISTRO.get(n);
    return e ? e.reg : null;
}

async function tratarGer(ctx, cmd) {
    const { info, q, prefix, reply, reagir, exigirDono, sender, todosComandos } = ctx;

    if (cmd === "menucases") return false;

    if (!exigirDono()) return true;

    if (cmd === "addcase") {
        const colado = textoDaResposta(info);
        const pedido = String(q || "").trim();

        if (!pedido && /^\s*(\/\/[^\n]*\n\s*)*case\s/.test(colado)) {
            const codigo = limparCodigo(colado);
            const analise = analisar(codigo);
            if (analise.erro) { await reply(`❌ esse case não passou: ${analise.erro}`); return true; }
            const conflito = analise.nomes.filter(n => nomesDoBot(todosComandos).has(n) && !REGISTRO.has(n));
            if (conflito.length) { await reply(`❌ o comando ${conflito.join(", ")} já existe no bot, muda o nome!`); return true; }
            const { reg, substituiu } = instalar({ codigo, nomes: analise.nomes, pedido: "case colado manualmente", por: sender });
            await reply(`✅ case ${substituiu ? "atualizado" : "adicionado"}!\n\n▸ ${reg.nomes.map(n => prefix + n).join(" / ")}\n\nmenu só dos cases: ${prefix}menucases`);
            return true;
        }

        if (!pedido) {
            await reply(
                `me diz o comando que você quer que a IA crie 🧠\n\n` +
                `▸ ${prefix}addcase um comando de casal que sorteia dois membros do grupo\n` +
                `▸ ${prefix}addcase comando de abraço marcando alguém\n\n` +
                `também dá pra responder uma mensagem com um case pronto usando só ${prefix}addcase`
            );
            return true;
        }

        if (pedido.length > 500) { await reply("o pedido tá grande demais, resume em até 500 caracteres!"); return true; }
        if (BANCO.size >= MAX_CASES) { await reply(`já tem ${MAX_CASES} cases, remove algum com ${prefix}delcase antes.`); return true; }

        await reagir("🧠");
        await reply("🧠 a IA tá escrevendo o comando... pode levar uns segundos");

        const nomesExistentes = new Set([...nomesDoBot(todosComandos)].filter(n => !REGISTRO.has(n)));
        const r = await gerarCase(pedido, nomesExistentes);

        if (r.erro) {
            await reagir("❌");
            await reply(`❌ não consegui criar: ${r.erro}\n\ntenta reescrever o pedido de outro jeito!`);
            return true;
        }

        try {
            const { reg, substituiu } = instalar({ codigo: r.codigo, nomes: r.nomes, pedido, por: sender });
            await reagir("✅");
            await reply(
                `✅ comando ${substituiu ? "atualizado" : "criado"} e já tá funcionando!\n\n` +
                `▸ ${reg.nomes.map(n => prefix + n).join(" / ")}\n` +
                `▸ ${reg.desc}\n` +
                (r.renomeados?.length ? `ℹ️ ${r.renomeados.map(([a, b]) => `${prefix}${a} já existia no bot, então virou ${prefix}${b}`).join("; ")}\n` : "") +
                `\n` +
                `👁️ ver o código: ${prefix}vercase ${reg.nomes[0]}\n` +
                `🗑️ apagar: ${prefix}delcase ${reg.nomes[0]}\n` +
                `📋 menu dos cases: ${prefix}menucases`
            );
        } catch (err) {
            await reagir("❌");
            await reply(`❌ o case foi gerado mas não passou na validação: ${err.message}`);
        }
        return true;
    }

    if (cmd === "vercase") {
        const reg = acharRegistro(q);
        if (!reg) { await reply(`não achei esse case. use ${prefix}menucases pra ver a lista`); return true; }
        await reply(`📄 *${reg.nomes.map(n => prefix + n).join(" / ")}*\n${reg.desc}\n\n\`\`\`${reg.codigo}\`\`\``);
        return true;
    }

    if (cmd === "delcase") {
        const reg = acharRegistro(q);
        if (!reg) { await reply(`não achei esse case. use ${prefix}menucases pra ver a lista`); return true; }
        desregistrar(reg);
        BANCO.delete(reg.nomes[0]);
        salvarDisco();
        await reply(`🗑️ case *${reg.nomes[0]}* removido!`);
        return true;
    }

    return true;
}

async function tratar(ctx) {
    const cmd = resolverGer(ctx.command);
    if (cmd) return tratarGer(ctx, cmd);

    const entrada = REGISTRO.get(ctx.command);
    if (!entrada) return false;
    await executar(entrada, ctx);
    return true;
}

// ── MENU (categoria própria, atualiza ao vivo) ───────────
const DESC_GER = {
    addcase: "a IA cria um comando novo (dono)",
    delcase: "remove um comando criado (dono)",
    vercase: "mostra o código do comando (dono)",
    menucases: "esse menu"
};

const CATEGORIA_MENU = {
    emoji: "🧩", nome: "cases ia", cor: "💙", grupo: "cases",
    get comandos() {
        const fixos = GERENCIAMENTO.map(c => ({ cmd: c, desc: DESC_GER[c] }));
        const criados = [...BANCO.values()].flatMap(reg =>
            reg.nomes.map((n, i) => ({ cmd: n, desc: i === 0 ? reg.desc : `atalho de ${reg.nomes[0]}` }))
        );
        return [...fixos, ...criados];
    },
    get total() { return BANCO.size; }
};

const CATEGORIAS_MENU = [CATEGORIA_MENU];

carregar();

module.exports = { tratar, CATEGORIAS_MENU, CATEGORIA_MENU, REGISTRO, BANCO, GERENCIAMENTO };
