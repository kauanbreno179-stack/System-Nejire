function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function numeroValido(v) {
    if (v === undefined || v === null || v === "") return null;
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
}

function fmt(n, casas = 2) {
    if (!Number.isFinite(n)) return "?";
    return Number(n.toFixed(casas)).toString().replace(".", ",");
}

function parConversao(cmdAtoB, cmdBtoA, labelA, labelB, umAemB, casas = 3) {
    return {
        [cmdAtoB]: async (ctx) => {
            const n = numeroValido(ctx.args[0]);
            if (n === null) { await ctx.reply(`manda o valor em ${labelA}! ex: ${ctx.prefix}${cmdAtoB} 10`); return; }
            await ctx.reply(`🔁 ${fmt(n)} ${labelA} = *${fmt(n * umAemB, casas)} ${labelB}*`);
        },
        [cmdBtoA]: async (ctx) => {
            const n = numeroValido(ctx.args[0]);
            if (n === null) { await ctx.reply(`manda o valor em ${labelB}! ex: ${ctx.prefix}${cmdBtoA} 10`); return; }
            await ctx.reply(`🔁 ${fmt(n)} ${labelB} = *${fmt(n / umAemB, casas)} ${labelA}*`);
        }
    };
}

module.exports = { pick, numeroValido, fmt, parConversao };
