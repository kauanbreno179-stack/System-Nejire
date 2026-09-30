// MÓDULO: link direto de arquivo (mp3, mp4, jpg, pdf, zip...)
const Base = require("./base.js");

module.exports = {
    nome: "direto",
    descricao: "links diretos de arquivo (.mp3 .mp4 .jpg .pdf .zip ...)",
    ativo: () => true,

    aceita(url) {
        return Base.ehUrl(url) && !!Base.tipoPorExtensao(Base.extensao(url));
    },

    async resolver(url) {
        const ext = Base.extensao(url);
        const tipo = Base.tipoPorExtensao(ext);
        const nome = decodeURIComponent(new URL(url).pathname.split("/").pop() || `arquivo.${ext}`);

        return { ok: true, titulo: nome, midias: [{ tipo, url, nome, mime: Base.MIME_POR_EXT[ext] }] };
    }
};
