// MÓDULO: página web qualquer — lê meta tags (og:*), <video>, <audio>,
const Base = require("./base.js");

const PLATAFORMAS_CONHECIDAS = /(^|\.)(youtube\.com|youtu\.be|instagram\.com|spotify\.com|tiktok\.com|facebook\.com|fb\.watch|twitter\.com|x\.com)$/i;

function decodificar(txt = "") {
    return String(txt)
        .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;|&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .trim();
}

function atributos(tag) {
    const attrs = {};
    const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let m;
    while ((m = re.exec(tag))) attrs[m[1].toLowerCase()] = decodificar(m[2] ?? m[3] ?? m[4] ?? "");
    return attrs;
}

function absoluto(rel, base) {
    if (!rel || rel.startsWith("data:") || rel.startsWith("javascript:") || rel.startsWith("blob:")) return null;
    try {
        const u = new URL(rel, base);
        return ["http:", "https:"].includes(u.protocol) ? u.toString() : null;
    } catch {
        return null;
    }
}

function unicos(lista) {
    return [...new Set(lista.filter(Boolean))];
}

function extrair(html, base) {
    const meta = {};
    const videos = [];
    const audios = [];
    const imagens = [];
    const links = [];
    let titulo = "";

    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (t) titulo = decodificar(t[1].replace(/\s+/g, " "));

    const re = /<(meta|img|video|audio|source|a)\b[^>]*>/gi;
    let m;
    while ((m = re.exec(html))) {
        const nomeTag = m[1].toLowerCase();
        const a = atributos(m[0]);

        if (nomeTag === "meta") {
            const chave = (a.property || a.name || "").toLowerCase();
            if (chave && a.content && !meta[chave]) meta[chave] = a.content;
        } else if (nomeTag === "img") {
            const larg = Number(a.width || 0);
            const alt = Number(a.height || 0);
            if ((larg && larg < 60) || (alt && alt < 60)) continue;
            const src = a.src || a["data-src"] || a["data-original"];
            const url = absoluto(src, base);
            if (url && !/\.svg(\?|$)/i.test(url)) imagens.push(url);
        } else if (nomeTag === "video") {
            videos.push(absoluto(a.src, base));
        } else if (nomeTag === "audio") {
            audios.push(absoluto(a.src, base));
        } else if (nomeTag === "source") {
            const url = absoluto(a.src, base);
            const tipo = Base.tipoPorMime((a.type || "").split(";")[0]) || Base.tipoPorExtensao(Base.extensao(url || ""));
            if (tipo === "audio") audios.push(url);
            else if (tipo === "video") videos.push(url);
            else if (tipo === "imagem") imagens.push(url);
        } else if (nomeTag === "a") {
            const url = absoluto(a.href, base);
            const tipo = url ? Base.tipoPorExtensao(Base.extensao(url)) : null;
            if (tipo === "audio") audios.push(url);
            else if (tipo === "video") videos.push(url);
            else if (tipo === "documento") links.push(url);
        }
    }

    const ogVideo = ["og:video:secure_url", "og:video:url", "og:video", "twitter:player:stream"].map(k => absoluto(meta[k], base));
    const ogAudio = ["og:audio:secure_url", "og:audio:url", "og:audio"].map(k => absoluto(meta[k], base));
    const ogImagem = absoluto(meta["og:image:secure_url"] || meta["og:image"] || meta["twitter:image"] || meta["twitter:image:src"], base);

    return {
        titulo: decodificar(meta["og:title"] || meta["twitter:title"] || titulo),
        descricao: decodificar(meta["og:description"] || meta["description"] || meta["twitter:description"] || ""),
        site: decodificar(meta["og:site_name"] || ""),
        imagem: ogImagem,
        videos: unicos([...ogVideo, ...videos]),
        audios: unicos([...ogAudio, ...audios]),
        imagens: unicos([ogImagem, ...imagens]).slice(0, 60),
        documentos: unicos(links).slice(0, 20)
    };
}

async function analisar(url) {
    const { texto, url: finalUrl } = await Base.pegarTexto(url);
    return { ...extrair(texto, finalUrl), url: finalUrl };
}

module.exports = {
    nome: "pagina",
    descricao: "qualquer página web: acha vídeo, áudio e imagens no html/og:tags",
    ativo: () => true,

    extrair,
    analisar,

    aceita(url) {
        return Base.ehUrl(url) && !PLATAFORMAS_CONHECIDAS.test(Base.hostDe(url));
    },

    async resolver(url) {
        const p = await analisar(url);
        const midias = [];

        for (const v of p.videos.slice(0, 2)) midias.push({ tipo: "video", url: v });
        for (const a of p.audios.slice(0, 2)) midias.push({ tipo: "audio", url: a });
        if (!midias.length && p.imagem) midias.push({ tipo: "imagem", url: p.imagem });

        return { ok: midias.length > 0, titulo: p.titulo || p.site || url, midias };
    }
};
