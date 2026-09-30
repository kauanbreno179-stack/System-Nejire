const path = require("path");
const fs = require("fs");
const db = require("../utils/db.js");
const Jid = require("../utils/jid.js");
const Moderacao = require("./moderacao.js");
const { pequeno } = require("../utils/texto.js");
const Extras = require("./antisextras.js");

const DB_PATH = path.join(__dirname, "..", "database", "antis.json");

const PADRAO_BOT = {
    antipv: { ativo: false, modo: "ignorar", aviso: true, liberados: [] },
    anticall: { ativo: true, modo: "rejeitar", aviso: true }
};

const PADRAO_GRUPO = () => ({
    ativos: {},
    punicao: "apagar",
    palavras: [],
    ddis: ["55"]
});

db.ensure(DB_PATH, { grupos: {}, bot: PADRAO_BOT });

// ── CATÁLOGO ─────────────────────────────────────────────
const CATALOGO = {
    antifig: { emoji: "🗣️", desc: "apaga figurinhas", aviso: "figurinhas não são permitidas aqui", tipos: ["sticker"] },
    antiimg: { emoji: "🖼️", desc: "apaga imagens", aviso: "imagens não são permitidas aqui", tipos: ["image"] },
    antivideo: { emoji: "🎬", desc: "apaga vídeos e gifs", aviso: "vídeos não são permitidos aqui", tipos: ["video"] },
    antiaudio: { emoji: "🎙️", desc: "apaga áudios e notas de voz", aviso: "áudios não são permitidos aqui", tipos: ["audio"] },
    antidoc: { emoji: "📄", desc: "apaga documentos e arquivos", aviso: "documentos não são permitidos aqui", tipos: ["document"] },
    antictt: { emoji: "📇", desc: "apaga contatos compartilhados", aviso: "contatos não são permitidos aqui", tipos: ["contact"] },
    antiloc: { emoji: "📍", desc: "apaga localizações", aviso: "localização não é permitida aqui", tipos: ["location"] },
    antienquete: { emoji: "📊", desc: "apaga enquetes", aviso: "enquetes não são permitidas aqui", tipos: ["poll"] },
    antivu: { emoji: "👁️", desc: "apaga mídia de visualização única", aviso: "visualização única não é permitida aqui", especial: "viewonce" },
    antitrava: { emoji: "🧨", desc: "apaga textos gigantes/invisíveis que travam o zap", aviso: "mensagem de trava apagada", especial: "trava" },
    antipalavra: { emoji: "🤬", desc: "apaga mensagens com palavras proibidas", aviso: "palavra proibida no grupo", especial: "palavra" },
    antilinkgp: { emoji: "🔗", desc: "apaga convites de outros grupos", aviso: "convite de grupo não é permitido aqui", especial: "linkgp" },
    antifake: { emoji: "🌍", desc: "remove quem entra com número de outro país", aviso: "número estrangeiro removido", especial: "fake" },
    antiporn: { emoji: "🔞", desc: "apaga mídia pornográfica (IA — o rigor acompanha a punição do grupo)", aviso: "conteúdo pornográfico não é permitido aqui", especial: "porn" },
    antistatusgp: { emoji: "📢", desc: "apaga status de grupo (e quem cita/reage pra mantê-lo)", aviso: "status de grupo não é permitido aqui", especial: "statusgp" },
    anticanal: { emoji: "📡", desc: "apaga divulgação e encaminhados de canal do whatsapp", aviso: "divulgar canal não é permitido aqui", especial: "canal" },
    antibot: { emoji: "🤖", desc: "apaga e remove possíveis bots (heurística — não entra no antis todos)", aviso: "possível bot detectado", especial: "bot", manual: true, punicaoFixa: "banir" },
    antipayment: { emoji: "💸", desc: "apaga mensagem de pagamento, remove o autor e fecha/limpa/reabre o grupo", aviso: "mensagem de pagamento removida", especial: "payment", propria: true }
};

const CATALOGO_BOT = {
    antipv: { emoji: "📵", desc: "ignora (ou bloqueia) quem chama a bot no privado" },
    anticall: { emoji: "📞", desc: "recusa (ou bloqueia) quem liga pra bot" }
};

const NOMES_GRUPO = Object.keys(CATALOGO);
const NOMES_BOT = Object.keys(CATALOGO_BOT);
const PUNICOES = ["apagar", "aviso", "banir"];

// ── BANCO
let _cache = null;
let _mtime = 0;

function _dados() {
    let m = 0;
    try { m = fs.statSync(DB_PATH).mtimeMs; } catch {}

    if (!_cache || m !== _mtime) {
        const bruto = db.read(DB_PATH, {}) || {};
        _cache = {
            grupos: bruto.grupos || {},
            bot: {
                antipv: { ...PADRAO_BOT.antipv, ...(bruto.bot?.antipv || {}) },
                anticall: { ...PADRAO_BOT.anticall, ...(bruto.bot?.anticall || {}) }
            }
        };
        _mtime = m;
    }

    return _cache;
}

function _salvar() {
    db.write(DB_PATH, _cache);
    try { _mtime = fs.statSync(DB_PATH).mtimeMs; } catch {}
}

function _grupoLeitura(groupId) {
    return _dados().grupos[groupId] || null;
}

function _grupoEscrita(groupId) {
    const d = _dados();
    if (!d.grupos[groupId]) d.grupos[groupId] = PADRAO_GRUPO();
    const g = d.grupos[groupId];
    g.ativos = g.ativos || {};
    g.palavras = g.palavras || [];
    g.ddis = g.ddis?.length ? g.ddis : ["55"];
    g.punicao = PUNICOES.includes(g.punicao) ? g.punicao : "apagar";
    return g;
}

// ── CONFIG POR GRUPO ─────────────────────────────────────
function ehAntiGrupo(nome) {
    return NOMES_GRUPO.includes(nome);
}

function ativo(groupId, nome) {
    return !!_grupoLeitura(groupId)?.ativos?.[nome];
}

function definir(groupId, nome, ligado) {
    if (!ehAntiGrupo(nome)) return false;
    const g = _grupoEscrita(groupId);
    g.ativos[nome] = !!ligado;
    _salvar();
    return true;
}

function definirTodos(groupId, ligado) {
    const g = _grupoEscrita(groupId);
    let total = 0;
    for (const nome of NOMES_GRUPO) {
        if (ligado && CATALOGO[nome].manual) continue; // antis "manuais" só ligam pelo próprio comando
        g.ativos[nome] = !!ligado;
        total++;
    }
    _salvar();
    return total;
}

function punicao(groupId) {
    const p = _grupoLeitura(groupId)?.punicao;
    return PUNICOES.includes(p) ? p : "apagar";
}

function definirPunicao(groupId, nova) {
    if (!PUNICOES.includes(nova)) return false;
    _grupoEscrita(groupId).punicao = nova;
    _salvar();
    return true;
}

function listaPalavras(groupId) {
    return [...(_grupoLeitura(groupId)?.palavras || [])];
}

function addPalavra(groupId, palavra) {
    const limpa = String(palavra || "").trim().toLowerCase();
    if (limpa.length < 2 || limpa.length > 40) return { ok: false, motivo: "a palavra precisa ter de 2 a 40 letras" };
    const g = _grupoEscrita(groupId);
    if (g.palavras.includes(limpa)) return { ok: false, motivo: "essa palavra já tá na lista" };
    if (g.palavras.length >= 100) return { ok: false, motivo: "limite de 100 palavras por grupo" };
    g.palavras.push(limpa);
    _salvar();
    return { ok: true };
}

function delPalavra(groupId, palavra) {
    const limpa = String(palavra || "").trim().toLowerCase();
    const g = _grupoEscrita(groupId);
    const antes = g.palavras.length;
    g.palavras = g.palavras.filter(p => p !== limpa);
    _salvar();
    return g.palavras.length < antes;
}

function limparPalavras(groupId) {
    const g = _grupoEscrita(groupId);
    const total = g.palavras.length;
    g.palavras = [];
    _salvar();
    return total;
}

function ddisPermitidos(groupId) {
    const l = _grupoLeitura(groupId)?.ddis;
    return l?.length ? [...l] : ["55"];
}

function definirDdis(groupId, lista) {
    const limpos = [...new Set((lista || []).map(d => String(d).replace(/\D/g, "")).filter(d => d.length >= 1 && d.length <= 4))];
    if (!limpos.length) return false;
    _grupoEscrita(groupId).ddis = limpos;
    _salvar();
    return limpos;
}

// ── CONFIG DO BOT INTEIRO ────────────────────────────────
function configBot(nome) {
    return { ..._dados().bot[nome] };
}

function definirBot(nome, parcial) {
    if (!NOMES_BOT.includes(nome)) return false;
    const d = _dados();
    d.bot[nome] = { ...d.bot[nome], ...parcial };
    _salvar();
    return true;
}

function liberarPv(jid) {
    const cfg = _dados().bot.antipv;
    const numero = Jid.numero(jid);
    if (!numero) return false;
    if (!cfg.liberados.includes(numero)) cfg.liberados.push(numero);
    _salvar();
    return true;
}

function desliberarPv(jid) {
    const cfg = _dados().bot.antipv;
    const numero = Jid.numero(jid);
    const antes = cfg.liberados.length;
    cfg.liberados = cfg.liberados.filter(n => n !== numero);
    _salvar();
    return cfg.liberados.length < antes;
}

// ── LEITURA DE MENSAGEM ──────────────────────────────────
const ENVELOPES = ["ephemeralMessage", "viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension", "documentWithCaptionMessage"];
const ENVELOPES_VU = new Set(["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension"]);

function desembrulhar(message) {
    let atual = message;
    let viewOnce = false;

    for (let i = 0; i < 6 && atual; i++) {
        const chave = ENVELOPES.find(k => atual[k]?.message);
        if (!chave) break;
        if (ENVELOPES_VU.has(chave)) viewOnce = true;
        atual = atual[chave].message;
    }

    return { msg: atual || null, viewOnce };
}

function classificar(m) {
    if (!m) return null;
    if (m.stickerMessage) return "sticker";
    if (m.imageMessage) return "image";
    if (m.videoMessage || m.ptvMessage) return "video";
    if (m.audioMessage) return "audio";
    if (m.documentMessage) return "document";
    if (m.contactMessage || m.contactsArrayMessage) return "contact";
    if (m.locationMessage || m.liveLocationMessage) return "location";
    if (m.pollCreationMessage || m.pollCreationMessageV2 || m.pollCreationMessageV3) return "poll";
    if (m.conversation !== undefined || m.extendedTextMessage) return "text";
    return null;
}

function inspecionar(message) {
    const { msg, viewOnce } = desembrulhar(message);
    const tipo = classificar(msg);

    const midia = msg?.imageMessage || msg?.videoMessage || msg?.audioMessage;
    const texto =
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        msg?.videoMessage?.caption ||
        msg?.documentMessage?.caption ||
        "";

    return {
        tipo,
        texto: String(texto || ""),
        viewOnce: viewOnce || midia?.viewOnce === true,
        vcard: msg?.contactMessage?.vcard || "",
        totalContatos: msg?.contactsArrayMessage?.contacts?.length || 0
    };
}

// ── DETECTORES ───────────────────────────────────────────
const REGEX_LINK_GP = /(?:chat\.whatsapp\.com\/|whatsapp\.com\/invite\/)[A-Za-z0-9]{8,}/i;

function ehTrava(insp) {
    const t = insp.texto;

    if (insp.vcard.length > 10000 || insp.totalContatos > 10) return true;
    if (!t) return false;
    if (t.length >= 4000) return true;

    const invisiveis = (t.match(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g) || []).length;
    if (invisiveis >= 60) return true;

    const combinantes = (t.match(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD]/g) || []).length;
    if (combinantes >= 60) return true;

    if (/(.)\1{249,}/su.test(t)) return true;

    return false;
}

const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i" };

function normalizarPalavras(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/(?<=[a-z])!(?=[a-z])/g, "i")
        .replace(/[013457@$]/g, c => LEET[c] || c)
        .replace(/[^a-z\s]/g, " ")
        .replace(/([a-z])\1+/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}

const _regexPalavras = new Map();

function acharPalavra(texto, palavras) {
    if (!texto || !palavras?.length) return null;

    const alvo = ` ${normalizarPalavras(texto)} `;
    if (alvo.trim() === "") return null;

    const normalizadas = palavras.map(p => ({ original: p, norm: normalizarPalavras(p) })).filter(p => p.norm);
    for (const p of normalizadas) {
        if (alvo.includes(` ${p.norm} `)) return p.original;
    }
    return null;
}

function avaliar(cfg, insp) {
    if (!cfg || !insp?.tipo) return null;
    const at = cfg.ativos || {};

    if (at.antitrava && ehTrava(insp)) return { anti: "antitrava" };
    if (at.antivu && insp.viewOnce) return { anti: "antivu" };

    for (const nome of NOMES_GRUPO) {
        const def = CATALOGO[nome];
        if (at[nome] && def.tipos?.includes(insp.tipo)) return { anti: nome };
    }

    if (at.antilinkgp && REGEX_LINK_GP.test(insp.texto)) return { anti: "antilinkgp" };

    if (at.antipalavra && cfg.palavras?.length) {
        const achou = acharPalavra(insp.texto, cfg.palavras);
        if (achou) return { anti: "antipalavra", detalhe: achou };
    }

    return null;
}

// detectores que não dependem do "tipo" da mensagem (status, canal, bot, pagamento)
function avaliarExtras(cfg, info, insp, sender) {
    const at = cfg?.ativos || {};

    if (at.antipayment && Extras.temPagamento(info.message)) return { anti: "antipayment" };

    if (at.antistatusgp) {
        const det = Extras.detectarStatus(info, sender);
        if (det) return { anti: "antistatusgp", det };
    }

    if (at.anticanal && Extras.detectarCanal(desembrulhar(info.message).msg, insp.texto)) return { anti: "anticanal" };
    if (at.antibot && Extras.detectarBot(info)) return { anti: "antibot" };

    return null;
}

const _metaCache = new Map();
const TTL_META_MS = 25000;

async function participantes(conn, groupId) {
    const c = _metaCache.get(groupId);
    if (c && Date.now() - c.t < TTL_META_MS) return c.lista;

    try {
        const meta = await conn.groupMetadata(groupId);
        const lista = meta?.participants || [];
        _metaCache.set(groupId, { t: Date.now(), lista });
        return lista;
    } catch {
        return c?.lista || [];
    }
}

function invalidarMeta(groupId) {
    _metaCache.delete(groupId);
}

function normalizarJid(jid) {
    if (!jid) return "";
    const [usuario, dominio] = String(jid).split("@");
    return `${usuario.split(":")[0]}@${dominio || "s.whatsapp.net"}`;
}

function botEhAdmin(conn, lista) {
    const meus = [conn?.user?.id, conn?.user?.lid, conn?.user?.jid].filter(Boolean).map(normalizarJid);
    return meus.some(j => Jid.ehAdmin(lista, j));
}

async function botEhAdminAgora(conn, groupId) {
    invalidarMeta(groupId);
    return botEhAdmin(conn, await participantes(conn, groupId));
}

// ── ENVIO ────────────────────────────────────────────────
function _enviar(conn, jid, conteudo, opts = {}) {
    if (typeof conn.nejireSend === "function") return conn.nejireSend(jid, conteudo, opts);
    return conn.sendMessage(jid, conteudo, opts);
}

const _ultimoAviso = new Map();
const _semAdminAvisado = new Map();

function _podeAvisar(chave, cooldownMs) {
    const agora = Date.now();
    if (agora - (_ultimoAviso.get(chave) || 0) < cooldownMs) return false;
    _ultimoAviso.set(chave, agora);

    if (_ultimoAviso.size > 2000) {
        for (const [k, t] of _ultimoAviso) if (agora - t > cooldownMs) _ultimoAviso.delete(k);
    }
    return true;
}

// ── AÇÃO NO GRUPO ────────────────────────────────────────
async function aplicarGrupo(conn, info, { from, sender, isDono }) {
    if (!from?.endsWith("@g.us") || info?.key?.fromMe || isDono) return false;

    const cfg = _grupoLeitura(from);
    if (!cfg || !Object.values(cfg.ativos || {}).some(Boolean)) return false;

    const insp = inspecionar(info.message);
    let veredito = avaliarExtras(cfg, info, insp, sender) || avaliar(cfg, insp);

    // antiporn precisa baixar e analisar a mídia — só roda depois de saber que quem mandou não é admin
    let checarPorn = false;
    if (!veredito && cfg.ativos?.antiporn && Extras.MIDIA_PORN[insp.tipo]) {
        veredito = { anti: "antiporn" };
        checarPorn = true;
    }

    if (!veredito) return false;

    const lista = await participantes(conn, from);
    if (Jid.ehAdmin(lista, sender)) return false;

    if (!botEhAdmin(conn, lista)) {
        const agora = Date.now();
        if (agora - (_semAdminAvisado.get(from) || 0) > 10 * 60 * 1000) {
            _semAdminAvisado.set(from, agora);
            await _enviar(conn, from, { text: pequeno(`⚠️ o ${veredito.anti} tá ligado, mas eu não sou admin aqui e não consigo apagar nada. me promove pra eu funcionar!`) }).catch(() => null);
        }
        return false;
    }

    const def = CATALOGO[veredito.anti];
    const alvo = `@${sender.split("@")[0]}`;
    const modo = def.punicaoFixa || cfg.punicao || "apagar";
    let motivo = def.aviso;

    if (checarPorn) {
        const r = await Extras.checarPorn(desembrulhar(info.message).msg, insp.tipo, modo);
        if (!r) return false;
        motivo = `${def.aviso} (${(r.confidence * 100).toFixed(1)}% de confiança)`;
    }

    // antipayment tem defesa própria (apaga em 2 camadas, bane e fecha/limpa/reabre o grupo)
    if (def.propria) {
        const removido = await Extras.aplicarDefesaPagamento({
            conn, from, sender,
            messageKey: { ...info.key, participant: info.key.participant || sender }
        });

        if (_podeAvisar(`pay:${from}:${sender}`, 60000)) {
            await _enviar(conn, from, {
                text: pequeno(removido
                    ? `💸 mensagem de pagamento apagada e ${alvo} foi removido(a) — o grupo foi fechado, limpo e reaberto`
                    : `💸 mensagem de pagamento apagada, mas não consegui remover ${alvo} — confere se eu sou admin!`),
                mentions: [sender]
            }).catch(() => null);
        }
        return true;
    }

    if (veredito.det) {
        await Extras.apagarStatus(conn, from, veredito.det);
    } else {
        await conn.sendMessage(from, { delete: info.key }).catch(err => {
            console.error("[antis] não consegui apagar:", err?.message || err);
        });
    }

    try {
        if (modo === "banir") {
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            await _enviar(conn, from, { text: pequeno(`🚫 ${alvo} foi removido(a) — ${motivo}`), mentions: [sender] });
        } else if (modo === "aviso") {
            const total = Moderacao.darAviso(from, sender);
            if (total >= Moderacao.LIMITE_AVISOS) {
                Moderacao.resetarAvisos(from, sender);
                await conn.groupParticipantsUpdate(from, [sender], "remove");
                await _enviar(conn, from, { text: pequeno(`🚫 ${alvo} bateu ${Moderacao.LIMITE_AVISOS} avisos e foi removido(a) — ${motivo}`), mentions: [sender] });
            } else {
                await _enviar(conn, from, { text: pequeno(`⚠️ ${alvo} ${motivo} (aviso ${total}/${Moderacao.LIMITE_AVISOS})`), mentions: [sender] });
            }
        } else if (_podeAvisar(`${from}:${sender}:${veredito.anti}`, 30000)) {
            await _enviar(conn, from, { text: pequeno(`${def.emoji} ${alvo}, ${motivo}`), mentions: [sender] });
        }
    } catch (err) {
        console.error("[antis] erro ao punir:", err?.message || err);
    }

    return true;
}

// antipayment "stealth": mensagem indecifrável (cobrança escondida de admins e do bot).
// Essas mensagens chegam sem .message, então o index.js nunca vê — o connect.js/subbot.js chamam isso direto.
async function tratarCifrado(conn, info) {
    try {
        const from = info?.key?.remoteJid;
        if (!from?.endsWith("@g.us") || info.key.fromMe || !info.key.participant) return;
        if (!ativo(from, "antipayment")) return;

        let sender = info.key.participant;
        try { sender = Jid.resolverSender(info, true, from) || sender; } catch {}

        const analise = Extras.analisarCifrado(info, from, sender);
        if (!analise) return;

        if (Jid.ehDono(sender)) return;

        const lista = await participantes(conn, from);
        if (Jid.ehAdmin(lista, sender) || !botEhAdmin(conn, lista)) return;

        console.warn(`[antipayment-stealth] suspeita (${analise.confianca}) em ${from} | autor ${sender} | ocorrências=${analise.entrada.count}`);

        const removido = await Extras.aplicarDefesaPagamento({
            conn, from, sender,
            messageKey: { ...info.key, participant: info.key.participant }
        });

        if (Extras.avisoEmCooldown(analise.entrada, analise.agora)) return;
        Extras.marcarAviso(analise.chave, analise.entrada, analise.agora);

        const alvo = `@${sender.split("@")[0]}`;
        const motivo = analise.confianca === "alta"
            ? "tentou mandar cobrança oculta e indecifrável"
            : "mandou várias mensagens indecifráveis seguidas";

        await _enviar(conn, from, {
            text: pequeno(`🚨 antipayment stealth\n\n👤 usuário: ${alvo}\n🛡️ ação: ${removido ? "removido e chat limpo" : "chat limpo (remoção falhou, confere se eu sou admin)"}\n⚠️ motivo: ${motivo}`),
            mentions: [sender]
        }).catch(() => null);
    } catch (err) {
        console.error("[antipayment-stealth] erro:", err?.message || err);
    }
}

// ── ANTIPV ───────────────────────────────────────────────
async function aplicarPv(conn, info, { from, sender, isDono }) {
    if (!from || from.endsWith("@g.us") || from.endsWith("@newsletter") || from === "status@broadcast") return false;
    if (isDono || info?.key?.fromMe) return false;
    if (global.nejireSock && conn !== global.nejireSock) return false;

    const cfg = _dados().bot.antipv;
    if (!cfg.ativo) return false;

    const numero = Jid.numero(sender);
    if (cfg.liberados.some(n => Jid.mesmoContato(n, numero))) return false;

    if (cfg.aviso && _podeAvisar(`pv:${from}`, 6 * 60 * 60 * 1000)) {
        await _enviar(conn, from, {
            text: pequeno(cfg.modo === "bloquear"
                ? "🚫 meu privado tá fechado e você foi bloqueado(a). me chama nos grupos que eu tô por lá!"
                : "📵 meu privado tá desativado. me chama nos grupos que eu tô por lá!")
        }).catch(() => null);
    }

    if (cfg.modo === "bloquear") {
        try { await conn.updateBlockStatus(from, "block"); } catch (err) {
            console.error("[antipv] não consegui bloquear:", err?.message || err);
        }
    }

    return true;
}

// ── ANTICALL ─────────────────────────────────────────────
async function tratarChamada(conn, call) {
    if (!call || call.status !== "offer") return;

    const ativas = Object.values(global.chamadasAtivas || {});
    if (ativas.includes(call.id)) return;

    const cfg = _dados().bot.anticall;
    if (!cfg.ativo) return;

    try { await conn.rejectCall(call.id, call.from); } catch (err) {
        console.error("[anticall] não consegui recusar:", err?.message || err);
    }

    if (cfg.aviso && _podeAvisar(`call:${call.from}`, 10 * 60 * 1000)) {
        await _enviar(conn, call.from, {
            text: pequeno(cfg.modo === "bloquear"
                ? "📵 eu não atendo ligações e você foi bloqueado(a) por ligar. manda mensagem nos grupos!"
                : "📵 eu não atendo ligações, mande mensagem de texto por favor!")
        }).catch(() => null);
    }

    if (cfg.modo === "bloquear") {
        try { await conn.updateBlockStatus(call.from, "block"); } catch (err) {
            console.error("[anticall] não consegui bloquear:", err?.message || err);
        }
    }
}

// ── ANTIFAKE ─────────────────────────────────────────────
function _numeroDoParticipante(p) {
    const jid = typeof p === "string" ? p : (p?.phoneNumber || p?.jid || p?.id || "");
    const id = typeof p === "string" ? p : (p?.id || jid);
    if (!String(jid).endsWith("@s.whatsapp.net")) return { id, numero: null };
    return { id, numero: String(jid).split("@")[0].split(":")[0] };
}

async function tratarEntrada(conn, evento) {
    try {
        const { id: groupId, participants: lista, action } = evento || {};
        if (!groupId) return;

        invalidarMeta(groupId);

        if (action !== "add" || !ativo(groupId, "antifake")) return;

        const permitidos = ddisPermitidos(groupId);
        const expulsar = [];

        for (const p of lista || []) {
            const { id, numero } = _numeroDoParticipante(p);
            if (!numero) continue;
            if (Jid.ehDono(numero)) continue;
            if (!permitidos.some(ddi => numero.startsWith(ddi))) expulsar.push({ id, numero });
        }

        if (!expulsar.length) return;
        if (!(await botEhAdminAgora(conn, groupId))) return;

        await conn.groupParticipantsUpdate(groupId, expulsar.map(e => e.id), "remove");
        await _enviar(conn, groupId, {
            text: pequeno(`🌍 antifake: removi ${expulsar.map(e => `@${e.numero}`).join(", ")} (número fora dos ddis permitidos: ${permitidos.join(", ")})`),
            mentions: expulsar.map(e => e.id)
        }).catch(() => null);
    } catch (err) {
        console.error("[antifake] erro:", err?.message || err);
    }
}

function registrarEventos(sock, { chamadas = false } = {}) {
    sock.ev.on("group-participants.update", evento => tratarEntrada(sock, evento));

    if (chamadas) {
        sock.ev.on("call", async calls => {
            for (const call of calls) await tratarChamada(sock, call);
        });
    }
}

// ── TEXTOS ───────────────────────────────────────────────
function painel(groupId, prefix) {
    const cfg = _grupoLeitura(groupId) || PADRAO_GRUPO();
    const linhas = [
        "╭─❍ 🛡️ antis do grupo ❍─╮",
        ...NOMES_GRUPO.map(nome => {
            const lig = !!cfg.ativos?.[nome];
            return `│ ${lig ? "✅" : "▫️"} ${prefix}${nome} — ${CATALOGO[nome].desc}`;
        }),
        `│ ⚖️ punição: ${cfg.punicao || "apagar"}`,
        `│ 🤬 palavras proibidas: ${cfg.palavras?.length || 0}`,
        `│ 🌍 ddis permitidos: ${(cfg.ddis?.length ? cfg.ddis : ["55"]).join(", ")}`,
        "╰──────────────╯",
        "",
        `usa ${prefix}<anti> on/off pra ligar ou desligar cada um`,
        `${prefix}antis todos on/off • ${prefix}antis punicao apagar/aviso/banir`
    ];
    return linhas.join("\n");
}

function painelBot(prefix) {
    const pv = _dados().bot.antipv;
    const cl = _dados().bot.anticall;
    return [
        "╭─❍ 🛡️ antis do bot ❍─╮",
        `│ ${pv.ativo ? "✅" : "▫️"} ${prefix}antipv — modo: ${pv.modo} • liberados: ${pv.liberados.length}`,
        `│ ${cl.ativo ? "✅" : "▫️"} ${prefix}anticall — modo: ${cl.modo}`,
        "╰──────────────╯"
    ].join("\n");
}

module.exports = {
    CATALOGO, CATALOGO_BOT, NOMES_GRUPO, NOMES_BOT, PUNICOES,
    ehAntiGrupo, ativo, definir, definirTodos,
    punicao, definirPunicao,
    listaPalavras, addPalavra, delPalavra, limparPalavras,
    ddisPermitidos, definirDdis,
    configBot, definirBot, liberarPv, desliberarPv,
    desembrulhar, classificar, inspecionar, avaliar, ehTrava, acharPalavra, normalizarPalavras,
    participantes, invalidarMeta, botEhAdmin, botEhAdminAgora, normalizarJid,
    aplicarGrupo, tratarCifrado, aplicarPv, tratarChamada, tratarEntrada, registrarEventos,
    painel, painelBot,
    _dados
};
