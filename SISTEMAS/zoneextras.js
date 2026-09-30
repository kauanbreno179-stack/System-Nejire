const config = require("../config.json");
const { zoneGet } = require("../utils/zoneApi.js");

function pegar(obj, ...chaves) {
    for (const chave of chaves) {
        const valor = chave.split(".").reduce((acc, parte) => acc?.[parte], obj);
        if (valor !== undefined && valor !== null && valor !== "") return valor;
    }
    return null;
}

function paraLista(dados) {
    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados?.result)) return dados.result;
    if (Array.isArray(dados?.data)) return dados.data;
    if (Array.isArray(dados?.results)) return dados.results;
    if (Array.isArray(dados?.items)) return dados.items;
    return [];
}

// ── IA COM PERSONAGEM ─────────────────────────────────
async function polyChat(mensagem, characterId) {
    const resp = await zoneGet("polychat", {
        character: characterId || config.zoneApi?.polychatCharacterPadrao || "vShSe",
        message: mensagem
    });

    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const texto = pegar(resp.data, "result", "message", "response", "answer", "reply");
    return { ok: !!texto, texto };
}

// ── PLAYER v2/player —───────────────────
async function player(texto) {
    const resp = await zoneGet("player", { text: texto }, { comApikey: false });
    if (!resp.ok) return { ok: false, erro: resp.erro };

    if (resp.tipo === "binario") return { ok: true, buffer: resp.buffer, contentType: resp.contentType };

    const url = pegar(resp.data, "result", "url", "audio", "data.url");
    return { ok: !!url, url };
}

// ── TIKTOK SEARCH ──────────────────────────────────────────────────
async function buscarTiktok(termo, count = 10) {
    const resp = await zoneGet("tiktokSearch", { q: termo, count });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data).map(item => ({
        titulo: pegar(item, "title", "desc", "description", "caption") || "sem título",
        url: pegar(item, "url", "video", "play", "link", "download"),
        autor: pegar(item, "author.nickname", "author", "username", "nickname")
    })).filter(item => item.url);

    return { ok: lista.length > 0, lista };
}

// ── GOOGLE IMAGES (gimage2) ────────────────────────────────────────
async function buscarImagens(termo, limite = 10) {
    const resp = await zoneGet("gimage2", { query: termo, limite });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data)
        .map(item => (typeof item === "string" ? item : pegar(item, "url", "image", "link", "thumbnail")))
        .filter(Boolean);

    return { ok: lista.length > 0, lista };
}

// ── APP STORE ───────────────────────────────────────────────────────
async function buscarAppStore(termo) {
    const resp = await zoneGet("appstore", { q: termo }, { comApikey: false });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data).map(item => ({
        nome: pegar(item, "title", "name", "appName") || "sem nome",
        desenvolvedor: pegar(item, "developer", "artist", "author"),
        url: pegar(item, "url", "link", "appUrl"),
        icone: pegar(item, "icon", "image", "artwork")
    }));

    return { ok: lista.length > 0, lista };
}

// ── SOUNDCLOUD SEARCH ───────────────────────────────────────────────
async function buscarSoundcloud(termo) {
    const resp = await zoneGet("soundcloud", { q: termo }, { comApikey: false });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data).map(item => ({
        titulo: pegar(item, "title", "name") || "sem título",
        autor: pegar(item, "author", "artist", "user.username"),
        url: pegar(item, "url", "permalink_url", "link", "download")
    }));

    return { ok: lista.length > 0, lista };
}

// ── GRUPOS DE WHATSAPP ──────────────────────────────────────────────
async function buscarGruposWa(termo) {
    const resp = await zoneGet("wagroups", { q: termo }, { comApikey: false });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data).map(item => ({
        nome: pegar(item, "title", "name", "groupName") || "sem nome",
        link: pegar(item, "url", "link", "invite")
    })).filter(item => item.link);

    return { ok: lista.length > 0, lista };
}

// ── APPLE (music/store) ──────────────────────────────────────────────
async function buscarApple(termo) {
    const resp = await zoneGet("apple", { q: termo }, { comApikey: false });
    if (!resp.ok || resp.tipo !== "json") return { ok: false, erro: resp.erro || "resposta inesperada" };

    const lista = paraLista(resp.data).map(item => ({
        titulo: pegar(item, "title", "trackName", "name") || "sem título",
        artista: pegar(item, "artist", "artistName", "author"),
        url: pegar(item, "url", "trackViewUrl", "link")
    }));

    return { ok: lista.length > 0, lista };
}

// ── CANVAS: ATTP ────────────────────────────
async function gerarAttp(texto) {
    const resp = await zoneGet("attp", { text: texto }, { comApikey: false });
    if (!resp.ok) return { ok: false, erro: resp.erro };
    if (resp.tipo === "binario") return { ok: true, buffer: resp.buffer, contentType: resp.contentType };

    const url = pegar(resp.data, "result", "url");
    return { ok: !!url, url };
}

// ── CANVAS: ROLETA ────────────────────────────────────────────────────
async function gerarRoleta(texto) {
    const resp = await zoneGet("roleta", { text: texto }, { comApikey: false });
    if (!resp.ok) return { ok: false, erro: resp.erro };
    if (resp.tipo === "binario") return { ok: true, buffer: resp.buffer, contentType: resp.contentType };

    const url = pegar(resp.data, "result", "url");
    return { ok: !!url, url };
}

module.exports = {
    polyChat,
    player,
    buscarTiktok,
    buscarImagens,
    buscarAppStore,
    buscarSoundcloud,
    buscarGruposWa,
    buscarApple,
    gerarAttp,
    gerarRoleta
};
