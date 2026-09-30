const { pequeno, miudo } = require("../../utils/texto.js");

function precisaTexto(ctx) {
    if (!ctx.q) return false;
    return true;
}

const TABELA = {
    textopequeno: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}textopequeno oi gente`); return; }
        await ctx.reply(pequeno(ctx.q));
    },

    textomiudo: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}textomiudo oi gente`); return; }
        await ctx.reply(miudo(ctx.q));
    },

    textoinvertido: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}textoinvertido oi gente`); return; }
        const palavras = ctx.q.split(" ").reverse();
        await ctx.reply(`🔄 ${palavras.join(" ")}`);
    },

    zalgo: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}zalgo oi gente`); return; }
        const marcas = ["\u0301", "\u0308", "\u0342", "\u0330", "\u0303", "\u0345"];
        const saida = ctx.q.split("").map(c => c + marcas[Math.floor(Math.random() * marcas.length)] + (Math.random() > 0.6 ? marcas[Math.floor(Math.random() * marcas.length)] : "")).join("");
        await ctx.reply(`👁️ ${saida}`);
    },

    vogais: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}vogais programação`); return; }
        const achadas = ctx.q.toLowerCase().match(/[aeiouáéíóúâêîôûãõ]/g) || [];
        await ctx.reply(achadas.length ? `🔤 vogais: *${achadas.join(", ")}*` : "não achei nenhuma vogal aí 🤔");
    },

    semvogais: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}semvogais programação`); return; }
        await ctx.reply(ctx.q.replace(/[aeiouáéíóúâêîôûãõAEIOUÁÉÍÓÚÂÊÎÔÛÃÕ]/g, ""));
    },

    contarmaiusculas: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}contarmaiusculas Texto AQUI`); return; }
        const n = (ctx.q.match(/[A-ZÁÉÍÓÚÂÊÎÔÛÃÕ]/g) || []).length;
        await ctx.reply(`🔠 *${n}* letra(s) maiúscula(s)`);
    },

    contarminusculas: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}contarminusculas Texto aqui`); return; }
        const n = (ctx.q.match(/[a-záéíóúâêîôûãõ]/g) || []).length;
        await ctx.reply(`🔡 *${n}* letra(s) minúscula(s)`);
    },

    contardigitos: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda o texto! ex: ${ctx.prefix}contardigitos abc123`); return; }
        const n = (ctx.q.match(/[0-9]/g) || []).length;
        await ctx.reply(`🔢 *${n}* dígito(s)`);
    },

    inverterpalavras: async (ctx) => {
        if (!precisaTexto(ctx)) { await ctx.reply(`manda a frase! ex: ${ctx.prefix}inverterpalavras bom dia pra você`); return; }
        await ctx.reply(ctx.q.split(" ").map(p => p.split("").reverse().join("")).join(" "));
    },

    comecacom: async (ctx) => {
        const [prefixoBuscado, ...resto] = ctx.args;
        const texto = resto.join(" ");
        if (!prefixoBuscado || !texto) { await ctx.reply(`usa: ${ctx.prefix}comecacom <prefixo> <texto>\nex: ${ctx.prefix}comecacom bom bom dia`); return; }
        const ok = texto.toLowerCase().startsWith(prefixoBuscado.toLowerCase());
        await ctx.reply(ok ? "✅ sim, começa com isso!" : "❌ não, não começa com isso.");
    },

    terminacom: async (ctx) => {
        const [sufixoBuscado, ...resto] = ctx.args;
        const texto = resto.join(" ");
        if (!sufixoBuscado || !texto) { await ctx.reply(`usa: ${ctx.prefix}terminacom <sufixo> <texto>\nex: ${ctx.prefix}terminacom dia bom dia`); return; }
        const ok = texto.toLowerCase().endsWith(sufixoBuscado.toLowerCase());
        await ctx.reply(ok ? "✅ sim, termina com isso!" : "❌ não, não termina com isso.");
    }
};

module.exports = { TABELA };
