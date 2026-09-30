const Antis = require("./antis.js");
const DonoExtra = require("./donoextra.js");
const Stick = require("./stickerlab.js");
const Downloader = require("./downloader.js");
const Midia = require("./midia.js");
const Pagina = require("./scrapers/pagina.js");
const ScrapersBase = require("./scrapers/base.js");
const Cubo = require("./cubo3d.js");
const Jid = require("../utils/jid.js");

// ── AJUDANTES ────────────────────────────────────────────
function ligarDesligar(txt) {
    const t = String(txt || "").toLowerCase();
    if (["on", "ligar", "ligado", "1", "sim", "ativar"].includes(t)) return true;
    if (["off", "desligar", "desligado", "0", "nao", "não", "desativar"].includes(t)) return false;
    return null;
}

function citada(info) {
    return info.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
}

const CHAVE_MIDIA = { image: "imageMessage", video: "videoMessage", sticker: "stickerMessage", audio: "audioMessage", document: "documentMessage" };

function midiaAlvo(info, tipos) {
    const propria = Antis.desembrulhar(info.message).msg;
    const resp = citada(info) ? Antis.desembrulhar(citada(info)).msg : null;

    for (const fonte of [propria, resp]) {
        for (const t of tipos) {
            if (fonte?.[CHAVE_MIDIA[t]]) return { tipo: t, msg: fonte[CHAVE_MIDIA[t]] };
        }
    }
    return null;
}

function textoDaResposta(info) {
    const m = citada(info) ? Antis.desembrulhar(citada(info)).msg : null;
    return m?.conversation || m?.extendedTextMessage?.text || m?.imageMessage?.caption || m?.videoMessage?.caption || "";
}

function pegarLink(ctx) {
    for (const fonte of [ctx.q, textoDaResposta(ctx.info)]) {
        const m = String(fonte || "").match(/https?:\/\/[^\s]+/i);
        if (m) return m[0];
    }
    return null;
}

function tirarPrefixo(txt, prefix) {
    const t = String(txt || "").toLowerCase();
    return t.startsWith(prefix) ? t.slice(prefix.length) : t;
}

function mb(bytes) {
    return (bytes / 1048576).toFixed(1);
}

// ── ANTIS ────────────────────────────────────────────────
async function comandoAntis(ctx) {
    const { from, args, prefix, reply, exigirGrupo, exigirAdmin } = ctx;
    if (!(await exigirGrupo())) return;

    const sub = (args[0] || "").toLowerCase();
    if (!sub) { await reply(Antis.painel(from, prefix)); return; }

    if (!(await exigirAdmin())) return;

    if (sub === "todos") {
        const v = ligarDesligar(args[1]);
        if (v === null) { await reply(`usa: ${prefix}antis todos on  ou  ${prefix}antis todos off`); return; }
        const total = Antis.definirTodos(from, v);
        await reply(`🛡️ ${total} antis do grupo agora estão *${v ? "ligados" : "desligados"}*${v ? "\n\nlembra: eu preciso ser admin pra apagar as mensagens!" : ""}`);
        return;
    }

    if (sub === "punicao" || sub === "punição") {
        const p = (args[1] || "").toLowerCase();
        if (!Antis.definirPunicao(from, p)) {
            await reply(`usa: ${prefix}antis punicao apagar | aviso | banir\n\n▸ apagar: só apaga a mensagem\n▸ aviso: apaga e dá um aviso (3 avisos = remove)\n▸ banir: apaga e remove na hora`);
            return;
        }
        await reply(`⚖️ punição dos antis agora é *${p}*`);
        return;
    }

    await reply(`não entendi 🤔 usa ${prefix}antis (painel), ${prefix}antis todos on/off ou ${prefix}antis punicao apagar/aviso/banir`);
}

async function comandoAntiGrupo(ctx, nome) {
    const { conn, from, args, prefix, reply, reagir, exigirGrupo, exigirAdmin, emojiAzul } = ctx;
    if (!(await exigirGrupo())) return;
    if (!(await exigirAdmin())) return;

    const def = Antis.CATALOGO[nome];
    const sub = (args[0] || "").toLowerCase();

    // sub-comandos do antipalavra
    if (nome === "antipalavra" && ["add", "adicionar", "del", "remover", "lista", "limpar"].includes(sub)) {
        if (sub === "lista") {
            const l = Antis.listaPalavras(from);
            await reply(l.length ? `🤬 palavras proibidas (${l.length}):\n${l.map(p => `▸ ${p}`).join("\n")}` : `ainda não tem palavra proibida. usa ${prefix}antipalavra add <palavra>`);
            return;
        }
        if (sub === "limpar") { await reply(`🧹 removi ${Antis.limparPalavras(from)} palavra(s) da lista`); return; }

        const palavra = args.slice(1).join(" ");
        if (!palavra.trim()) { await reply(`manda a palavra! Ex: ${prefix}antipalavra ${sub} idiota`); return; }

        if (sub === "add" || sub === "adicionar") {
            const r = Antis.addPalavra(from, palavra);
            await reply(r.ok ? `✅ *${palavra.trim().toLowerCase()}* entrou na lista${Antis.ativo(from, nome) ? "" : `\n\nlembra de ligar com ${prefix}antipalavra on`}` : `❌ ${r.motivo}`);
        } else {
            await reply(Antis.delPalavra(from, palavra) ? `✅ tirei *${palavra.trim().toLowerCase()}* da lista` : "❌ essa palavra não tava na lista");
        }
        return;
    }

    if (nome === "antifake" && ["ddi", "ddis"].includes(sub)) {
        const lista = Antis.definirDdis(from, args.slice(1).join(" ").split(/[ ,]+/));
        if (!lista) { await reply(`manda os ddis permitidos! Ex: ${prefix}antifake ddi 55 351`); return; }
        await reply(`🌍 antifake agora só aceita números que começam com: *${lista.join(", ")}*`);
        return;
    }

    const v = ligarDesligar(sub);
    if (v === null) {
        const extra = nome === "antipalavra"
            ? `\n${prefix}antipalavra add/del <palavra> • ${prefix}antipalavra lista`
            : nome === "antifake" ? `\n${prefix}antifake ddi 55 351 (ddis permitidos)` : "";
        await reply(`${def.emoji} *${prefix}${nome}* — ${def.desc}\n\nstatus: *${Antis.ativo(from, nome) ? "ligado ✅" : "desligado"}*\nusa: ${prefix}${nome} on  ou  ${prefix}${nome} off${extra}`);
        return;
    }

    Antis.definir(from, nome, v);
    await reagir(emojiAzul());

    let aviso = "";
    if (v && !(await Antis.botEhAdminAgora(conn, from))) aviso = "\n\n⚠️ eu ainda não sou admin aqui — me promove pra eu conseguir apagar as mensagens!";
    if (v && nome === "antipalavra" && !Antis.listaPalavras(from).length) aviso += `\n\nnenhuma palavra cadastrada ainda: ${prefix}antipalavra add <palavra>`;

    await reply(`${def.emoji} *${prefix}${nome}* agora tá *${v ? "ligado" : "desligado"}* — ${def.desc}${aviso}`);
}

async function comandoAntiPv(ctx) {
    const { info, sender, args, q, prefix, reply, exigirDono } = ctx;
    if (!exigirDono()) return;

    const sub = (args[0] || "").toLowerCase();

    if (!sub) {
        await reply(`${Antis.painelBot(prefix)}\n\nusa: ${prefix}antipv on | off | bloquear | aviso on/off | liberar <número> | desliberar <número> | lista\n\n▸ on: ignora quem chama no privado\n▸ bloquear: ignora e bloqueia no whatsapp`);
        return;
    }

    if (sub === "on" || sub === "ignorar") { Antis.definirBot("antipv", { ativo: true, modo: "ignorar" }); await reply("📵 antipv *ligado* — vou ignorar quem me chamar no privado (o dono e os liberados passam)"); return; }
    if (sub === "bloquear") { Antis.definirBot("antipv", { ativo: true, modo: "bloquear" }); await reply("📵 antipv *ligado em modo bloquear* — quem me chamar no privado é bloqueado (o dono e os liberados passam)"); return; }
    if (sub === "off") { Antis.definirBot("antipv", { ativo: false }); await reply("✅ antipv *desligado* — o privado voltou ao normal"); return; }

    if (sub === "aviso") {
        const v = ligarDesligar(args[1]);
        if (v === null) { await reply(`usa: ${prefix}antipv aviso on  ou  ${prefix}antipv aviso off`); return; }
        Antis.definirBot("antipv", { aviso: v });
        await reply(`✅ aviso automático do antipv agora tá *${v ? "ligado" : "desligado"}*`);
        return;
    }

    if (sub === "lista") {
        const l = Antis.configBot("antipv").liberados;
        await reply(l.length ? `📵 liberados no privado (${l.length}):\n${l.map(n => `▸ ${n}`).join("\n")}` : "ninguém liberado ainda (só o dono passa)");
        return;
    }

    if (sub === "liberar" || sub === "desliberar") {
        const alvo = Jid.resolverAlvo({ info, args: args.slice(1), q: args.slice(1).join(" "), sender });
        if (!alvo) { await reply(`marca, responde ou manda o número! Ex: ${prefix}antipv ${sub} 5511999999999`); return; }
        if (sub === "liberar") { Antis.liberarPv(alvo); await reply(`✅ ${Jid.numero(alvo)} liberado(a) pra falar comigo no privado`); }
        else await reply(Antis.desliberarPv(alvo) ? `✅ ${Jid.numero(alvo)} não tá mais liberado(a)` : "❌ essa pessoa não estava na lista");
        return;
    }

    await reply(`não entendi 🤔 manda só ${prefix}antipv pra ver as opções`);
}

async function comandoAntiCall(ctx) {
    const { args, prefix, reply, exigirDono } = ctx;
    if (!exigirDono()) return;

    const sub = (args[0] || "").toLowerCase();

    if (!sub) {
        await reply(`${Antis.painelBot(prefix)}\n\nusa: ${prefix}anticall on | off | bloquear | aviso on/off\n\n▸ on: recusa a ligação (e manda um aviso)\n▸ bloquear: recusa e bloqueia quem ligou`);
        return;
    }

    if (sub === "on" || sub === "rejeitar") { Antis.definirBot("anticall", { ativo: true, modo: "rejeitar" }); await reply("📞 anticall *ligado* — recuso toda ligação que receber"); return; }
    if (sub === "bloquear") { Antis.definirBot("anticall", { ativo: true, modo: "bloquear" }); await reply("📞 anticall *ligado em modo bloquear* — recuso e bloqueio quem ligar"); return; }
    if (sub === "off") { Antis.definirBot("anticall", { ativo: false }); await reply("✅ anticall *desligado* — não recuso mais as ligações"); return; }

    if (sub === "aviso") {
        const v = ligarDesligar(args[1]);
        if (v === null) { await reply(`usa: ${prefix}anticall aviso on  ou  ${prefix}anticall aviso off`); return; }
        Antis.definirBot("anticall", { aviso: v });
        await reply(`✅ aviso automático do anticall agora tá *${v ? "ligado" : "desligado"}*`);
        return;
    }

    await reply(`não entendi 🤔 manda só ${prefix}anticall pra ver as opções`);
}

// ── FIGURINHAS ───────────────────────────────────────────
async function gerarFigurinha(ctx, { modo = "padrao", efeito = null, cor = "white" } = {}) {
    const { conn, info, from, config, prefix, command, reply, reagir, enviar, getMediaBuffer } = ctx;

    const alvo = midiaAlvo(info, ["image", "video", "sticker"]);
    if (!alvo) { await reply(`manda ou responde uma imagem/vídeo com ${prefix}${command}!`); return; }

    await reagir("🩵");

    try {
        const buffer = await getMediaBuffer(alvo.msg, alvo.tipo);
        const webp = await Stick.criar(buffer, { video: alvo.tipo === "video", modo, efeito, cor }, config.figurinha);
        await enviar(conn, from, { sticker: webp }, { quoted: info });
    } catch (err) {
        console.error("[figurinha]", err);
        await reply("ah não, deu erro pra fazer essa figurinha :(");
    }
}

async function comandoSfx(ctx) {
    const { args, prefix, reply } = ctx;
    const efeito = (args[0] || "").toLowerCase();

    if (!efeito || efeito === "lista" || !Stick.EFEITOS[efeito]) {
        const ef = Object.entries(Stick.EFEITOS).map(([n, e]) => `▸ ${n} — ${e.desc}`).join("\n");
        await reply(`🎨 *efeitos de figurinha*\n\n${ef}\n\nusa: responde uma imagem/vídeo com ${prefix}sfx <efeito> [modo]\nmodos: ${Stick.MODOS.join(", ")}\nEx: ${prefix}sfx pb circulo`);
        return;
    }

    const modo = (args[1] || "padrao").toLowerCase();
    if (!Stick.MODOS.includes(modo)) { await reply(`modo inválido! use: ${Stick.MODOS.join(", ")}`); return; }

    await gerarFigurinha(ctx, { modo, efeito });
}

async function comandoSfxLista(ctx) {
    await comandoSfx({ ...ctx, args: [] });
}

async function comandoSborda(ctx) {
    const { args, reply } = ctx;
    const cor = Stick.parseCor(args[0], "white");
    if (cor === null) { await reply(`não conheço essa cor 🤔 use: ${Object.keys(Stick.CORES).join(", ")} ou um hex tipo #ff0088`); return; }
    await gerarFigurinha(ctx, { modo: "borda", cor });
}

async function comandoTake(ctx) {
    const { conn, info, from, sender, q, config, prefix, reply, reagir, enviar, getMediaBuffer } = ctx;

    const alvo = midiaAlvo(info, ["sticker"]);
    if (!alvo) { await reply(`responde uma figurinha com ${prefix}take nome do pack | autor`); return; }

    const [packTxt, autorTxt] = q.split("|").map(s => s.trim());
    const meta = {
        packname: packTxt || config.figurinha?.packname || "",
        author: autorTxt || info.pushName || Jid.numero(sender)
    };

    try {
        await reagir("🩵");
        const buffer = await getMediaBuffer(alvo.msg, "sticker");
        const novo = await Stick.trocarPackAutor(buffer, meta);
        await enviar(conn, from, { sticker: novo }, { quoted: info });
    } catch (err) {
        console.error("[take]", err);
        await reply("não consegui trocar o pack dessa figurinha :(");
    }
}

async function comandoSinfo(ctx) {
    const { info, prefix, reply, getMediaBuffer } = ctx;
    const alvo = midiaAlvo(info, ["sticker"]);
    if (!alvo) { await reply(`responde uma figurinha com ${prefix}sinfo!`); return; }

    try {
        const i = Stick.infoSticker(await getMediaBuffer(alvo.msg, "sticker"));
        await reply(`🗣️ *info da figurinha*\n\n📦 pack: ${i.pack || "—"}\n✍️ autor: ${i.autor || "—"}\n🎞️ animada: ${i.animada ? "sim" : "não"}\n😀 emojis: ${i.emojis.join(" ") || "—"}\n💾 tamanho: ${i.kb}kb`);
    } catch (err) {
        console.error("[sinfo]", err);
        await reply("não consegui ler essa figurinha :(");
    }
}

async function comandoTovid(ctx) {
    const { conn, info, from, prefix, reply, reagir, enviar, getMediaBuffer } = ctx;
    const alvo = midiaAlvo(info, ["sticker"]);
    if (!alvo) { await reply(`responde uma figurinha animada com ${prefix}tovid!`); return; }

    try {
        await reagir("🎞️");
        const buffer = await getMediaBuffer(alvo.msg, "sticker");
        if (!Stick.ehWebpAnimado(buffer)) { await reply(`essa figurinha não é animada 🤔 pra figurinha parada usa ${prefix}toimg`); return; }

        const mp4 = await Stick.webpAnimadoParaVideo(buffer);
        await enviar(conn, from, { video: mp4, caption: "prontinho! 🩵", gifPlayback: true }, { quoted: info });
    } catch (err) {
        console.error("[tovid]", err);
        await reply("não consegui converter essa figurinha em vídeo :(");
    }
}

async function comandoSemoji(ctx) {
    const { conn, info, from, q, config, prefix, reply, reagir, enviar } = ctx;
    const emoji = Stick.extrairPrimeiroEmoji(q);
    if (!emoji) { await reply(`manda um emoji! Ex: ${prefix}semoji 😎`); return; }

    try {
        await reagir("🩵");
        const img = await Stick.baixarImagemEmoji(emoji);
        if (!img) { await reply("não achei a imagem desse emoji :( tenta outro"); return; }

        const webp = await Stick.criar(img, { modo: "padrao" }, { ...config.figurinha, emojis: [emoji] });
        await enviar(conn, from, { sticker: webp }, { quoted: info });
    } catch (err) {
        console.error("[semoji]", err);
        await reply("não consegui fazer a figurinha desse emoji :(");
    }
}

// ── DOWNLOADS / SCRAPERS ─────────────────────────────────
async function comandoBaixar(ctx, { audio = false } = {}) {
    const { conn, info, from, prefix, command, reply, reagir, enviar } = ctx;

    const link = pegarLink(ctx);
    if (!link) {
        await reply(audio
            ? `manda o link! Ex: ${prefix}${command} https://vm.tiktok.com/xxxx\n\npra buscar por nome usa ${prefix}play nome da música`
            : `manda (ou responde) um link! Ex: ${prefix}${command} https://vm.tiktok.com/xxxx\n\nfunciona com tiktok, links diretos (.mp4 .mp3 .jpg .pdf...), páginas com vídeo/áudio e mais (veja ${prefix}scrapers)`);
        return;
    }

    await reagir(audio ? "🎧" : "⏳");

    const r = await Downloader.preparar(link, { audio });
    if (!r.ok) { await reply(`não consegui baixar :( ${r.erro ? `\n\n${r.erro.slice(0, 300)}` : ""}`); return; }

    const legenda = (r.titulo || "").slice(0, 300);

    for (let i = 0; i < r.itens.length; i++) {
        const item = r.itens[i];
        try {
            await enviar(conn, from, Downloader.paraMensagem(item, i === 0 ? legenda : ""), { quoted: info });
        } catch (err) {
            console.error("[baixar] erro ao enviar:", err?.message || err);
            await reply(`baixei, mas o whatsapp recusou o envio (${mb(item.buffer.length)}mb) :(`);
            return;
        }
    }
    await reagir("✅");
}

async function comandoConverterAudio(ctx, paraPtt) {
    const { conn, info, from, prefix, command, reply, reagir, enviar, getMediaBuffer } = ctx;

    const alvo = midiaAlvo(info, ["audio", "video"]);
    if (!alvo) { await reply(`responde um áudio ou vídeo com ${prefix}${command}!`); return; }

    try {
        await reagir("🎧");
        const buffer = await getMediaBuffer(alvo.msg, alvo.tipo);

        if (paraPtt) {
            const ogg = await Midia.paraPtt(buffer);
            await enviar(conn, from, { audio: ogg, mimetype: "audio/ogg; codecs=opus", ptt: true }, { quoted: info });
        } else {
            const mp3 = await Midia.paraMp3(buffer);
            await enviar(conn, from, { audio: mp3, mimetype: "audio/mpeg", fileName: "audio.mp3" }, { quoted: info });
        }
    } catch (err) {
        console.error("[conversao audio]", err);
        await reply("não consegui converter esse áudio :(");
    }
}

async function comandoLinkinfo(ctx) {
    const { conn, info, from, prefix, reply, reagir, enviar } = ctx;
    const link = pegarLink(ctx);
    if (!link) { await reply(`manda o link! Ex: ${prefix}linkinfo https://exemplo.com`); return; }

    try {
        await reagir("🔎");
        const p = await Pagina.analisar(link);

        const texto = [
            `🔎 *${p.titulo || "sem título"}*`,
            p.site ? `🌐 ${p.site}` : null,
            p.descricao ? `\n${p.descricao.slice(0, 350)}` : null,
            `\n🎬 vídeos: ${p.videos.length} • 🎵 áudios: ${p.audios.length} • 🖼️ imagens: ${p.imagens.length} • 📎 arquivos: ${p.documentos.length}`,
            `🔗 ${p.url}`
        ].filter(Boolean).join("\n");

        if (p.imagem) {
            try {
                const img = await ScrapersBase.baixarBuffer(p.imagem, { maxBytes: 8 * 1048576, timeoutMs: 20000 });
                await enviar(conn, from, { image: img.buffer, caption: texto }, { quoted: info });
                return;
            } catch {}
        }
        await reply(texto);
    } catch (err) {
        await reply(`não consegui abrir esse link :( ${err.message}`);
    }
}

async function comandoMidiaSite(ctx) {
    const { prefix, reply, reagir } = ctx;
    const link = pegarLink(ctx);
    if (!link) { await reply(`manda o link! Ex: ${prefix}midiasite https://exemplo.com/pagina`); return; }

    try {
        await reagir("🔎");
        const p = await Pagina.analisar(link);
        const lista = (titulo, itens, max = 4) => itens.length ? `\n${titulo} (${itens.length}):\n${itens.slice(0, max).map(u => `▸ ${u}`).join("\n")}` : "";

        const texto = `🔎 *mídias em ${p.titulo || p.url}*${lista("🎬 vídeos", p.videos)}${lista("🎵 áudios", p.audios)}${lista("📎 arquivos", p.documentos)}\n\n🖼️ imagens: ${p.imagens.length} (use ${prefix}imgsite pra receber)`;
        await reply(p.videos.length || p.audios.length || p.documentos.length || p.imagens.length ? texto : "não achei nenhuma mídia nessa página :(");
    } catch (err) {
        await reply(`não consegui abrir esse link :( ${err.message}`);
    }
}

async function comandoImgSite(ctx) {
    const { conn, info, from, prefix, reply, reagir, enviar } = ctx;
    const link = pegarLink(ctx);
    if (!link) { await reply(`manda o link! Ex: ${prefix}imgsite https://exemplo.com/pagina`); return; }

    try {
        await reagir("🖼️");
        const p = await Pagina.analisar(link);
        if (!p.imagens.length) { await reply("não achei imagens nessa página :("); return; }

        let enviadas = 0;
        for (const url of p.imagens) {
            if (enviadas >= 4) break;
            try {
                const img = await ScrapersBase.baixarBuffer(url, { maxBytes: 8 * 1048576, timeoutMs: 20000 });
                if (!img.mime.startsWith("image/") || img.buffer.length < 8000) continue; // pula ícone/pixel de rastreio
                await enviar(conn, from, { image: img.buffer, caption: enviadas === 0 ? (p.titulo || "").slice(0, 200) : "" }, { quoted: info });
                enviadas++;
            } catch {}
        }
        if (!enviadas) await reply("achei imagens, mas nenhuma deu pra baixar :(");
    } catch (err) {
        await reply(`não consegui abrir esse link :( ${err.message}`);
    }
}

async function comandoScrapers(ctx) {
    const { prefix, reply } = ctx;
    const mods = Downloader.Scrapers.listar();
    const linhas = mods.map(m => `${m.ativo ? "✅" : "▫️"} *${m.nome}* — ${m.descricao}${m.ativo ? "" : " (desligado)"}`);
    await reply(`🏊 *módulos de download*\n\n${linhas.join("\n")}\n\nusa: ${prefix}baixar <link> • ${prefix}mp3 <link>\no primeiro módulo que reconhece o link tenta; se falhar, cai pro próximo.`);
}

// ── CUBO 3D ──────────────────────────────────────────────
const _cooldownCubo = new Map();
const COOLDOWN_CUBO_MS = 20000;

async function comandoCubo(ctx, { fixo = {}, formato = "mp4", gif = false, exigeFoto = false } = {}) {
    const { conn, info, from, sender, isDono, args, prefix, command, config, reply, reagir, enviar, getMediaBuffer } = ctx;

    const { opc, desconhecidos } = Cubo.interpretarArgs(args);
    const opcoes = { ...opc, ...fixo, formato };

    if (exigeFoto || opcoes.estilo === "foto") {
        const alvo = midiaAlvo(info, ["image", "sticker"]);
        if (!alvo) { await reply(`manda ou responde uma imagem com ${prefix}${command}!\n\ntambém dá pra combinar: ${prefix}${command} iso claro`); return; }
        opcoes.foto = await getMediaBuffer(alvo.msg, alvo.tipo);
        opcoes.estilo = "foto";
    }

    if (!isDono) {
        const resta = COOLDOWN_CUBO_MS - (Date.now() - (_cooldownCubo.get(sender) || 0));
        if (resta > 0) { await reply(`⏳ calma! espera mais ${Math.ceil(resta / 1000)}s pra pedir outro cubo`); return; }
        _cooldownCubo.set(sender, Date.now());
    }

    await reagir("🧊");
    if (desconhecidos.length) await reply(`não entendi: ${desconhecidos.join(", ")} — vou ignorar. veja as opções em ${prefix}cubo3dlista`);
    await reply("⏳ desenhando o seu cubo 3d... isso leva uns segundinhos");

    try {
        const r = await Cubo.renderizar(opcoes);
        const legenda = `🧊 cubo 3d • ${r.info.estilo}${r.info.dado ? ` (${r.info.dado})` : ""} • ${r.info.animacao}`;

        if (formato === "sticker") {
            const webp = await Stick.aplicarExif(r.buffer, config.figurinha || {});
            await enviar(conn, from, { sticker: webp }, { quoted: info });
        } else {
            await enviar(conn, from, { video: r.buffer, caption: legenda, mimetype: "video/mp4", gifPlayback: gif }, { quoted: info });
        }
        await reagir("✅");
    } catch (err) {
        console.error("[cubo3d]", err);
        _cooldownCubo.delete(sender);
        await reply(`❌ não consegui fazer o cubo: ${String(err.message).slice(0, 200)}`);
    }
}

async function comandoCuboLista(ctx) {
    const { prefix, reply } = ctx;
    const estilos = Cubo.listarEstilos().map(e => `▸ ${e.nome} — ${e.desc}`).join("\n");
    const anims = Cubo.listarAnimacoes().map(a => `▸ ${a.nome} — ${a.desc}`).join("\n");
    const cores = Object.keys(Cubo.CORES_PT).join(", ");

    await reply([
        "🧊 *cubo 3d*",
        "",
        "*estilos*", estilos,
        "",
        "*animações*", anims,
        "",
        `*cores:* ${cores} ou hex (#ff8800)`,
        "*fundo:* escuro, claro, preto, transparente (transparente só em figurinha)",
        "*câmera:* perspectiva, orto, iso",
        "*extras:* hd (maior), rapido, lento",
        "",
        "*comandos*",
        `▸ ${prefix}cubo3d neon azul iso — vídeo`,
        `▸ ${prefix}cubo3dgif vidro pulsar — vídeo em loop (gif)`,
        `▸ ${prefix}cubofoto — responde uma imagem: ela vira as faces`,
        `▸ ${prefix}cubosticker rubik — figurinha animada`,
        `▸ ${prefix}cuborubik — cubo mágico girando as camadas`,
        `▸ ${prefix}cubodado 4 — dado que rola e para no número`
    ].join("\n"));
}

// ── DONO ─────────────────────────────────────────────────
function exigirPrincipal(ctx) {
    if (Jid.ehDonoPrincipal(ctx.sender)) return true;
    ctx.reply("esse comando é só do dono principal (mexe em dados sensíveis)!");
    return false;
}

async function comandoBackup(ctx) {
    const { conn, reply, reagir, enviar } = ctx;
    if (!exigirPrincipal(ctx)) return;

    try {
        await reagir("💾");
        const { buffer, nome } = DonoExtra.gerarBackup();
        // sempre no PV do dono principal, mesmo se o comando foi usado num grupo:
        // o backup tem a config (chaves de api) e os dados dos usuários
        await enviar(conn, DonoExtra.jidDoDono(), { document: buffer, mimetype: "application/zip", fileName: nome, caption: "💾 backup da nejire (database + config)" });
        await reply(`✅ backup de ${mb(buffer.length)}mb enviado no seu privado!\n\n(a pasta sessions/ nunca entra no backup, por segurança)`);
    } catch (err) {
        console.error("[backup]", err);
        await reply("❌ não consegui gerar o backup: " + String(err.message).slice(0, 150));
    }
}

async function comandoAutobackup(ctx) {
    const { args, prefix, reply } = ctx;
    if (!exigirPrincipal(ctx)) return;

    const arg = (args[0] || "").toLowerCase();
    if (!arg) {
        const c = DonoExtra.autobackupConfig();
        await reply(`💾 backup automático: *${c.horas ? `a cada ${c.horas}h` : "desligado"}*\n\nusa: ${prefix}autobackup 12  (a cada 12 horas) ou ${prefix}autobackup off`);
        return;
    }
    if (arg === "off") { DonoExtra.definirAutobackup(0); await reply("✅ backup automático *desligado*"); return; }

    const h = parseInt(arg, 10);
    if (!h || h < 1 || h > 720) { await reply(`manda as horas (1 a 720) ou off! Ex: ${prefix}autobackup 12`); return; }
    DonoExtra.definirAutobackup(h);
    await reply(`✅ vou mandar o backup no seu privado *a cada ${h}h* (a primeira vez daqui a ${h}h)`);
}

async function comandoDonos(ctx) {
    const { config, prefix, reply } = ctx;
    const extras = DonoExtra.listarDonos();
    await reply(`👑 *donos da nejire*\n\n▸ principal: ${config.numeroDono}\n${extras.length ? extras.map(n => `▸ co-dono: ${n}`).join("\n") : "▸ nenhum co-dono"}\n\n${prefix}adddono <número> • ${prefix}deldono <número> (só o principal)`);
}

async function comandoAddDono(ctx, remover) {
    const { info, sender, args, prefix, command, reply } = ctx;
    if (!exigirPrincipal(ctx)) return;

    const alvo = Jid.resolverAlvo({ info, args, q: args.join(" "), sender });
    if (!alvo) { await reply(`marca, responde ou manda o número (com DDI)! Ex: ${prefix}${command} 5511999999999`); return; }

    if (remover) {
        await reply(DonoExtra.delDono(alvo) ? `✅ ${Jid.numero(alvo)} não é mais co-dono(a)` : "❌ essa pessoa não é co-dona");
    } else {
        const r = DonoExtra.addDono(alvo);
        await reply(r.ok ? `✅ ${r.numero} agora é *co-dono(a)* — pode usar os comandos de dono (menos backup, autobackup, adddono e deldono)` : `❌ ${r.motivo}`);
    }
}

async function comandoCmdOff(ctx) {
    const { args, prefix, reply, todosComandos } = ctx;
    if (!ctx.exigirDono()) return;

    const nome = tirarPrefixo(args[0], prefix);
    if (!nome || !/^[a-z0-9_-]{1,30}$/.test(nome)) { await reply(`diz qual comando! Ex: ${prefix}cmdoff play`); return; }

    const r = DonoExtra.desativarComando(nome);
    if (!r.ok) { await reply(`❌ ${r.motivo}`); return; }

    const conhecido = todosComandos().includes(nome);
    await reply(`🔒 o comando *${prefix}${nome}* foi desligado pra todo mundo (o dono ainda usa)${conhecido ? "" : "\n\n⚠️ esse nome não tá no menu — se você digitou errado, use " + prefix + "cmdon pra desfazer"}`);
}

async function comandoCmdOn(ctx) {
    const { args, prefix, reply } = ctx;
    if (!ctx.exigirDono()) return;

    const nome = tirarPrefixo(args[0], prefix);
    if (!nome) { await reply(`diz qual comando! Ex: ${prefix}cmdon play`); return; }
    await reply(DonoExtra.ativarComando(nome) ? `🔓 o comando *${prefix}${nome}* foi religado` : "❌ esse comando não estava desligado");
}

async function comandoCmdsOff(ctx) {
    const { prefix, reply } = ctx;
    if (!ctx.exigirDono()) return;
    const l = DonoExtra.comandosDesativados();
    await reply(l.length ? `🔒 comandos desligados (${l.length}):\n${l.map(c => `▸ ${prefix}${c}`).join("\n")}\n\nreligar: ${prefix}cmdon <comando>` : "🔓 nenhum comando desligado no momento");
}

async function comandoErros(ctx) {
    const { args, reply } = ctx;
    if (!ctx.exigirDono()) return;

    const n = Math.max(1, Math.min(15, parseInt(args[0], 10) || 5));
    const lista = DonoExtra.ultimosErros(n);
    if (!lista.length) { await reply("✅ nenhum erro registrado desde que a bot ligou!"); return; }

    const hora = t => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const texto = lista.map((e, i) => `*${i + 1}.* [${hora(e.t)}]\n${e.texto.slice(0, 260)}`).join("\n\n");
    await reply(`🐞 *últimos ${lista.length} erro(s)* (de ${DonoExtra.totalErros()})\n\n${texto}`);
}

async function comandoLimparErros(ctx) {
    if (!ctx.exigirDono()) return;
    await ctx.reply(`✅ ${DonoExtra.limparErros()} erro(s) apagado(s) da lista`);
}

async function comandoTopComandos(ctx) {
    const { args, prefix, reply } = ctx;
    if (!ctx.exigirDono()) return;

    if ((args[0] || "").toLowerCase() === "zerar") { DonoExtra.zerarUso(); await reply("✅ ranking de comandos zerado"); return; }

    const n = parseInt(args[0], 10) || 10;
    const { total, lista } = DonoExtra.topComandos(n);
    if (!lista.length) { await reply("ainda não tenho uso registrado 🐚"); return; }

    const medalhas = ["🥇", "🥈", "🥉"];
    await reply(`📊 *comandos mais usados* (${total} no total)\n\n${lista.map(([c, v], i) => `${medalhas[i] || `${i + 1}.`} ${prefix}${c} — ${v}x`).join("\n")}\n\n${prefix}topcomandos zerar pra recomeçar`);
}

async function comandoEntrar(ctx) {
    const { conn, q, prefix, reply, reagir } = ctx;
    if (!ctx.exigirDono()) return;

    const codigo = DonoExtra.codigoConvite(q);
    if (!codigo) { await reply(`manda o link do grupo! Ex: ${prefix}entrar https://chat.whatsapp.com/xxxxxxxxxx`); return; }

    try {
        await reagir("🚪");
        const id = await conn.groupAcceptInvite(codigo);
        await reply(`✅ entrei no grupo!${id ? `\n🆔 ${id}` : ""}`);
    } catch (err) {
        const msg = String(err?.message || err);
        await reply(`❌ não consegui entrar: ${/not-authorized|forbidden|401|403/i.test(msg) ? "o link foi revogado ou eu fui removida desse grupo" : /gone|410|expired/i.test(msg) ? "link expirado" : /conflict|409/i.test(msg) ? "eu já estou nesse grupo" : msg.slice(0, 120)}`);
    }
}

async function comandoAutoler(ctx) {
    const { args, prefix, reply } = ctx;
    if (!ctx.exigirDono()) return;

    const v = ligarDesligar(args[0]);
    if (v === null) { await reply(`👀 autoler tá *${DonoExtra.autoler() ? "ligado" : "desligado"}*\n\nusa: ${prefix}autoler on  ou  ${prefix}autoler off`); return; }
    DonoExtra.definirAutoler(v);
    await reply(`👀 autoler *${v ? "ligado" : "desligado"}* — ${v ? "vou marcar tudo que chegar como lido" : "não marco mais como lido sozinha"}`);
}

async function comandoPresenca(ctx) {
    const { args, prefix, reply } = ctx;
    if (!ctx.exigirDono()) return;

    const modo = (args[0] || "").toLowerCase();
    if (!DonoExtra.definirPresenca(modo)) {
        await reply(`💭 presença atual: *${DonoExtra.presenca()}*\n\nusa: ${prefix}presenca digitando | gravando | online | off\n(aparece quando alguém usa um comando)`);
        return;
    }
    await reply(`💭 presença agora é *${modo}*`);
}

async function comandoLimparCache(ctx) {
    const { args, reply } = ctx;
    if (!ctx.exigirDono()) return;

    const r = DonoExtra.limparCache({ tudo: (args[0] || "").toLowerCase() === "tudo" });
    await reply(`🧹 apaguei *${r.removidos}* arquivo(s) temporário(s) (${mb(r.bytes)}mb liberados)\n\n(só apago o que tem mais de 5 min — use "limparcache tudo" pra apagar tudo)`);
}

// ── TABELA DE COMANDOS ───────────────────────────────────
const TABELA = {
    antis: comandoAntis,
    antipv: comandoAntiPv,
    anticall: comandoAntiCall,

    scircle: ctx => gerarFigurinha(ctx, { modo: "circulo" }),
    scrop: ctx => gerarFigurinha(ctx, { modo: "quadrado" }),
    sfull: ctx => gerarFigurinha(ctx, { modo: "esticar" }),
    sborda: comandoSborda,
    sfx: comandoSfx,
    sfxlista: comandoSfxLista,
    take: comandoTake,
    sinfo: comandoSinfo,
    tovid: comandoTovid,
    semoji: comandoSemoji,

    baixar: ctx => comandoBaixar(ctx),
    mp3: ctx => comandoBaixar(ctx, { audio: true }),
    tomp3: ctx => comandoConverterAudio(ctx, false),
    toptt: ctx => comandoConverterAudio(ctx, true),
    linkinfo: comandoLinkinfo,
    midiasite: comandoMidiaSite,
    imgsite: comandoImgSite,
    scrapers: comandoScrapers,

    cubo3d: ctx => comandoCubo(ctx),
    cubo3dgif: ctx => comandoCubo(ctx, { gif: true }),
    cubofoto: ctx => comandoCubo(ctx, { exigeFoto: true }),
    cubosticker: ctx => comandoCubo(ctx, { formato: "sticker" }),
    cuborubik: ctx => comandoCubo(ctx, { fixo: { estilo: "rubik" } }),
    cubodado: ctx => comandoCubo(ctx, { fixo: { estilo: "dado" } }),
    cubo3dlista: comandoCuboLista,

    backup: comandoBackup,
    autobackup: comandoAutobackup,
    donos: comandoDonos,
    adddono: ctx => comandoAddDono(ctx, false),
    deldono: ctx => comandoAddDono(ctx, true),
    cmdoff: comandoCmdOff,
    cmdon: comandoCmdOn,
    cmdsoff: comandoCmdsOff,
    erros: comandoErros,
    limparerros: comandoLimparErros,
    topcomandos: comandoTopComandos,
    entrar: comandoEntrar,
    autoler: comandoAutoler,
    presenca: comandoPresenca,
    limparcache: comandoLimparCache
};

for (const nome of Antis.NOMES_GRUPO) TABELA[nome] = ctx => comandoAntiGrupo(ctx, nome);

// apelidos (inclui tiktokdl/instadl, que estavam no menu mas sem comando)
const APELIDOS = {
    dl: "baixar", download: "baixar", tiktokdl: "baixar", instadl: "baixar",
    baixaraudio: "mp3",
    scirculo: "scircle", sredonda: "scircle",
    squadrada: "scrop",
    sesticar: "sfull",
    rename: "take", renomear: "take",
    togif: "tovid",
    cubo: "cubo3d", cubogif: "cubo3dgif", cubomagico: "cuborubik", dado3d: "cubodado",
    backupbot: "backup",
    presença: "presenca"
};

const NOMES = new Set([...Object.keys(TABELA), ...Object.keys(APELIDOS)]);

function ehComandoNovo(command) {
    return NOMES.has(command);
}

async function tratar(ctx) {
    const nome = APELIDOS[ctx.command] || ctx.command;
    const fn = TABELA[nome];
    if (!fn) return false;

    try {
        await fn({ ...ctx, command: ctx.command });
    } catch (err) {
        console.error(`[comandos novos] erro em ${ctx.command}:`, err);
        try { await ctx.reply("❌ deu ruim aqui nesse comando, tenta de novo!"); } catch {}
    }
    return true;
}

module.exports = { tratar, ehComandoNovo, TABELA, APELIDOS };
