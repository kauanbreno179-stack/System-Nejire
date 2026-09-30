// ── POSTAR STATUS DE GRUPO ───────────────────────────────
// Usa o MESMO formato que o antistatusgp detecta (groupStatusMessageV2),
// só que no sentido contrário: em vez de apagar, o bot posta.
// O anti não apaga o status do próprio bot (ele ignora fromMe, dono e admins).
const crypto = require("crypto");
const baileys = require("@systemzero/baileys");
const Antis = require("./antis.js");

const { generateWAMessageContent, generateWAMessageFromContent } = baileys;

const COMANDOS = new Set(["postarstatus", "poststatus", "statusgp", "pstatus"]);

// fundos (ARGB) pra status só de texto
const FUNDOS = [0xFF1B6CA8, 0xFF0A9396, 0xFF5E60CE, 0xFF7B2CBF, 0xFF3A86FF, 0xFF00509D, 0xFF2A9D8F];

const CHAVE_MIDIA = { image: "imageMessage", video: "videoMessage", audio: "audioMessage" };

function citada(info) {
    const ctx = info.message?.extendedTextMessage?.contextInfo
        || info.message?.imageMessage?.contextInfo
        || info.message?.videoMessage?.contextInfo;
    return ctx?.quotedMessage || null;
}

// procura imagem/vídeo/áudio na própria mensagem ou na mensagem respondida
function acharMidia(info) {
    const fontes = [
        Antis.desembrulhar(info.message).msg,
        citada(info) ? Antis.desembrulhar(citada(info)).msg : null
    ];
    for (const fonte of fontes) {
        for (const [tipo, chave] of Object.entries(CHAVE_MIDIA)) {
            if (fonte?.[chave]) return { tipo, msg: fonte[chave] };
        }
    }
    return null;
}

function textoDaResposta(info) {
    const m = citada(info) ? Antis.desembrulhar(citada(info)).msg : null;
    return m?.conversation || m?.extendedTextMessage?.text || m?.imageMessage?.caption || m?.videoMessage?.caption || "";
}

// monta o "conteúdo interno" do status
async function montarConteudo(conn, { midia, texto, getMediaBuffer }) {
    if (midia) {
        const buffer = await getMediaBuffer(midia.msg, midia.tipo);
        if (midia.tipo === "image") return { image: buffer, caption: texto || undefined };
        if (midia.tipo === "video") return { video: buffer, caption: texto || undefined };
        return { audio: buffer, mimetype: "audio/mp4", ptt: false };
    }
    return {
        extendedTextMessage: {
            text: texto,
            backgroundArgb: FUNDOS[Math.floor(Math.random() * FUNDOS.length)],
            textArgb: 0xFFFFFFFF,
            font: Math.floor(Math.random() * 5)
        }
    };
}

// posta o status no grupo
async function postar(conn, groupId, conteudo) {
    const segredo = crypto.randomBytes(32);

    const interno = conteudo.extendedTextMessage
        ? { extendedTextMessage: conteudo.extendedTextMessage }
        : await generateWAMessageContent(conteudo, { upload: conn.waUploadToServer });

    const msg = generateWAMessageFromContent(groupId, {
        messageContextInfo: { messageSecret: segredo },
        groupStatusMessageV2: {
            message: { ...interno, messageContextInfo: { messageSecret: segredo } }
        }
    }, { userJid: conn.user?.id });

    await conn.relayMessage(groupId, msg.message, { messageId: msg.key.id });
    return msg.key.id;
}

async function tratar(ctx) {
    const { conn, info, from, command, q, prefix, reply, reagir, getMediaBuffer, exigirGrupo, exigirAdmin } = ctx;
    if (!COMANDOS.has(command)) return false;

    if (!(await exigirGrupo())) return true;
    if (!(await exigirAdmin())) return true;

    const midia = acharMidia(info);
    let texto = String(q || "").trim();
    if (!texto && !midia) texto = textoDaResposta(info).trim();

    if (!midia && !texto) {
        await reply(
            `manda o que você quer postar como status do grupo 📢\n\n` +
            `▸ ${prefix}${command} seu texto aqui\n` +
            `▸ manda uma imagem/vídeo/áudio com legenda ${prefix}${command} legenda\n` +
            `▸ ou responde uma mídia/texto com ${prefix}${command}`
        );
        return true;
    }

    if (texto.length > 700) {
        await reply("o texto do status tá grande demais, deixa em até 700 caracteres!");
        return true;
    }

    await reagir("📢");

    try {
        const conteudo = await montarConteudo(conn, { midia, texto, getMediaBuffer });
        await postar(conn, from, conteudo);
        await reagir("✅");
    } catch (err) {
        console.error("[postarstatus] erro:", err);
        await reagir("❌");
        await reply("não consegui postar o status 😔 confere se eu sou admin e se o WhatsApp do bot já tem status de grupo liberado.");
    }
    return true;
}

module.exports = { tratar, postar, COMANDOS };
