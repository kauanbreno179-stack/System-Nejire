const MAPA_SMALL_CAPS = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
    h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
    o: "ᴏ", p: "ᴩ", q: "ᑫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ",
    v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

function pequeno(txt = "") {
    return String(txt)
        .toLowerCase()
        .split("")
        .map(c => MAPA_SMALL_CAPS[c] || c)
        .join("");
}


const MAPA_CAPS_ZERO = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
    h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
    o: "ᴏ", p: "ᴘ", q: "q", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ",
    v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

const LIGACOES = new Set(["de", "do", "da", "dos", "das", "e", "ou", "em", "no", "na", "a", "o", "as", "os"]);

function semAcento(txt = "") {
    return String(txt).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function miudo(txt = "") {
    return semAcento(txt)
        .toLowerCase()
        .split("")
        .map(c => MAPA_CAPS_ZERO[c] || c)
        .join("");
}

function titular(txt = "") {
    return semAcento(txt)
        .split(/(\s+)/)
        .map(parte => {
            if (!parte.trim()) return parte;
            const baixo = parte.toLowerCase();
            if (LIGACOES.has(baixo)) return miudo(baixo);
            return baixo[0].toUpperCase() + miudo(baixo.slice(1));
        })
        .join("");
}

function frase(txt = "") {
    const limpo = semAcento(txt).toLowerCase();
    if (!limpo) return "";
    return limpo[0].toUpperCase() + miudo(limpo.slice(1));
}

const LINHA = "𓆝  ⋆｡°  𓆝  ⋆｡°  𓆝";
const ESTRELAS = "*⋆⋆*";

function tituloCategoria(emoji, nome) {
    return `┌─「 ${emoji} ${ESTRELAS} ${pequeno(nome)} ${ESTRELAS} 」─┄┄`;
}

function linhaComando(prefix, cmd, desc) {
    return `│ ✧ ${prefix}${cmd}\n│   ${desc}`;
}

function fecharCategoria() {
    return "└┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄";
}

function moldura(titulo) {
    return {
        abrir: `╭─❍ ⋆⋆ ${pequeno(titulo)} ⋆⋆ ❍─╮`,
        fechar: `╰${"─".repeat(Math.max(6, titulo.length))}╯`
    };
}

module.exports = {
    pequeno,
    miudo,
    titular,
    frase,
    LINHA,
    ESTRELAS,
    tituloCategoria,
    linhaComando,
    fecharCategoria,
    moldura
};
