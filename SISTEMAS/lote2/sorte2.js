const { pick } = require("./_ajuda.js");

const EMOJIS = ["😀", "😎", "🥳", "😴", "🤖", "👻", "🐱", "🐶", "🦊", "🐸", "🍀", "🌟", "🔥", "💎", "🎲", "🎯", "🍕", "🍩", "🌈", "⚡"];
const SIGNOS = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];

function numeroPrimo() {
    const primos = [];
    for (let n = 2; n <= 500; n++) {
        let primo = true;
        for (let i = 2; i * i <= n; i++) if (n % i === 0) { primo = false; break; }
        if (primo) primos.push(n);
    }
    return pick(primos);
}

const TABELA = {
    sortearemoji: async (ctx) => {
        await ctx.reply(`🎲 seu emoji da sorte é: ${pick(EMOJIS)}`);
    },
    sortearsigno: async (ctx) => {
        await ctx.reply(`🎲 signo sorteado: *${pick(SIGNOS)}*`);
    },
    numeroprimoaleatorio: async (ctx) => {
        await ctx.reply(`🔢 número primo sorteado: *${numeroPrimo()}*`);
    }
};

module.exports = { TABELA };
