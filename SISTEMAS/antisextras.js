//antis extras
const baileys = require("@systemzero/baileys");
const { zoneGet } = require("../utils/zoneApi.js");
const { uploadToZone } = require("../utils/upload.js");
const config = require("../config.json");

const { downloadContentFromMessage } = baileys;
const RAW = Symbol.for("system-nejire.envio-original");
const CIPHERTEXT_STUB = baileys.proto?.WebMessageInfo?.StubType?.CIPHERTEXT ?? 2;

const delay = ms => new Promise(r => setTimeout(r, ms));

// ── ANTIPORN ─────────────────────────────────────────────
// o rigor acompanha a punição do grupo: apagar = só confia em 90%+, aviso = 75%+, banir = 50%+
const LIMIARES_PORN = { apagar: 0.90, aviso: 0.75, banir: 0.50 };
const MAX_MIDIA_BYTES = 25 * 1024 * 1024;

const MIDIA_PORN = {
    image: { chave: "imageMessage", tipo: "image", ext: "jpg" },
    video: { chave: "videoMessage", tipo: "video", ext: "mp4" },
    sticker: { chave: "stickerMessage", tipo: "sticker", ext: "webp" }
};

async function baixar(no, tipo) {
    const stream = await downloadContentFromMessage(no, tipo);
    const partes = [];
    let total = 0;
    for await (const chunk of stream) {
        total += chunk.length;
        if (total > MAX_MIDIA_BYTES) return null;
        partes.push(chunk);
    }
    return Buffer.concat(partes);
}

async function checarPorn(msg, tipoMidia, punicao) {
    const def = MIDIA_PORN[tipoMidia];
    const no = def && msg?.[def.chave];
    if (!no) return null;

    const limiar = LIMIARES_PORN[punicao] ?? LIMIARES_PORN.apagar;

    try {
        if (Number(no.fileLength) > MAX_MIDIA_BYTES) return null;

        const buffer = await baixar(no, def.tipo);
        if (!buffer?.length) return null;

        const up = await uploadToZone(buffer, { name: `nsfw_${Date.now()}`, ext: def.ext, temporary: true, expiresIn: 10 });
        if (!up.status) {
            if (up.erro) console.error("[antiporn] upload falhou:", up.erro);
            return null;
        }

        const resp = await zoneGet("nsfwcheck", { url: up.url });
        const r = resp.ok && resp.tipo === "json" ? resp.data : null;
        if (!r?.status || !r?.result) return null;

        const ehPorn = String(r.result.labelName || "").trim().toLowerCase() === "porn";
        const confidence = Number(r.result.confidence) || 0;

        return ehPorn && confidence >= limiar ? { confidence } : null;
    } catch (err) {
        console.error("[antiporn] erro na checagem:", err?.message || err);
        return null;
    }
}

// ── ANTISTATUSGP ─────────────────────────────────────────

const escutaAtivaStatus = new Map();
const TTL_ESCUTA_MS = 60 * 60 * 1000;

function podarEscuta() {
    const agora = Date.now();
    for (const [id, exp] of escutaAtivaStatus) if (exp <= agora) escutaAtivaStatus.delete(id);
}

function detectarStatus(info, sender) {
    const content = info?.message;
    if (!content) return null;

    podarEscuta();

    const msgType = Object.keys(content)[0];
    const msgStr = JSON.stringify(content);
    const statusId = info.key?.id;
    const autorStatus = info.key?.participant || info.key?.remoteJid || sender;
    const contextInfo = content?.[msgType]?.contextInfo || content?.extendedTextMessage?.contextInfo;

    const ehStatusDireto =
        msgType === "groupStatusMessageV2" ||
        msgType === "groupStatusMessage" ||
        !!content?.groupStatusMessageV2 ||
        msgStr.includes('"isGroupStatus":true');

    const citaStatus =
        !!contextInfo?.stanzaId &&
        !!(
            contextInfo.quotedMessage?.groupStatusMessageV2 ||
            contextInfo.quotedMessage?.groupStatusMessage ||
            contextInfo.groupStatusMentionMessage ||
            contextInfo.isGroupStatus ||
            (contextInfo.quotedMessage && JSON.stringify(contextInfo.quotedMessage).includes('"isGroupStatus":true'))
        );

    const reacaoAlvo = msgType === "reactionMessage" ? content.reactionMessage?.key?.id : null;
    const ehReacaoRastreada = !!reacaoAlvo && escutaAtivaStatus.has(reacaoAlvo);

    if (!ehStatusDireto && !citaStatus && !ehReacaoRastreada) return null;

    return { ehStatusDireto, citaStatus, ehReacaoRastreada, contextInfo, statusId, autorStatus };
}

async function apagarStatus(conn, from, det) {
    const { ehStatusDireto, citaStatus, ehReacaoRastreada, contextInfo, statusId, autorStatus } = det;

    if (ehStatusDireto && statusId) {
        await conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: statusId, participant: autorStatus } }).catch(() => {});
        return;
    }

    if (citaStatus) {
        await conn.sendMessage(from, {
            delete: { remoteJid: from, fromMe: false, id: contextInfo.stanzaId, participant: contextInfo.participant }
        }).catch(() => {});
        escutaAtivaStatus.set(contextInfo.stanzaId, Date.now() + TTL_ESCUTA_MS);
        return;
    }

    if (ehReacaoRastreada && statusId) {
        await conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: statusId, participant: autorStatus } }).catch(() => {});
    }
}

// ── ANTICANAL ────────────────────────────────────────────
const LINK_CANAL_REGEX = /https?:\/\/(?:www\.)?(?:whatsapp\.com\/channel|wa\.me\/channel)\/[0-9A-Za-z_-]+/i;

function contextInfoDe(msg) {
    if (!msg || typeof msg !== "object") return {};
    for (const v of Object.values(msg)) {
        if (v && typeof v === "object" && v.contextInfo) return v.contextInfo;
    }
    return {};
}

function detectarCanal(msg, texto) {
    if (LINK_CANAL_REGEX.test(String(texto || ""))) return true;
    return !!contextInfoDe(msg)?.forwardedNewsletterMessageInfo?.newsletterJid;
}

// ── ANTIBOT ──────────────────────────────────────────────
function detectarDispositivo(info) {
    const id = String(info?.key?.id || "");
    if (id.substring(0, 2) === "3A") return "ios";
    if (id.length > 21) return "android";
    return "web";
}

function detectarBot(info) {
    const id = String(info?.key?.id || "").toUpperCase();
    const participante = String(
        info?.key?.participantAlt || info?.participantAlt || info?.key?.participant || info?.participant || ""
    ).toLowerCase();
    const nome = String(info?.pushName || "").toLowerCase();

    return (
        info?.key?.fromMe === false &&
        (id.startsWith("BAE5") ||
            id.startsWith("3EB0") ||
            participante.includes("bot") ||
            /(^|[^a-z0-9])bot([^a-z0-9]|$)/i.test(nome) ||
            detectarDispositivo(info) === "web")
    );
}

// ── ANTIPAYMENT ──────────────────────────────────────────
const MAX_PAYMENT_SCAN_DEPTH = 8;

function podeVarrer(v) {
    return v && typeof v === "object" && !(v instanceof ArrayBuffer) && !ArrayBuffer.isView(v);
}

function varrerPagamento(valor, profundidade = 0, vistos = new WeakSet()) {
    if (!podeVarrer(valor) || profundidade > MAX_PAYMENT_SCAN_DEPTH || vistos.has(valor)) return false;
    vistos.add(valor);

    for (const [chave, filho] of Object.entries(valor)) {
        if (chave === "quotedMessage") continue;
        if (chave === "requestPaymentMessage" && podeVarrer(filho)) return true;
        if (varrerPagamento(filho, profundidade + 1, vistos)) return true;
    }
    return false;
}

function temPagamento(message) {
    return varrerPagamento(message);
}

function cru(conn) {
    return conn[RAW] || conn.sendMessage.bind(conn);
}

async function apagarPagamento(conn, from, key, settleMs = 250) {
    const id = key?.id;
    const participant = key?.participant;
    if (!id || !participant) throw new Error("não deu pra identificar a mensagem de pagamento");

    const enviar = cru(conn);

    try {
        const auxiliar = await enviar(from, { text: "" });
        const auxId = auxiliar?.key?.id;
        if (!auxId) throw new Error("falha ao gerar ID auxiliar");

        await enviar(from, {
            text: `${config.emojiPrincipal || "🩵"} mensagem de pagamento removida!`,
            edit: { remoteJid: from, fromMe: true, id: auxId }
        }, { messageId: id });

        await delay(settleMs);
        await enviar(from, { delete: { remoteJid: from, id, fromMe: false, participant } });
        await delay(settleMs);

        try {
            await enviar(from, { delete: { remoteJid: from, id: auxId, fromMe: true } });
        } catch {
            await enviar(from, { delete: { remoteJid: from, id: auxId, fromMe: false, participant: conn.user?.id } }).catch(() => {});
        }
    } catch (err) {
        console.error("[antipayment] edit+revoke falhou, tentando revoke normal:", err?.message || err);
        await conn.sendMessage(from, {
            delete: { remoteJid: key.remoteJid || from, fromMe: key.fromMe ?? false, id, participant }
        });
    }
}

const RECENTE_TTL_MS = 60 * 1000;
const REABRIR_APOS_MS = 8 * 1000;

const tratadosRecentes = new Map(); // `${from}:${sender}` -> expiraEm
const emAndamento = new Map();      // `${from}:${sender}` -> Promise<boolean>
const incidentes = new Map();       // from -> { fechar: Promise, fechado, timer }

async function passo(fn, msgErro) {
    try { await fn(); } catch (err) { console.error(`${msgErro} ${err?.message || err}`); }
}

async function limparChat(conn, from) {
    await cru(conn)(from, { text: `\u200e${"\n".repeat(400)}🧹 chat limpo nessa porra` });
}

function garantirIncidente(conn, from) {
    const existente = incidentes.get(from);
    if (existente) return existente;

    const inc = { fechado: false, timer: undefined };
    inc.fechar = (async () => {
        await passo(() => conn.groupSettingUpdate(from, "announcement"), "[antipayment] erro ao fechar o grupo:");
        inc.fechado = true;
        await passo(() => limparChat(conn, from), "[antipayment] erro ao limpar o chat:");
    })();

    incidentes.set(from, inc);
    return inc;
}

function agendarReabertura(conn, from) {
    const inc = incidentes.get(from);
    if (!inc) return;

    if (!inc.fechado) { incidentes.delete(from); return; }

    if (inc.timer) clearTimeout(inc.timer);
    inc.timer = setTimeout(() => {
        passo(() => conn.groupSettingUpdate(from, "not_announcement"), "[antipayment] erro ao reabrir o grupo:")
            .finally(() => { if (incidentes.get(from) === inc) incidentes.delete(from); });
    }, REABRIR_APOS_MS);
    inc.timer.unref?.();
}

async function executarDefesa(conn, from, sender) {
    const inc = garantirIncidente(conn, from);
    let removido = false;

    await Promise.all([
        inc.fechar,
        conn.groupParticipantsUpdate(from, [sender], "remove")
            .then(() => { removido = true; })
            .catch(err => console.error("[antipayment] erro ao banir:", err?.message || err))
    ]);

    agendarReabertura(conn, from);

    if (removido) tratadosRecentes.set(`${from}:${sender}`, Date.now() + RECENTE_TTL_MS);
    return removido;
}

function banirUmaVez(conn, from, sender) {
    const agora = Date.now();
    for (const [k, exp] of tratadosRecentes) if (exp <= agora) tratadosRecentes.delete(k);

    const chave = `${from}:${sender}`;
    if ((tratadosRecentes.get(chave) || 0) > agora) return Promise.resolve(true);

    const existente = emAndamento.get(chave);
    if (existente) return existente;

    const defesa = Promise.resolve().then(() => executarDefesa(conn, from, sender));
    emAndamento.set(chave, defesa);
    return defesa.finally(() => { if (emAndamento.get(chave) === defesa) emAndamento.delete(chave); });
}

async function aplicarDefesaPagamento({ conn, from, sender, messageKey }) {
    if (!from || !sender) return false;

    const apagar = messageKey
        ? passo(() => apagarPagamento(conn, from, messageKey), "[antipayment] erro ao apagar a mensagem de pagamento:")
        : Promise.resolve();

    const [, removido] = await Promise.all([apagar, banirUmaVez(conn, from, sender)]);
    return removido;
}

const JANELA_REPETICAO_MS = 2 * 60 * 1000;
const LIMITE_REPETICAO = 3;
const COOLDOWN_AVISO_MS = 5 * 60 * 1000;
const TRACKER_TTL_MS = 10 * 60 * 1000;

const tracker = new Map();
let ultimaLimpeza = Date.now();

function varrerTracker(agora) {
    if (agora - ultimaLimpeza < TRACKER_TTL_MS) return;
    ultimaLimpeza = agora;
    for (const [k, e] of tracker) if (agora - e.inicio > TRACKER_TTL_MS) tracker.delete(k);
}

function registrarFalha(chave, agora) {
    let e = tracker.get(chave);
    if (!e || agora - e.inicio > JANELA_REPETICAO_MS) e = { count: 0, inicio: agora, ultimoAviso: 0 };
    e.count += 1;
    tracker.set(chave, e);
    return e;
}

function classificarConfianca(info, repeticoes) {

    if (info?.stealthMeta?.decryptFail === "hide") return "alta";
    if (repeticoes >= LIMITE_REPETICAO) return "media";
    return null;
}

function analisarCifrado(info, from, sender) {
    const ehCifrada = info?.messageStubType === CIPHERTEXT_STUB;
    if (!ehCifrada && !info?.stealthMeta) return null;

    const agora = Date.now();
    varrerTracker(agora);

    const chave = `${from}|${sender}`;
    const entrada = registrarFalha(chave, agora);
    const confianca = classificarConfianca(info, entrada.count);
    if (!confianca) return null;

    return { confianca, entrada, chave, agora };
}

function avisoEmCooldown(entrada, agora) {
    return entrada.ultimoAviso && agora - entrada.ultimoAviso < COOLDOWN_AVISO_MS;
}

function marcarAviso(chave, entrada, agora) {
    entrada.ultimoAviso = agora;
    tracker.set(chave, entrada);
}

module.exports = {
    LIMIARES_PORN, MIDIA_PORN,
    checarPorn,
    detectarStatus, apagarStatus,
    detectarCanal, detectarBot,
    temPagamento, apagarPagamento, aplicarDefesaPagamento,
    analisarCifrado, avisoEmCooldown, marcarAviso
};
