const Minecraft = require("./minecraft.js");
const Vida = require("./vida.js");
const Miraculous = require("./miraculous.js");
const Fantasia = require("./fantasia.js");

const MODULOS = {
    "minecraft rpg": Minecraft,
    "simulador de vida": Vida,
    "miraculous rpg": Miraculous,
    "fantasia rpg": Fantasia
};

const TABELA = {};
const NOMES_POR_CATEGORIA = {};
for (const [categoria, modulo] of Object.entries(MODULOS)) {
    NOMES_POR_CATEGORIA[categoria] = Object.keys(modulo.TABELA);
    Object.assign(TABELA, modulo.TABELA);
}

TABELA.rpgs = async ({ reply, prefix }) => {
    const p = prefix || "#";
    await reply(
        `🎮 *RPGs DO NEJIRE* (${Object.keys(TABELA).length - 1} comandos)\n\n` +
        `⛏️ *Minecraft RPG* — ${p}mcajuda\n` +
        `🏙️ *Simulador de Vida* — ${p}vdajuda\n` +
        `🐞 *Miraculous RPG* — ${p}mrajuda\n` +
        `🐉 *Fantasia RPG* — ${p}faajuda\n\n` +
        `pra começar em qualquer um: ${p}mccomecar, ${p}vdcomecar, ${p}mrcomecar ou ${p}facomecar`
    );
};
NOMES_POR_CATEGORIA["rpgs"] = ["rpgs"];

const INFO_MENU = {
    "minecraft rpg": { emoji: "⛏️", pf: "mc", mod: Minecraft },
    "simulador de vida": { emoji: "🏙️", pf: "vd", mod: Vida },
    "miraculous rpg": { emoji: "🐞", pf: "mr", mod: Miraculous },
    "fantasia rpg": { emoji: "🐉", pf: "fa", mod: Fantasia }
};
const DESC_CMD = { comecar: "crie seu personagem", ajuda: "lista completa de comandos", rpgs: "todos os RPGs do bot" };
const CATEGORIAS_MENU = Object.entries(INFO_MENU).map(([nome, { emoji, pf, mod }]) => {
    const secoes = mod.SECOES.map((sec, i) => ({
        titulo: sec.t,
        comandos: [...(i === 0 ? ["rpgs"] : []), ...sec.c.map(c => pf + c)].map(cmd => ({ cmd, desc: DESC_CMD[cmd.replace(pf, "")] || DESC_CMD[cmd] || "" }))
    }));
    return { emoji, nome, cor: "💙", grupo: "rpg", secoes, comandos: secoes.flatMap(x => x.comandos), total: Object.keys(mod.TABELA).length };
});

const NOMES = new Set(Object.keys(TABELA));
const ehComandoNovo = (command) => NOMES.has(command);

async function tratar(ctx) {
    const fn = TABELA[ctx.command];
    if (!fn) return false;
    try {
        await fn(ctx);
    } catch (err) {
        console.error(`[lote3] erro em ${ctx.command}:`, err);
        try { await ctx.reply("❌ deu ruim aqui nesse comando, tenta de novo!"); } catch {}
    }
    return true;
}

module.exports = { tratar, ehComandoNovo, TABELA, NOMES_POR_CATEGORIA, CATEGORIAS_MENU };
