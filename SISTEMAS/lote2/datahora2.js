function diasEntre(hoje, alvo) {
    if (alvo < hoje) alvo.setFullYear(alvo.getFullYear() + 1);
    return Math.ceil((alvo - hoje) / 86400000);
}

const TABELA = {
    quantofaltanatal: async (ctx) => {
        const hoje = new Date();
        const alvo = new Date(hoje.getFullYear(), 11, 25);
        await ctx.reply(`🎄 faltam *${diasEntre(hoje, alvo)}* dia(s) pro natal!`);
    },
    quantofaltaanonovo: async (ctx) => {
        const hoje = new Date();
        const alvo = new Date(hoje.getFullYear() + 1, 0, 1);
        await ctx.reply(`🎆 faltam *${diasEntre(hoje, alvo)}* dia(s) pro ano novo!`);
    },
    quantofaltapascoa: async (ctx) => {
        const hoje = new Date();
        const y = hoje.getFullYear();
        const a = y % 19, b = Math.floor(y / 100), c = y % 100;
        const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const mes = Math.floor((h + l - 7 * m + 114) / 31);
        const dia = ((h + l - 7 * m + 114) % 31) + 1;
        const alvo = new Date(y, mes - 1, dia);
        await ctx.reply(`🐣 faltam *${diasEntre(hoje, alvo)}* dia(s) pra páscoa!`);
    },
    quantofaltacarnaval: async (ctx) => {
        const hoje = new Date();
        const y = hoje.getFullYear();
        const a = y % 19, b = Math.floor(y / 100), c = y % 100;
        const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const mes = Math.floor((h + l - 7 * m + 114) / 31);
        const dia = ((h + l - 7 * m + 114) % 31) + 1;
        const pascoa = new Date(y, mes - 1, dia);
        const alvo = new Date(pascoa.getTime() - 47 * 86400000);
        await ctx.reply(`🎭 faltam *${diasEntre(hoje, alvo)}* dia(s) pro carnaval!`);
    },
    diadoano: async (ctx) => {
        const hoje = new Date();
        const inicio = new Date(hoje.getFullYear(), 0, 1);
        const dia = Math.ceil((hoje - inicio) / 86400000) + 1;
        await ctx.reply(`📅 hoje é o *${dia}º* dia do ano`);
    },
    idadeemminutos: async (ctx) => {
        const partes = (ctx.args[0] || "").split(/[\/\-]/);
        if (partes.length !== 3) { await ctx.reply(`manda sua data de nascimento! ex: ${ctx.prefix}idadeemminutos 15/06/2000`); return; }
        const [d, m, y] = partes.map(Number);
        const nasc = new Date(y, m - 1, d);
        if (isNaN(nasc.getTime())) { await ctx.reply("data inválida! usa dd/mm/aaaa"); return; }
        const min = Math.floor((Date.now() - nasc.getTime()) / 60000);
        await ctx.reply(`🎂 você já viveu *${min.toLocaleString("pt-BR")}* minutos!`);
    },
    idadeemsemanas: async (ctx) => {
        const partes = (ctx.args[0] || "").split(/[\/\-]/);
        if (partes.length !== 3) { await ctx.reply(`manda sua data de nascimento! ex: ${ctx.prefix}idadeemsemanas 15/06/2000`); return; }
        const [d, m, y] = partes.map(Number);
        const nasc = new Date(y, m - 1, d);
        if (isNaN(nasc.getTime())) { await ctx.reply("data inválida! usa dd/mm/aaaa"); return; }
        const semanas = Math.floor((Date.now() - nasc.getTime()) / (86400000 * 7));
        await ctx.reply(`🎂 você já viveu *${semanas.toLocaleString("pt-BR")}* semanas!`);
    },
    idadeemsegundos: async (ctx) => {
        const partes = (ctx.args[0] || "").split(/[\/\-]/);
        if (partes.length !== 3) { await ctx.reply(`manda sua data de nascimento! ex: ${ctx.prefix}idadeemsegundos 15/06/2000`); return; }
        const [d, m, y] = partes.map(Number);
        const nasc = new Date(y, m - 1, d);
        if (isNaN(nasc.getTime())) { await ctx.reply("data inválida! usa dd/mm/aaaa"); return; }
        const seg = Math.floor((Date.now() - nasc.getTime()) / 1000);
        await ctx.reply(`🎂 você já viveu *${seg.toLocaleString("pt-BR")}* segundos!`);
    }
};

module.exports = { TABELA };
