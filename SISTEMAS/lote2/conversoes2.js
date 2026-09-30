const { numeroValido, fmt, parConversao } = require("./_ajuda.js");

let TABELA = {};

// [cmdAtoB, cmdBtoA, labelA, labelB, quantosBem1A, casasDecimais]
const PARES = [
    ["cmparapolegada", "polegadaparacm", "cm", "polegadas", 0.393701, 3],
    ["mmparacm", "cmparamm", "mm", "cm", 0.1, 2],
    ["jardaparametro", "metroparajarda", "jardas", "metros", 0.9144, 3],
    ["peparapolegada", "polegadaparape", "pés", "polegadas", 12, 2],
    ["lbparaonca", "oncaparalb", "libras", "onças", 16, 2],
    ["toneladaparakg", "kgparatonelada", "toneladas", "kg", 1000, 2],
    ["xicaraparaml", "mlparaxicara", "xícaras", "ml", 236.588, 2],
    ["colherparaml", "mlparacolher", "colheres de sopa", "ml", 14.7868, 2],
    ["colherchaparaml", "mlparacolhercha", "colheres de chá", "ml", 4.92892, 2],
    ["oncaflparalitro", "litroparaoncafl", "onças fluidas", "litros", 0.0295735, 4],
    ["m2parahectare", "hectareparam2", "m²", "hectares", 0.0001, 6],
    ["m2paraacre", "acreparam2", "m²", "acres", 0.000247105, 6],
    ["km2parahectare", "hectareparakm2", "km²", "hectares", 100, 2],
    ["msparakmh", "kmhparams", "m/s", "km/h", 3.6, 2],
    ["noparakmh", "kmhparano", "nós", "km/h", 1.852, 2],
    ["bitparabyte", "byteparabit", "bits", "bytes", 0.125, 3],
    ["byteparakb", "kbparabyte", "bytes", "kb", 1 / 1024, 6],
    ["kbparamb", "mbparakb", "kb", "mb", 1 / 1024, 6],
    ["mbparagb", "gbparamb", "mb", "gb", 1 / 1024, 6],
    ["gbparatb", "tbparagb", "gb", "tb", 1 / 1024, 6],
    ["diaparahora", "horaparadia", "dias", "horas", 24, 2],
    ["semanaparadia", "diaparasemana", "semanas", "dias", 7, 2],
    ["mesparadia", "diaparames", "meses", "dias", 30, 2],
    ["anoparadia", "diaparaano", "anos", "dias", 365, 2],
    ["anoparames", "mesparaano", "anos", "meses", 12, 2],
    ["barparaatm", "atmparabar", "bar", "atm", 0.986923, 4],
    ["barparapsi", "psiparabar", "bar", "psi", 14.5038, 3],
    ["atmparapsi", "psiparaatm", "atm", "psi", 14.6959, 3],
    ["joulesparacalorias", "caloriasparajoules", "joules", "calorias", 0.239006, 3],
    ["kwhparajoules", "joulesparakwh", "kwh", "joules", 3600000, 0],
    ["caloriasparakcal", "kcalparacalorias", "calorias", "kcal", 0.001, 4],
    ["wattparacv", "cvparawatt", "watts", "cv", 0.00135962, 5],
    ["wattparahp", "hpparawatt", "watts", "hp", 0.00134102, 5],
    ["kwparahp", "hpparakw", "kw", "hp", 1.34102, 3],
    ["kmlparampg", "mpgparakml", "km/l", "mpg", 2.35215, 2]
];

for (const [a, b, la, lb, fator, casas] of PARES) {
    TABELA = { ...TABELA, ...parConversao(a, b, la, lb, fator, casas) };
}

TABELA.milhaparakm = async (ctx) => {
    const n = numeroValido(ctx.args[0]);
    if (n === null) { await ctx.reply(`manda o valor em milhas! ex: ${ctx.prefix}milhaparakm 5`); return; }
    await ctx.reply(`🔁 ${fmt(n)} milhas = *${fmt(n * 1.60934)} km*`);
};

TABELA.celsiusparakelvin = async (ctx) => {
    const n = numeroValido(ctx.args[0]);
    if (n === null) { await ctx.reply(`manda a temperatura em °C! ex: ${ctx.prefix}celsiusparakelvin 25`); return; }
    await ctx.reply(`🌡️ ${fmt(n)}°C = *${fmt(n + 273.15)} K*`);
};
TABELA.kelvinparacelsius = async (ctx) => {
    const n = numeroValido(ctx.args[0]);
    if (n === null) { await ctx.reply(`manda a temperatura em K! ex: ${ctx.prefix}kelvinparacelsius 300`); return; }
    await ctx.reply(`🌡️ ${fmt(n)} K = *${fmt(n - 273.15)}°C*`);
};
TABELA.fahrenheitparakelvin = async (ctx) => {
    const n = numeroValido(ctx.args[0]);
    if (n === null) { await ctx.reply(`manda a temperatura em °F! ex: ${ctx.prefix}fahrenheitparakelvin 70`); return; }
    await ctx.reply(`🌡️ ${fmt(n)}°F = *${fmt((n - 32) * 5 / 9 + 273.15)} K*`);
};
TABELA.kelvinparafahrenheit = async (ctx) => {
    const n = numeroValido(ctx.args[0]);
    if (n === null) { await ctx.reply(`manda a temperatura em K! ex: ${ctx.prefix}kelvinparafahrenheit 300`); return; }
    await ctx.reply(`🌡️ ${fmt(n)} K = *${fmt((n - 273.15) * 9 / 5 + 32)}°F*`);
};

module.exports = { TABELA };
