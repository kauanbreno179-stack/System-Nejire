const dns = require("dns").promises;
const net = require("net");
const config = require("../../config.json");

const UA = "Mozilla/5.0 (Linux; Android 13; SM-A536E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

const EXT = {
    audio: ["mp3", "m4a", "aac", "ogg", "opus", "wav", "flac", "oga"],
    video: ["mp4", "webm", "mov", "mkv", "m4v", "3gp", "avi"],
    imagem: ["jpg", "jpeg", "png", "gif", "webp", "bmp"],
    documento: ["pdf", "zip", "rar", "7z", "apk", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "json"]
};

const MIME_POR_EXT = {
    mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", ogg: "audio/ogg", opus: "audio/ogg", wav: "audio/wav", flac: "audio/flac", oga: "audio/ogg",
    mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", mkv: "video/x-matroska", m4v: "video/mp4", "3gp": "video/3gpp", avi: "video/x-msvideo",
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", bmp: "image/bmp",
    pdf: "application/pdf", zip: "application/zip", rar: "application/vnd.rar", "7z": "application/x-7z-compressed",
    apk: "application/vnd.android.package-archive", txt: "text/plain", csv: "text/csv", json: "application/json"
};

function cfg() {
    return config.scrapers || {};
}

function limiteBytes() {
    return Math.max(1, Number(cfg().maxMb) || 50) * 1024 * 1024;
}

function extensao(url) {
    try {
        const nome = new URL(url).pathname.split("/").pop() || "";
        const m = nome.toLowerCase().match(/\.([a-z0-9]{2,5})$/);
        return m ? m[1] : "";
    } catch {
        return "";
    }
}

function tipoPorExtensao(ext) {
    for (const [tipo, lista] of Object.entries(EXT)) if (lista.includes(ext)) return tipo;
    return null;
}

function tipoPorMime(mime) {
    const m = String(mime || "").toLowerCase();
    if (m.startsWith("audio/")) return "audio";
    if (m.startsWith("video/")) return "video";
    if (m.startsWith("image/")) return "imagem";
    return null;
}

function ehUrl(txt) {
    return /^https?:\/\/[^\s]+$/i.test(String(txt || "").trim());
}

function hostDe(url) {
    try { return new URL(url).hostname.toLowerCase(); } catch { return ""; }
}

// ── ANTI-SSRF ────────────────────────────────────────────
function ipv4Privado(ip) {
    const p = ip.split(".").map(Number);
    if (p.length !== 4 || p.some(n => Number.isNaN(n))) return true;
    const [a, b] = p;
    return (
        a === 0 || a === 10 || a === 127 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 100 && b >= 64 && b <= 127) ||
        (a === 192 && b === 0 && p[2] === 0) ||
        (a === 198 && (b === 18 || b === 19)) ||
        a >= 224
    );
}

function ipPrivado(ip) {
    const v = net.isIP(ip);
    if (v === 4) return ipv4Privado(ip);
    if (v === 6) {
        const baixo = ip.toLowerCase();
        if (baixo === "::" || baixo === "::1") return true;
        if (baixo.startsWith("fc") || baixo.startsWith("fd") || baixo.startsWith("fe8") || baixo.startsWith("fe9") || baixo.startsWith("fea") || baixo.startsWith("feb")) return true;
        const pontuado = baixo.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
        if (pontuado) return ipv4Privado(pontuado[1]);
        const hex = baixo.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
        if (hex) {
            const hi = parseInt(hex[1], 16);
            const lo = parseInt(hex[2], 16);
            return ipv4Privado(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
        }
        return false;
    }
    return true;
}

async function validarUrlSegura(urlTxt) {
    let u;
    try { u = new URL(urlTxt); } catch { throw new Error("link inválido"); }

    if (!["http:", "https:"].includes(u.protocol)) throw new Error("só aceito links http/https");
    if (process.env.NEJIRE_SCRAPER_PERMITIR_LOCAL === "1") return u;

    const host = u.hostname.replace(/^\[|\]$/g, "");
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
        throw new Error("link bloqueado (endereço interno)");
    }

    const enderecos = net.isIP(host)
        ? [host]
        : (await dns.lookup(host, { all: true })).map(e => e.address);

    if (!enderecos.length || enderecos.some(ipPrivado)) throw new Error("link bloqueado (endereço interno)");
    return u;
}

// ── FETCH ────────────────────────────────────────────────
const REDIRECTS = new Set([301, 302, 303, 307, 308]);

async function requisitar(url, { metodo = "GET", headers = {}, corpo, timeoutMs = 20000, seguro = true, maxRedirects = 5 } = {}) {
    let atual = url;

    for (let i = 0; i <= maxRedirects; i++) {
        if (seguro) await validarUrlSegura(atual);

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);

        let resp;
        try {
            resp = await fetch(atual, {
                method: i === 0 ? metodo : "GET",
                headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8", ...headers },
                body: i === 0 ? corpo : undefined,
                redirect: "manual",
                signal: ctrl.signal
            });
        } catch (err) {
            clearTimeout(timer);
            throw new Error(err.name === "AbortError" ? "o site demorou demais pra responder" : `falha na conexão (${err.cause?.code || err.message})`);
        }
        clearTimeout(timer);

        if (REDIRECTS.has(resp.status)) {
            const loc = resp.headers.get("location");
            if (!loc) return resp;
            atual = new URL(loc, atual).toString();
            continue;
        }

        resp.urlFinal = atual;
        return resp;
    }

    throw new Error("redirecionamentos demais");
}

async function lerCorpo(resp, maxBytes) {
    const declarado = Number(resp.headers.get("content-length") || 0);
    if (declarado && declarado > maxBytes) {
        throw new Error(`arquivo grande demais (${(declarado / 1048576).toFixed(1)}mb, limite ${Math.round(maxBytes / 1048576)}mb)`);
    }

    const partes = [];
    let total = 0;
    const leitor = resp.body.getReader();

    for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        total += value.length;
        if (total > maxBytes) {
            try { await leitor.cancel(); } catch {}
            throw new Error(`arquivo grande demais (limite ${Math.round(maxBytes / 1048576)}mb)`);
        }
        partes.push(value);
    }

    return Buffer.concat(partes.map(p => Buffer.from(p)));
}

async function pegarTexto(url, opts = {}) {
    const resp = await requisitar(url, { ...opts, headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8", ...(opts.headers || {}) } });
    if (!resp.ok) throw new Error(`o site respondeu ${resp.status}`);
    const buf = await lerCorpo(resp, 3 * 1024 * 1024);
    return { texto: buf.toString("utf8"), url: resp.urlFinal || url };
}

async function pegarJson(url, opts = {}) {
    const resp = await requisitar(url, { ...opts, headers: { Accept: "application/json", ...(opts.headers || {}) } });
    const buf = await lerCorpo(resp, 3 * 1024 * 1024);
    let json;
    try { json = JSON.parse(buf.toString("utf8")); } catch { throw new Error(`resposta inválida (${resp.status})`); }
    return { status: resp.status, json };
}

function nomeDoArquivo(resp, url) {
    const cd = resp.headers.get("content-disposition") || "";
    const m = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (m) { try { return decodeURIComponent(m[1]); } catch { return m[1]; } }
    try { return decodeURIComponent(new URL(url).pathname.split("/").pop() || "arquivo"); } catch { return "arquivo"; }
}

async function baixarBuffer(url, { maxBytes = limiteBytes(), timeoutMs = 90000, seguro = true } = {}) {
    const resp = await requisitar(url, { timeoutMs, seguro, headers: { Accept: "*/*" } });
    if (!resp.ok) throw new Error(`o servidor respondeu ${resp.status}`);

    const buffer = await lerCorpo(resp, maxBytes);
    const mime = (resp.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const nome = nomeDoArquivo(resp, resp.urlFinal || url);
    return { buffer, mime, nome };
}

module.exports = {
    cfg, limiteBytes, extensao, tipoPorExtensao, tipoPorMime, ehUrl, hostDe, EXT, MIME_POR_EXT,
    ipPrivado, validarUrlSegura, requisitar, pegarTexto, pegarJson, baixarBuffer
};
