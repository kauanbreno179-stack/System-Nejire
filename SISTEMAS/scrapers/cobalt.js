// MÓDULO: cobalt (https://github.com/imputnet/cobalt) — baixa de dezenas de sites
const Base = require("./base.js");

function conf() {
    return Base.cfg().cobalt || {};
}

module.exports = {
    nome: "cobalt",
    descricao: "youtube, instagram, twitter, reddit, soundcloud... (precisa de instância própria)",
    ativo: () => !!conf().baseUrl,

    aceita(url) {
        return !!conf().baseUrl && Base.ehUrl(url);
    },

    async resolver(url, { audio = false } = {}) {
        const c = conf();
        const headers = { "Content-Type": "application/json", Accept: "application/json" };
        if (c.apiKey) headers.Authorization = `Api-Key ${c.apiKey}`;

        const corpo = JSON.stringify({
            url,
            downloadMode: audio ? "audio" : "auto",
            audioFormat: "mp3",
            videoQuality: String(c.qualidade || "720"),
            filenameStyle: "basic"
        });

        const resp = await Base.requisitar(String(c.baseUrl), { metodo: "POST", headers, corpo, seguro: false, timeoutMs: 40000 });
        const json = await resp.json().catch(() => null);
        if (!json) throw new Error(`cobalt respondeu ${resp.status} sem json`);

        if (json.status === "error") throw new Error(`cobalt: ${json.error?.code || "erro"}`);

        const midias = [];
        if (json.status === "tunnel" || json.status === "redirect") {
            midias.push({ tipo: audio ? "audio" : (Base.tipoPorExtensao(Base.extensao(json.filename || "")) || "video"), url: json.url, nome: json.filename, seguro: false });
        } else if (json.status === "picker") {
            for (const p of json.picker || []) {
                midias.push({ tipo: p.type === "photo" ? "imagem" : "video", url: p.url, seguro: false });
            }
            if (json.audio) midias.push({ tipo: "audio", url: json.audio, seguro: false });
        }

        return { ok: midias.length > 0, titulo: json.filename || "download", midias };
    }
};
