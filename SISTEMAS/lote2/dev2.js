const TABELA = {
    jsonformatar: async (ctx) => {
        if (!ctx.q) { await ctx.reply(`manda o json! ex: ${ctx.prefix}jsonformatar {"a":1}`); return; }
        try {
            const obj = JSON.parse(ctx.q);
            await ctx.reply("```" + JSON.stringify(obj, null, 2) + "```");
        } catch {
            await ctx.reply("❌ isso não é um JSON válido!");
        }
    },
    jsonvalidar: async (ctx) => {
        if (!ctx.q) { await ctx.reply(`manda o json! ex: ${ctx.prefix}jsonvalidar {"a":1}`); return; }
        try {
            JSON.parse(ctx.q);
            await ctx.reply("✅ JSON válido!");
        } catch (err) {
            await ctx.reply(`❌ JSON inválido: ${err.message}`);
        }
    },
    gerarlorem: async (ctx) => {
        const base = ["lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt", "ut labore et dolore magna aliqua", "ut enim ad minim veniam", "quis nostrud exercitation ullamco"];
        const n = Math.min(parseInt(ctx.args[0], 10) || 3, 10);
        const partes = [];
        for (let i = 0; i < n; i++) partes.push(base[i % base.length]);
        await ctx.reply(partes.join(", ") + ".");
    },
    ordenarlinhas: async (ctx) => {
        if (!ctx.q) { await ctx.reply(`manda as linhas separadas por vírgula! ex: ${ctx.prefix}ordenarlinhas banana, abacaxi, uva`); return; }
        const linhas = ctx.q.split(",").map(l => l.trim()).sort((a, b) => a.localeCompare(b, "pt-BR"));
        await ctx.reply(linhas.join("\n"));
    },
    numerarlinhas: async (ctx) => {
        if (!ctx.q) { await ctx.reply(`manda as linhas separadas por vírgula! ex: ${ctx.prefix}numerarlinhas banana, abacaxi, uva`); return; }
        const linhas = ctx.q.split(",").map(l => l.trim());
        await ctx.reply(linhas.map((l, i) => `${i + 1}. ${l}`).join("\n"));
    },
    removerduplicadas: async (ctx) => {
        if (!ctx.q) { await ctx.reply(`manda os itens separados por vírgula! ex: ${ctx.prefix}removerduplicadas banana, uva, banana`); return; }
        const itens = ctx.q.split(",").map(l => l.trim());
        const unicos = [...new Set(itens)];
        await ctx.reply(unicos.join(", "));
    }
};

module.exports = { TABELA };
