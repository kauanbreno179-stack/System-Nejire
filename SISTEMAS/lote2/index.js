const Conversoes2 = require("./conversoes2.js");
const Texto2 = require("./texto2.js");
const Calculadoras2 = require("./calculadoras2.js");
const DataHora2 = require("./datahora2.js");
const Sorte2 = require("./sorte2.js");
const Zodiaco2 = require("./zodiaco2.js");
const SistemasNovos = require("./sistemasnovos.js");
const Dev2 = require("./dev2.js");
const GrupoInfo2 = require("./grupoinfo2.js");
const Geradores2 = require("./geradores2.js");

const MODULOS = {
    "conversões extras": Conversoes2,
    "texto extra": Texto2,
    "calculadoras extras": Calculadoras2,
    "data & hora extra": DataHora2,
    "sorte extra": Sorte2,
    "zodíaco extra": Zodiaco2,
    "sistemas novos": SistemasNovos,
    "dev extra": Dev2,
    "grupo info extra": GrupoInfo2,
    "geradores extra": Geradores2
};

const TABELA = {};
const NOMES_POR_CATEGORIA = {};
for (const [categoria, modulo] of Object.entries(MODULOS)) {
    NOMES_POR_CATEGORIA[categoria] = Object.keys(modulo.TABELA);
    Object.assign(TABELA, modulo.TABELA);
}

const NOMES = new Set(Object.keys(TABELA));

function ehComandoNovo(command) {
    return NOMES.has(command);
}

async function tratar(ctx) {
    const fn = TABELA[ctx.command];
    if (!fn) return false;

    try {
        await fn(ctx);
    } catch (err) {
        console.error(`[lote2] erro em ${ctx.command}:`, err);
        try { await ctx.reply("❌ deu ruim aqui nesse comando, tenta de novo!"); } catch {}
    }
    return true;
}

module.exports = { tratar, ehComandoNovo, TABELA, NOMES_POR_CATEGORIA };
