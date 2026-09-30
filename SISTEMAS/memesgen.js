const LEGENDAS_MEME = [
    "quando você lembra que tem coisa pra fazer amanhã",
    "aquele momento em que finge que está tudo bem",
    "eu fingindo que entendi tudo",
    "ninguém: \n absolutamente ninguém: \n eu:",
    "quando o wifi cai no meio do vídeo",
    "esse sou eu segunda de manhã"
];

function gerarLegendaMeme() {
    return LEGENDAS_MEME[Math.floor(Math.random() * LEGENDAS_MEME.length)];
}

function gerarHashtags(tema = "") {
    const t = String(tema).trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "");
    if (!t) return null;
    const base = t.split(/\s+/).filter(Boolean);
    const extras = ["viral", "trend", "fy", "top", "instagood"];
    const tags = [...base, ...extras.slice(0, 3)].map(p => `#${p}`);
    return tags.join(" ");
}

module.exports = { gerarLegendaMeme, gerarHashtags };
