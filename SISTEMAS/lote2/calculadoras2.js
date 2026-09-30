const { numeroValido, fmt } = require("./_ajuda.js");

function pedirNumeros(ctx, qtd) {
    const ns = ctx.args.slice(0, qtd).map(numeroValido);
    if (ns.length < qtd || ns.some(n => n === null)) return null;
    return ns;
}

const TABELA = {
    areatriangulo: async (ctx) => {
        const ns = pedirNumeros(ctx, 2);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}areatriangulo <base> <altura>`); return; }
        await ctx.reply(`📐 área = *${fmt((ns[0] * ns[1]) / 2)}*`);
    },
    areacirculo: async (ctx) => {
        const ns = pedirNumeros(ctx, 1);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}areacirculo <raio>`); return; }
        await ctx.reply(`📐 área = *${fmt(Math.PI * ns[0] * ns[0])}*`);
    },
    areaquadrado: async (ctx) => {
        const ns = pedirNumeros(ctx, 1);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}areaquadrado <lado>`); return; }
        await ctx.reply(`📐 área = *${fmt(ns[0] * ns[0])}*`);
    },
    arearetangulo: async (ctx) => {
        const ns = pedirNumeros(ctx, 2);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}arearetangulo <largura> <altura>`); return; }
        await ctx.reply(`📐 área = *${fmt(ns[0] * ns[1])}*`);
    },
    perimetroretangulo: async (ctx) => {
        const ns = pedirNumeros(ctx, 2);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}perimetroretangulo <largura> <altura>`); return; }
        await ctx.reply(`📏 perímetro = *${fmt(2 * (ns[0] + ns[1]))}*`);
    },
    volumecubo: async (ctx) => {
        const ns = pedirNumeros(ctx, 1);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}volumecubo <lado>`); return; }
        await ctx.reply(`📦 volume = *${fmt(Math.pow(ns[0], 3))}*`);
    },
    volumeesfera: async (ctx) => {
        const ns = pedirNumeros(ctx, 1);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}volumeesfera <raio>`); return; }
        await ctx.reply(`🔮 volume = *${fmt((4 / 3) * Math.PI * Math.pow(ns[0], 3))}*`);
    },
    hipotenusa: async (ctx) => {
        const ns = pedirNumeros(ctx, 2);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}hipotenusa <cateto1> <cateto2>`); return; }
        await ctx.reply(`📐 hipotenusa = *${fmt(Math.sqrt(ns[0] * ns[0] + ns[1] * ns[1]))}*`);
    },
    jurossimples: async (ctx) => {
        const ns = pedirNumeros(ctx, 3);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}jurossimples <capital> <taxa%> <tempo>`); return; }
        const juros = ns[0] * (ns[1] / 100) * ns[2];
        await ctx.reply(`💰 juros = *${fmt(juros)}*\n💵 total = *${fmt(ns[0] + juros)}*`);
    },
    juroscompostos: async (ctx) => {
        const ns = pedirNumeros(ctx, 3);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}juroscompostos <capital> <taxa%> <tempo>`); return; }
        const total = ns[0] * Math.pow(1 + ns[1] / 100, ns[2]);
        await ctx.reply(`💰 juros = *${fmt(total - ns[0])}*\n💵 total = *${fmt(total)}*`);
    },
    gorjeta: async (ctx) => {
        const conta = numeroValido(ctx.args[0]);
        const perc = numeroValido(ctx.args[1]) ?? 10;
        if (conta === null) { await ctx.reply(`usa: ${ctx.prefix}gorjeta <valor da conta> [%]\nex: ${ctx.prefix}gorjeta 100 15`); return; }
        await ctx.reply(`🍽️ gorjeta de ${fmt(perc, 0)}% = *${fmt(conta * (perc / 100))}*\n💵 total = *${fmt(conta * (1 + perc / 100))}*`);
    },
    dividiraconta: async (ctx) => {
        const conta = numeroValido(ctx.args[0]);
        const pessoas = numeroValido(ctx.args[1]);
        if (conta === null || !pessoas) { await ctx.reply(`usa: ${ctx.prefix}dividiraconta <valor> <nº de pessoas>`); return; }
        await ctx.reply(`👥 cada pessoa paga *${fmt(conta / pessoas)}*`);
    },
    desconto: async (ctx) => {
        const valor = numeroValido(ctx.args[0]);
        const perc = numeroValido(ctx.args[1]);
        if (valor === null || perc === null) { await ctx.reply(`usa: ${ctx.prefix}desconto <valor> <%>`); return; }
        await ctx.reply(`🏷️ desconto = *${fmt(valor * (perc / 100))}*\n💵 valor final = *${fmt(valor * (1 - perc / 100))}*`);
    },
    aumentopercentual: async (ctx) => {
        const valor = numeroValido(ctx.args[0]);
        const perc = numeroValido(ctx.args[1]);
        if (valor === null || perc === null) { await ctx.reply(`usa: ${ctx.prefix}aumentopercentual <valor> <%>`); return; }
        await ctx.reply(`📈 valor final = *${fmt(valor * (1 + perc / 100))}*`);
    },
    media: async (ctx) => {
        const ns = ctx.args.map(numeroValido);
        if (!ns.length || ns.some(n => n === null)) { await ctx.reply(`usa: ${ctx.prefix}media <num1> <num2> ...`); return; }
        await ctx.reply(`📊 média = *${fmt(ns.reduce((a, b) => a + b, 0) / ns.length)}*`);
    },
    mediana: async (ctx) => {
        const ns = ctx.args.map(numeroValido);
        if (!ns.length || ns.some(n => n === null)) { await ctx.reply(`usa: ${ctx.prefix}mediana <num1> <num2> ...`); return; }
        const s = [...ns].sort((a, b) => a - b);
        const meio = Math.floor(s.length / 2);
        const m = s.length % 2 ? s[meio] : (s[meio - 1] + s[meio]) / 2;
        await ctx.reply(`📊 mediana = *${fmt(m)}*`);
    },
    moda: async (ctx) => {
        const ns = ctx.args.map(numeroValido);
        if (!ns.length || ns.some(n => n === null)) { await ctx.reply(`usa: ${ctx.prefix}moda <num1> <num2> ...`); return; }
        const cont = {};
        for (const n of ns) cont[n] = (cont[n] || 0) + 1;
        const max = Math.max(...Object.values(cont));
        const modas = Object.keys(cont).filter(k => cont[k] === max);
        await ctx.reply(max === 1 ? "📊 não tem moda (todos aparecem uma vez)" : `📊 moda = *${modas.join(", ")}*`);
    },
    fibonacci: async (ctx) => {
        const n = parseInt(ctx.args[0], 10);
        if (!n || n < 1 || n > 40) { await ctx.reply(`usa: ${ctx.prefix}fibonacci <quantidade até 40>`); return; }
        const seq = [0, 1];
        for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
        await ctx.reply(`🔢 ${seq.slice(0, n).join(", ")}`);
    },
    tempoviagem: async (ctx) => {
        const ns = pedirNumeros(ctx, 2);
        if (!ns) { await ctx.reply(`usa: ${ctx.prefix}tempoviagem <distância km> <velocidade km/h>`); return; }
        const horas = ns[0] / ns[1];
        const h = Math.floor(horas);
        const min = Math.round((horas - h) * 60);
        await ctx.reply(`🚗 tempo estimado = *${h}h${min}min*`);
    }
};

module.exports = { TABELA };
