const DADOS = {
    "áries": { pedra: "diamante", cor: "vermelho", planeta: "Marte", flor: "cravo" },
    "touro": { pedra: "esmeralda", cor: "verde", planeta: "Vênus", flor: "rosa" },
    "gêmeos": { pedra: "ágata", cor: "amarelo", planeta: "Mercúrio", flor: "lavanda" },
    "câncer": { pedra: "pérola", cor: "branco", planeta: "Lua", flor: "flor-de-lótus" },
    "leão": { pedra: "rubi", cor: "dourado", planeta: "Sol", flor: "girassol" },
    "virgem": { pedra: "safira", cor: "verde-escuro", planeta: "Mercúrio", flor: "margarida" },
    "libra": { pedra: "opala", cor: "rosa", planeta: "Vênus", flor: "rosa-branca" },
    "escorpião": { pedra: "topázio", cor: "vinho", planeta: "Plutão", flor: "crisântemo" },
    "sagitário": { pedra: "turquesa", cor: "azul", planeta: "Júpiter", flor: "narciso" },
    "capricórnio": { pedra: "granada", cor: "marrom", planeta: "Saturno", flor: "hera" },
    "aquário": { pedra: "ametista", cor: "roxo", planeta: "Urano", flor: "orquídea" },
    "peixes": { pedra: "água-marinha", cor: "azul-claro", planeta: "Netuno", flor: "amarílis" }
};

function buscar(ctx) {
    const nome = (ctx.q || "").toLowerCase().trim();
    return DADOS[nome] ? { nome, ...DADOS[nome] } : null;
}

function comandoBase(campo, emoji, rotulo) {
    return async (ctx) => {
        const d = buscar(ctx);
        if (!d) { await ctx.reply(`manda o nome do signo! ex: ${ctx.prefix}${ctx.command} leão`); return; }
        await ctx.reply(`${emoji} ${rotulo} de *${d.nome}*: *${d[campo]}*`);
    };
}

const TABELA = {
    pedranascimento: comandoBase("pedra", "💎", "pedra"),
    cordosigno: comandoBase("cor", "🎨", "cor"),
    planetaregente: comandoBase("planeta", "🪐", "planeta regente"),
    flordosigno: comandoBase("flor", "🌸", "flor")
};

module.exports = { TABELA };
