const Base = require("./base.js");

const MODULOS = [
    require("./tiktok.js"),
    require("./direto.js"),
    require("./lopesapi.js"),
    require("./cobalt.js"),
    require("./pagina.js")
];

function listar() {
    return MODULOS.map(m => ({ nome: m.nome, descricao: m.descricao, ativo: !!m.ativo() }));
}

async function resolver(url, { audio = false } = {}) {
    const erros = [];

    for (const m of MODULOS) {
        if (!m.ativo() || !m.aceita(url)) continue;

        try {
            const r = await m.resolver(url, { audio });
            if (r?.ok && r.midias?.length) return { ...r, modulo: m.nome };
            erros.push(`${m.nome}: sem resultado`);
        } catch (err) {
            erros.push(`${m.nome}: ${err.message}`);
        }
    }

    return { ok: false, erro: erros.length ? erros.join(" | ") : "nenhum módulo reconhece esse link" };
}

module.exports = { MODULOS, listar, resolver, Base };
