// Tudo aqui usa o ffmpeg direto (utils/ffmpeg.js) e o node-webpmux

const fs = require("fs");
const crypto = require("crypto");
const Tmp = require("../utils/tmp.js");
const Ffmpeg = require("../utils/ffmpeg.js");
const { limparFundoEntreQuadros } = require("../utils/webp.js");

const MODOS = ["padrao", "circulo", "quadrado", "esticar", "borda"];

const EFEITOS = {
    pb: { desc: "preto e branco", vf: "hue=s=0" },
    sepia: { desc: "tom antigo", vf: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131" },
    negativo: { desc: "cores invertidas", vf: "negate" },
    blur: { desc: "desfocado", vf: "gblur=sigma=5" },
    nitido: { desc: "mais nitidez", vf: "unsharp=5:5:1.6" },
    pixelar: { desc: "pixel art", vf: "scale=iw/14:ih/14:flags=neighbor,scale=iw*14:ih*14:flags=neighbor" },
    espelho: { desc: "espelha na horizontal", vf: "hflip" },
    espelhov: { desc: "espelha na vertical", vf: "vflip" },
    girar: { desc: "gira 90 graus", vf: "transpose=1" },
    brilho: { desc: "mais claro e colorido", vf: "eq=brightness=0.12:saturation=1.3" },
    escuro: { desc: "mais escuro", vf: "eq=brightness=-0.2:contrast=1.1" },
    contraste: { desc: "contraste forte", vf: "eq=contrast=1.6:saturation=1.2" },
    vintage: { desc: "cara de foto antiga", vf: "curves=preset=vintage" },
    glitch: { desc: "canais de cor deslocados", vf: "rgbashift=rh=8:bh=-8:gv=4" },
    desenho: { desc: "rabisco em preto e branco", vf: "edgedetect=mode=wires:low=0.08:high=0.25,negate" },
    relevo: { desc: "cores em relevo escuro", vf: "edgedetect=mode=colormix:low=0.06:high=0.2" },
    ruido: { desc: "chuvisco de tv", vf: "noise=alls=28:allf=t+u" },
    vinheta: { desc: "bordas escurecidas", vf: "vignette=PI/4" },
    arcoiris: { desc: "cores girando (melhor em vídeo)", vf: "hue=h=t*120:s=1.5" }
};

const CORES = {
    branco: "white", preto: "black", vermelho: "red", azul: "0x3276E8", ciano: "0x38C6DC",
    verde: "0x22C55E", amarelo: "yellow", laranja: "orange", rosa: "0xFF69B4", roxo: "0x8B5CF6",
    cinza: "gray", dourado: "0xFFD700", marrom: "0x8B4513"
};

// aceita nome em português ou hex (#ff0000 / ff0000)
function parseCor(txt, padrao = "white") {
    const t = String(txt || "").trim().toLowerCase();
    if (!t) return padrao;
    if (CORES[t]) return CORES[t];
    const hex = t.replace(/^#/, "");
    if (/^[0-9a-f]{6}$/.test(hex)) return `0x${hex}`;
    return null;
}

// ── FILTROS ──────────────────────────────────────────────
function montarFiltro({ modo = "padrao", efeito = null, cor = "white", fps = null }) {
    const partes = [];
    if (fps) partes.push(`fps=${fps}`);

    if (modo === "quadrado" || modo === "circulo") {
        partes.push("scale=512:512:force_original_aspect_ratio=increase:flags=lanczos", "crop=512:512");
    } else if (modo === "esticar") {
        partes.push("scale=512:512:flags=lanczos");
    } else if (modo === "borda") {
        partes.push("scale=480:480:force_original_aspect_ratio=decrease:flags=lanczos");
    } else {
        partes.push("scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos");
    }

    if (efeito && EFEITOS[efeito]) partes.push(EFEITOS[efeito].vf);

    if (modo === "borda") {
        partes.push(`pad=iw+32:ih+32:16:16:color=${cor}`, "scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos");
    }

    if (modo === "padrao" || modo === "borda") {
        partes.push("format=rgba", "pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0");
    } else if (modo === "circulo") {
        partes.push("format=rgba", "geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip(256.5-hypot(X-256,Y-256),0,1)'");
    } else {
        partes.push("format=rgba");
    }

    return partes.join(",");
}

// ── CRIAÇÃO ──────────────────────────────────────────────
const TENTATIVAS_VIDEO = [
    { q: 50, fps: 15, t: 8 },
    { q: 38, fps: 12, t: 7 },
    { q: 28, fps: 10, t: 6 },
    { q: 20, fps: 8, t: 5 }
];
const TENTATIVAS_IMAGEM = [{ q: 80 }, { q: 62 }, { q: 45 }, { q: 30 }];

const LIMITE_VIDEO = 500 * 1024;
const LIMITE_IMAGEM = 100 * 1024;

// devolve um webp (sem exif) — reduz qualidade até caber no limite do whatsapp
async function criarWebp(buffer, { video = false, modo = "padrao", efeito = null, cor = "white" } = {}) {
    const tentativas = video ? TENTATIVAS_VIDEO : TENTATIVAS_IMAGEM;
    const limite = video ? LIMITE_VIDEO : LIMITE_IMAGEM;
    let ultimo = null;

    for (const t of tentativas) {
        const vf = montarFiltro({ modo, efeito, cor, fps: video ? t.fps : null });

        const saida = await Ffmpeg.converter(buffer, "bin", "webp", (entrada, arquivoSaida) => {
            const args = ["-i", entrada, "-vf", vf];
            if (video) args.push("-t", String(t.t), "-loop", "0", "-vsync", "0");
            else args.push("-frames:v", "1");
            args.push("-c:v", "libwebp", "-lossless", "0", "-q:v", String(t.q), "-compression_level", "4", "-preset", "default", "-an", arquivoSaida);
            return args;
        }, { timeoutMs: 90000 });

        ultimo = video ? limparFundoEntreQuadros(saida) : saida;
        if (ultimo.length <= limite) return ultimo;
    }

    return ultimo;
}

// ── EXIF (pack / autor) ──────────────────────────────────
function montarExif({ packname = "", author = "", emojis = null } = {}) {
    const json = {
        "sticker-pack-id": crypto.randomBytes(16).toString("hex"),
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
        emojis: emojis?.length ? emojis : [""]
    };

    const cabecalho = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const corpo = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([cabecalho, corpo]);
    exif.writeUIntLE(corpo.length, 14, 4);
    return exif;
}

async function aplicarExif(webp, meta = {}) {
    if (!meta.packname && !meta.author) return webp;

    const webpmux = require("node-webpmux");
    const entrada = Tmp.arquivo("webp");
    const saida = Tmp.arquivo("webp");

    fs.writeFileSync(entrada, webp);

    try {
        const img = new webpmux.Image();
        await img.load(entrada);
        img.exif = montarExif(meta);
        await img.save(saida);
        // o node-webpmux regrava os quadros; garante de novo o "limpar fundo" em animadas
        return limparFundoEntreQuadros(fs.readFileSync(saida));
    } finally {
        Tmp.remover(entrada, saida);
    }
}

// lê o exif de um webp (pure JS: caminha pelos chunks RIFF)
function lerExif(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 12) return null;
    if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;

    let off = 12;
    while (off + 8 <= buf.length) {
        const id = buf.toString("ascii", off, off + 4);
        const tam = buf.readUInt32LE(off + 4);

        if (id === "EXIF") {
            const dados = buf.subarray(off + 8, off + 8 + tam);
            const ini = dados.indexOf("{");
            if (ini < 0) return null;
            try { return JSON.parse(dados.subarray(ini).toString("utf8")); } catch { return null; }
        }

        off += 8 + tam + (tam & 1);
    }
    return null;
}

function ehWebpAnimado(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 30) return false;
    if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return false;

    let off = 12;
    while (off + 8 <= buf.length) {
        const id = buf.toString("ascii", off, off + 4);
        if (id === "ANIM" || id === "ANMF") return true;
        off += 8 + buf.readUInt32LE(off + 4) + (buf.readUInt32LE(off + 4) & 1);
    }
    return false;
}

function infoSticker(buf) {
    const exif = lerExif(buf) || {};
    return {
        animada: ehWebpAnimado(buf),
        pack: exif["sticker-pack-name"] || "",
        autor: exif["sticker-pack-publisher"] || "",
        emojis: (exif.emojis || []).filter(Boolean),
        kb: Math.round(buf.length / 1024)
    };
}

// ── API DE ALTO NÍVEL ────────────────────────────────────
async function criar(buffer, opcoes = {}, meta = {}) {
    const webp = await criarWebp(buffer, opcoes);
    return aplicarExif(webp, meta);
}

// "take": troca o pack/autor de uma figurinha que já existe
async function trocarPackAutor(webp, meta) {
    return aplicarExif(webp, meta);
}

// ── FIGURINHA ANIMADA → VÍDEO ────────────────────────────
async function webpAnimadoParaVideo(buffer) {
    const sharp = require("sharp");
    const { spawn } = require("child_process");

    const meta = await sharp(buffer, { animated: true, pages: -1 }).metadata();
    const paginas = meta.pages || 1;
    if (paginas < 2) throw new Error("essa figurinha não é animada");

    const largura = meta.width;
    const altura = meta.pageHeight || meta.height;
    const atrasos = Array.isArray(meta.delay) && meta.delay.length ? meta.delay : [70];
    const media = atrasos.reduce((a, b) => a + b, 0) / atrasos.length || 70;
    const fps = Math.min(30, Math.max(5, Math.round(1000 / media)));

    const { data } = await sharp(buffer, { animated: true, pages: -1 })
        .flatten({ background: "#ffffff" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const saida = Tmp.arquivo("mp4");

    try {
        await new Promise((resolve, reject) => {
            const args = [
                "-hide_banner", "-loglevel", "error", "-y",
                "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${largura}x${altura}`, "-framerate", String(fps), "-i", "pipe:0",
                "-vf", `loop=loop=2:size=${paginas}:start=0,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", saida
            ];
            const proc = spawn(Ffmpeg.binario(), args, { stdio: ["pipe", "ignore", "pipe"] });
            let erro = "";
            proc.stderr.on("data", d => { if (erro.length < 2000) erro += d.toString(); });
            proc.on("error", reject);
            proc.on("close", code => code === 0 ? resolve() : reject(new Error(`ffmpeg falhou: ${erro.trim()}`)));
            proc.stdin.on("error", () => {});
            proc.stdin.end(data);
        });

        return fs.readFileSync(saida);
    } finally {
        Tmp.remover(saida);
    }
}

// ── EMOJI → FIGURINHA ────────────────────────────────────
function codepointsDoEmoji(emoji) {
    return [...String(emoji)]
        .map(c => c.codePointAt(0).toString(16))
        .filter(cp => cp !== "fe0f")
        .join("_");
}

function extrairPrimeiroEmoji(txt) {
    const m = String(txt || "").match(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?)*|[\u{1F1E6}-\u{1F1FF}]{2}/u);
    return m ? m[0] : null;
}

async function baixarImagemEmoji(emoji) {
    const cp = codepointsDoEmoji(emoji);
    const url = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u${cp}.png`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);

    try {
        const resp = await fetch(url, { signal: ctrl.signal });
        if (!resp.ok) return null;
        return Buffer.from(await resp.arrayBuffer());
    } finally {
        clearTimeout(timer);
    }
}

module.exports = {
    MODOS, EFEITOS, CORES,
    parseCor, montarFiltro,
    criarWebp, criar,
    montarExif, aplicarExif, lerExif, ehWebpAnimado, infoSticker, trocarPackAutor,
    webpAnimadoParaVideo,
    codepointsDoEmoji, extrairPrimeiroEmoji, baixarImagemEmoji
};
