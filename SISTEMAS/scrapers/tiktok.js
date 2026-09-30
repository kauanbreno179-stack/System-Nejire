// MÓDULO: tiktok via tikwm
const Base = require("./base.js");

const HOST = /(^|\.)tiktok\.com$/i;
const API = "https://www.tikwm.com";

function completa(u) {
    if (!u) return null;
    return u.startsWith("/") ? `${API}${u}` : u;
}

module.exports = {
    nome: "tiktok",
    descricao: "tiktok sem marca d'água, áudio e slideshow (via tikwm)",
    ativo: () => true,

    aceita(url) {
        return Base.ehUrl(url) && HOST.test(Base.hostDe(url));
    },

    async resolver(url) {
        const { json } = await Base.pegarJson(`${API}/api/?url=${encodeURIComponent(url)}&hd=1`, { seguro: false, timeoutMs: 25000 });
        const d = json?.data;
        if (json?.code !== 0 || !d) throw new Error(json?.msg || "tikwm não respondeu");

        const midias = [];
        const titulo = d.title || d.author?.nickname || "tiktok";

        if (Array.isArray(d.images) && d.images.length) {
            for (const img of d.images) midias.push({ tipo: "imagem", url: completa(img), seguro: false });
        } else {
            const principal = completa(d.hdplay || d.play);
            const alternativa = completa(d.hdplay ? d.play : null);
            if (principal) midias.push({ tipo: "video", url: principal, alt: alternativa ? [alternativa] : [], seguro: false });
        }

        const musica = completa(d.music || d.music_info?.play);
        if (musica) midias.push({ tipo: "audio", url: musica, nome: d.music_info?.title, seguro: false });

        return { ok: midias.length > 0, titulo, midias };
    }
};
