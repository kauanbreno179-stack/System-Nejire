const { lopesGet } = require("../utils/api.js");

function extrairUrlMidia(dados) {
    return (
        dados?.result?.url ||
        dados?.result?.download ||
        dados?.result?.media ||
        dados?.url ||
        dados?.download ||
        dados?.link ||
        null
    );
}

async function buscarMusica(termo) {
    const resp = await lopesGet("play", {}, termo);
    if (!resp.ok) return { ok: false, erro: resp.erro };

    const dados = resp.data;
    return {
        ok: true,
        titulo: dados?.result?.title || dados?.title || termo,
        url: extrairUrlMidia(dados)
    };
}

async function buscarVideo(termo) {
    const resp = await lopesGet("playVideo", {}, termo);
    if (!resp.ok) return { ok: false, erro: resp.erro };

    const dados = resp.data;
    return {
        ok: true,
        titulo: dados?.result?.title || dados?.title || termo,
        url: extrairUrlMidia(dados)
    };
}

async function baixarTiktok(link) {
    const resp = await lopesGet("tiktok", {}, link);
    if (!resp.ok) return { ok: false, erro: resp.erro };
    return { ok: true, url: extrairUrlMidia(resp.data) };
}

async function baixarInstagram(link) {
    const resp = await lopesGet("instagram", {}, link);
    if (!resp.ok) return { ok: false, erro: resp.erro };
    return { ok: true, url: extrairUrlMidia(resp.data) };
}

async function baixarSpotify(link) {
    const resp = await lopesGet("spotify", {}, link);
    if (!resp.ok) return { ok: false, erro: resp.erro };
    return { ok: true, url: extrairUrlMidia(resp.data), titulo: resp.data?.result?.title };
}

async function buscarPinterest(termo) {
    const resp = await lopesGet("pinterest", {}, termo);
    if (!resp.ok) return { ok: false, erro: resp.erro };

    const dados = resp.data;
    const lista = dados?.result || dados?.data || [];
    return { ok: true, imagens: Array.isArray(lista) ? lista.slice(0, 5) : [] };
}

async function buscarLetra(termo) {
    const resp = await lopesGet("letra", {}, termo);
    if (!resp.ok) return { ok: false, erro: resp.erro };

    const dados = resp.data;
    return { ok: true, letra: dados?.result?.lyrics || dados?.lyrics || dados?.result || null };
}

async function buscarClima(cidade) {
    const resp = await lopesGet("clima", {}, cidade);
    if (!resp.ok) return { ok: false, erro: resp.erro };
    return { ok: true, dados: resp.data?.result || resp.data };
}

module.exports = {
    buscarMusica,
    buscarVideo,
    baixarTiktok,
    baixarInstagram,
    baixarSpotify,
    buscarPinterest,
    buscarLetra,
    buscarClima
};
