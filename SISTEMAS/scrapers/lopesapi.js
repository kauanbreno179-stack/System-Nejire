// MÓDULO: LOPES API (a que você já tem configurada em config.json > lopesApi)
const Base = require("./base.js");

const YOUTUBE = /(^|\.)(youtube\.com|youtu\.be)$/i;
const INSTAGRAM = /(^|\.)instagram\.com$/i;
const SPOTIFY = /(^|\.)spotify\.com$/i;
const TIKTOK = /(^|\.)tiktok\.com$/i;

module.exports = {
    nome: "lopesapi",
    descricao: "youtube, instagram, spotify e tiktok (reserva) pela LOPES API",
    ativo: () => true,

    aceita(url) {
        const h = Base.hostDe(url);
        return Base.ehUrl(url) && (YOUTUBE.test(h) || INSTAGRAM.test(h) || SPOTIFY.test(h) || TIKTOK.test(h));
    },

    async resolver(url, { audio = false } = {}) {
        const Scraper = require("../scraper.js");
        const h = Base.hostDe(url);
        let r;

        if (YOUTUBE.test(h)) r = audio ? await Scraper.buscarMusica(url) : await Scraper.buscarVideo(url);
        else if (INSTAGRAM.test(h)) r = await Scraper.baixarInstagram(url);
        else if (SPOTIFY.test(h)) r = await Scraper.baixarSpotify(url);
        else r = await Scraper.baixarTiktok(url);

        if (!r?.ok || !r.url) throw new Error(r?.erro || "a api não devolveu link");

        const tipo = SPOTIFY.test(h) || (YOUTUBE.test(h) && audio) ? "audio" : "video";
        return { ok: true, titulo: r.titulo || "download", midias: [{ tipo, url: r.url, seguro: false }] };
    }
};
