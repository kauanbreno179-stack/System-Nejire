// Junta os módulos de scraper (SISTEMAS/scrapers) + download com limite
// de tamanho + conversão pra mp3 quando o link só tem vídeo.

const Scrapers = require("./scrapers/index.js");
const Base = require("./scrapers/base.js");
const Midia = require("./midia.js");

const MAX_IMAGENS = 6;

async function baixarComAlternativas(m) {
    const urls = [m.url, ...(m.alt || [])];
    let ultimoErro = null;

    for (const url of urls) {
        try {
            return await Base.baixarBuffer(url, { seguro: m.seguro !== false });
        } catch (err) {
            ultimoErro = err;
        }
    }
    throw ultimoErro || new Error("não consegui baixar");
}

// devolve { ok, titulo, modulo, itens: [{ tipo, buffer, mime, nome }] }
//   audio=false → vídeo (ou fotos, ou áudio, ou documento — o que existir)
//   audio=true  → áudio (se só tiver vídeo, extrai o áudio com ffmpeg)
async function preparar(url, { audio = false } = {}) {
    const r = await Scrapers.resolver(url, { audio });
    if (!r.ok) return { ok: false, erro: r.erro };

    const por = tipo => r.midias.filter(m => m.tipo === tipo);
    const videos = por("video");
    const audios = por("audio");
    const imagens = por("imagem");
    const docs = por("documento");

    try {
        if (audio) {
            if (audios.length) {
                const arq = await baixarComAlternativas(audios[0]);
                return { ok: true, titulo: r.titulo, modulo: r.modulo, itens: [{ tipo: "audio", ...arq }] };
            }
            if (videos.length) {
                const arq = await baixarComAlternativas(videos[0]);
                const mp3 = await Midia.paraMp3(arq.buffer);
                return { ok: true, titulo: r.titulo, modulo: r.modulo, itens: [{ tipo: "audio", buffer: mp3, mime: "audio/mpeg", nome: `${r.titulo || "audio"}.mp3` }] };
            }
            return { ok: false, erro: "esse link não tem áudio nem vídeo pra extrair" };
        }

        if (videos.length) {
            const arq = await baixarComAlternativas(videos[0]);
            return { ok: true, titulo: r.titulo, modulo: r.modulo, itens: [{ tipo: "video", ...arq }] };
        }

        if (imagens.length) {
            const itens = [];
            for (const img of imagens.slice(0, MAX_IMAGENS)) {
                try { itens.push({ tipo: "imagem", ...(await baixarComAlternativas(img)) }); } catch {}
            }
            if (itens.length) return { ok: true, titulo: r.titulo, modulo: r.modulo, itens };
        }

        if (audios.length) {
            const arq = await baixarComAlternativas(audios[0]);
            return { ok: true, titulo: r.titulo, modulo: r.modulo, itens: [{ tipo: "audio", ...arq }] };
        }

        if (docs.length) {
            const arq = await baixarComAlternativas(docs[0]);
            return { ok: true, titulo: r.titulo, modulo: r.modulo, itens: [{ tipo: "documento", ...arq }] };
        }

        return { ok: false, erro: "não achei nada baixável nesse link" };
    } catch (err) {
        return { ok: false, erro: err.message };
    }
}

// monta o conteúdo de envio do baileys pra cada item baixado
function paraMensagem(item, legenda = "") {
    if (item.tipo === "video") return { video: item.buffer, caption: legenda, mimetype: "video/mp4" };
    if (item.tipo === "imagem") return { image: item.buffer, caption: legenda };
    if (item.tipo === "audio") return { audio: item.buffer, mimetype: "audio/mpeg", fileName: `${(legenda || item.nome || "audio").replace(/[\\/:*?"<>|]/g, "").slice(0, 60)}.mp3` };
    return { document: item.buffer, mimetype: item.mime || "application/octet-stream", fileName: item.nome || "arquivo" };
}

module.exports = { preparar, paraMensagem, Scrapers };
