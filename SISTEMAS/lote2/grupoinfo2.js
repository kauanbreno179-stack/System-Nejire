const TABELA = {
    totalmembros: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const meta = await ctx.conn.groupMetadata(ctx.from);
        await ctx.reply(`👥 esse grupo tem *${meta.participants.length}* membro(s)`);
    },
    totaladmins: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const meta = await ctx.conn.groupMetadata(ctx.from);
        const admins = meta.participants.filter(p => p.admin);
        await ctx.reply(`🛡️ esse grupo tem *${admins.length}* admin(s)`);
    },
    idgrupo: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        await ctx.reply(`🆔 id desse grupo: ${ctx.from}`);
    },
    donogrupo: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const meta = await ctx.conn.groupMetadata(ctx.from);
        await ctx.reply(meta.owner ? `👑 dono do grupo: @${meta.owner.split("@")[0]}` : "não consegui identificar o dono desse grupo (o whatsapp nem sempre informa).");
    },
    datacriacaogrupo: async (ctx) => {
        if (!(await ctx.exigirGrupo())) return;
        const meta = await ctx.conn.groupMetadata(ctx.from);
        if (!meta.creation) { await ctx.reply("não consegui achar a data de criação desse grupo."); return; }
        await ctx.reply(`📅 grupo criado em: ${new Date(meta.creation * 1000).toLocaleString("pt-BR")}`);
    }
};

module.exports = { TABELA };
