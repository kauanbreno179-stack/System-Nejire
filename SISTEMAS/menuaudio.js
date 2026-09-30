// ── ÁUDIO DO MENU ────────────────────────────────────────
const fs = require("fs");
const path = require("path");
const db = require("../utils/db.js");
const Antis = require("./antis.js");

const PASTA_AUDIO = path.join(__dirname, "..", "menu", "audio");
const DB_PATH = path.join(__dirname, "..", "database", "menuaudio.json");
const LIMITE_BYTES = 16 * 1024 * 1024;

const COMANDOS = {
    definir: new Set(["definiraudiomenu", "setaudiomenu", "addaudiomenu"]),
    remover: new Set(["removeraudiomenu", "delaudiomenu", "rmaudiomenu"]),
    status: new Set(["audiomenu"]),
    testar: new Set(["testaraudiomenu", "testeaudiomenu"])
};
const TODOS = new Set([...COMANDOS.definir, ...COMANDOS.remover, ...COMANDOS.status, ...COMANDOS.testar]);

const PADRAO = () => ({
    ativo: true,
    arquivo: null,
    mimetype: null,
    ptt: false, 
    bytes: 0,
    atualizadoEm: 0
});

db.ensure(DB_PATH, PADRAO());

function ler() {
    return { ...PADRAO(), ...(db.read(DB_PATH, {}) || {}) };
}

function salvar(dados) {
    db.write(DB_PATH, dados);
}

function caminhoDoAudio(dados = ler()) {
    if (!dados.arquivo) return null;
    const p = path.join(PASTA_AUDIO, path.basename(dados.arquivo));
    return fs.existsSync(p) ? p : null;
}

function extensaoPorMimetype(mime = "") {
    const m = String(mime).toLowerCase();
    if (m.includes("ogg") || m.includes("opus")) return ".ogg";
    if (m.includes("mpeg") || m.includes("mp3")) return ".mp3";
    if (m.includes("wav")) return ".wav";
    if (m.includes("aac")) return ".aac";
    if (m.includes("mp4") || m.includes("m4a")) return ".m4a";
    return ".mp3";
}

function citada(info) {
    const m = info.message || {};
    const ctx = m.extendedTextMessage?.contextInfo
        || m.audioMessage?.contextInfo
        || m.imageMessage?.contextInfo
        || m.videoMessage?.contextInfo
        || m.documentMessage?.contextInfo;
    return ctx?.quotedMessage || null;
}

function acharAudio(info) {
    const fontes = [
        Antis.desembrulhar(info.message).msg,
        citada(info) ? Antis.desembrulhar(citada(info)).msg : null
    ];
    for (const fonte of fontes) {
        if (fonte?.audioMessage) return { msg: fonte.audioMessage, tipo: "audio", ptt: !!fonte.audioMessage.ptt };
        const doc = fonte?.documentMessage;
        if (doc && String(doc.mimetype || "").toLowerCase().startsWith("audio/")) {
            return { msg: doc, tipo: "document", ptt: false };
        }
    }
    return null;
}

// ── ENVIO ────────────────
let _cache = { caminho: null, mtime: 0, buffer: null };

function lerBuffer(caminho) {
    const mtime = fs.statSync(caminho).mtimeMs;
    if (_cache.caminho !== caminho || _cache.mtime !== mtime) {
        _cache = { caminho, mtime, buffer: fs.readFileSync(caminho) };
    }
    return _cache.buffer;
}

async function mandarAudio(conn, jid, info) {
    const dados = ler();
    const caminho = caminhoDoAudio(dados);
    if (!caminho) return false;

    const content = {
        audio: lerBuffer(caminho),
        mimetype: dados.mimetype || "audio/mpeg",
        ptt: !!dados.ptt
    };
    const opcoes = info ? { quoted: info } : {};

    if (typeof conn.nejireSend === "function") await conn.nejireSend(jid, content, opcoes);
    else await conn.sendMessage(jid, content, opcoes);
    return true;
}

async function enviarAposMenu(conn, jid, info) {
    try {
        const dados = ler();
        if (!dados.ativo || !dados.arquivo) return false;
        return await mandarAudio(conn, jid, info);
    } catch (err) {
        console.error("[menuaudio] não consegui mandar o áudio do menu:", err?.message || err);
        return false;
    }
}

// ── COMANDOS ─────────────────────────────────────────────
function tamanhoBonito(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function tratar(ctx) {
    const { conn, info, from, command, q, prefix, reply, reagir, getMediaBuffer, exigirDono } = ctx;
    if (!TODOS.has(command)) return false;
    if (!exigirDono()) return true;

    // ── definir ──
    if (COMANDOS.definir.has(command)) {
        const alvo = acharAudio(info);
        if (!alvo) {
            await reply(
                `marca o áudio que você quer no menu 🎧\n\n` +
                `▸ responde (marca) um áudio com ${prefix}${command}\n` +
                `▸ ou manda o áudio e coloca ${prefix}${command} na legenda (se for arquivo)\n\n` +
                `depois disso, toda vez que pedirem o menu o áudio vai junto.`
            );
            return true;
        }

        const declarado = Number(alvo.msg.fileLength?.low ?? alvo.msg.fileLength ?? 0);
        if (declarado > LIMITE_BYTES) {
            await reply(`esse áudio tem ${tamanhoBonito(declarado)}, é maior que o limite de 16 MB do WhatsApp. manda um menor!`);
            return true;
        }

        await reagir("🎧");
        try {
            const buffer = await getMediaBuffer(alvo.msg, alvo.tipo);
            if (!buffer?.length) throw new Error("áudio vazio");
            if (buffer.length > LIMITE_BYTES) {
                await reply(`esse áudio tem ${tamanhoBonito(buffer.length)}, é maior que o limite de 16 MB. manda um menor!`);
                return true;
            }

            const mimetype = alvo.msg.mimetype || "audio/mpeg";
            const nomeArquivo = `menu-audio${extensaoPorMimetype(mimetype)}`;

            fs.mkdirSync(PASTA_AUDIO, { recursive: true });
            for (const antigo of fs.readdirSync(PASTA_AUDIO)) {
                if (antigo.startsWith("menu-audio.")) fs.unlinkSync(path.join(PASTA_AUDIO, antigo));
            }
            fs.writeFileSync(path.join(PASTA_AUDIO, nomeArquivo), buffer);

            const dados = ler();
            salvar({
                ...dados,
                ativo: true,
                arquivo: nomeArquivo,
                mimetype,
                ptt: alvo.ptt,
                bytes: buffer.length,
                atualizadoEm: Date.now()
            });

            await reagir("✅");
            await reply(
                `✅ áudio do menu salvo! (${tamanhoBonito(buffer.length)})\n\n` +
                `agora toda vez que pedirem ${prefix}menu, o áudio vai junto.\n` +
                `▸ ${prefix}testaraudiomenu pra ouvir\n` +
                `▸ ${prefix}audiomenu off pra desligar`
            );
        } catch (err) {
            console.error("[menuaudio] erro ao salvar:", err);
            await reagir("❌");
            await reply("❌ não consegui salvar esse áudio agora, tenta mandar de novo.");
        }
        return true;
    }

    // ── remover ──
    if (COMANDOS.remover.has(command)) {
        const dados = ler();
        const caminho = caminhoDoAudio(dados);
        if (!dados.arquivo && !caminho) {
            await reply("ainda não tem nenhum áudio salvo no menu.");
            return true;
        }
        try { if (caminho) fs.unlinkSync(caminho); } catch {}
        salvar({ ...dados, arquivo: null, mimetype: null, ptt: false, bytes: 0, atualizadoEm: Date.now() });
        _cache = { caminho: null, mtime: 0, buffer: null };
        await reply("✅ áudio do menu removido. o menu volta a sair sem áudio.");
        return true;
    }

    // ── testar ──
    if (COMANDOS.testar.has(command)) {
        const ok = await mandarAudio(conn, from, info).catch(err => {
            console.error("[menuaudio] erro no teste:", err);
            return false;
        });
        if (!ok) await reply(`não tem áudio salvo (ou deu erro no envio). marca um áudio com ${prefix}definiraudiomenu!`);
        return true;
    }

    // ── status / on / off ──
    const dados = ler();
    const arg = String(q || "").trim().toLowerCase();

    if (["on", "ligar", "ativar", "1"].includes(arg)) {
        salvar({ ...dados, ativo: true });
        await reply(dados.arquivo
            ? "✅ áudio do menu ligado!"
            : `✅ ligado, mas ainda não tem áudio salvo. marca um áudio com ${prefix}definiraudiomenu!`);
        return true;
    }
    if (["off", "desligar", "desativar", "0"].includes(arg)) {
        salvar({ ...dados, ativo: false });
        await reply("✅ áudio do menu desligado (o arquivo continua salvo).");
        return true;
    }

    const temArquivo = !!caminhoDoAudio(dados);
    await reply(
        `🎧 *áudio do menu*\n\n` +
        `▸ status: ${dados.ativo ? "ligado ✅" : "desligado 💤"}\n` +
        `▸ áudio salvo: ${temArquivo ? `sim (${tamanhoBonito(dados.bytes)})` : "não"}\n\n` +
        `▸ ${prefix}definiraudiomenu — marca um áudio pra usar\n` +
        `▸ ${prefix}audiomenu on/off — liga ou desliga\n` +
        `▸ ${prefix}testaraudiomenu — manda o áudio pra testar\n` +
        `▸ ${prefix}removeraudiomenu — apaga o áudio`
    );
    return true;
}

module.exports = { tratar, enviarAposMenu, mandarAudio, COMANDOS: TODOS };
