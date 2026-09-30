// Toda resposta comum passa por aqui. Links, comandos, menções e textos
// técnicos são preservados para continuarem copiáveis e funcionais.

const config = require("../config.json");
const { miudo } = require("./texto.js");

const AZUIS = ["💙", "🩵", "🔵", "💎", "🫐", "🌊", "🌀", "💠", "🧿", "🐬", "🐳", "🐋", "🐟", "🦋", "❄️", "🌐", "🛜"];
const SIMBOLOS = ["𓆩", "𓆪", "𓇼", "𓆝", "𓆟", "𓆞", "𓂃", "𓈒", "𓏸", "୨୧", "꒰", "꒱", "⊹", "˚", "₊", "‧", "✦", "✧", "⋆", "｡", "°", "❍", "༄", "ᯓ★", "࿐", "𐙚"];
const JA_DECORADO = /(?:╭─|╭────|┌─「|𓆩|⊹˚₊|‧₊˚|┄┄┄|˚₊‧꒰)/;
const NAO_DECORAR = /^(?:https?:\/\/\S+|[=#!./][a-z0-9_-]+)$/i;

function tipoDaMensagem(texto) {
    const t = String(texto || "").toLowerCase();
    if (/^(?:❌|erro|deu ruim|não consegui|nao consegui|falhou|inválid)/.test(t)) return { emoji: "🫧", titulo: "ops" };
    if (/^(?:✅|pronto|sucesso|feito|ativad|adicionad|salv)/.test(t)) return { emoji: "💎", titulo: "feito" };
    if (/^(?:⚠️|aviso|atenção|atencao|cuidado)/.test(t)) return { emoji: "🧿", titulo: "atenção" };
    if (/^(?:⏳|aguarde|carreg|buscando|baixando|processando)/.test(t)) return { emoji: "🌊", titulo: "processando" };
    return { emoji: "🩵", titulo: config.nome || "system nejire" };
}

function linhasMiudas(texto) {
    return String(texto).split("\n").map(linha => {
        // Linhas com URL, comando ou dado técnico ficam intactas.
        if (/https?:\/\/|@[0-9]{5,}|[`]/.test(linha) || /(?:^|\s)[=#!./][a-z0-9_-]+/i.test(linha)) return linha;
        return miudo(linha);
    }).join("\n");
}

function decorarTexto(texto, opcoes = {}) {
    if (config.decoracao?.ativa === false || opcoes.decorar === false) return String(texto ?? "");
    const original = String(texto ?? "").trim();
    if (!original || NAO_DECORAR.test(original) || JA_DECORADO.test(original)) return original;

    const { emoji, titulo } = tipoDaMensagem(original);
    const miudinho = config.decoracao?.fonteMiuda !== false ? linhasMiudas(original) : original;
    const topo = `╭─❍ 𓆩${emoji}𓆪 ⋆｡° ${miudo(titulo)} °｡⋆ ❍─╮`;
    const corpo = miudinho.split("\n").map(linha => linha ? `│  ${linha}` : "│").join("\n");
    const base = `╰─ 𓇼 𓂃𓈒𓏸 💙 𓏸𓈒𓂃 𓇼 ─╯`;
    return `${topo}\n${corpo}\n${base}`;
}

function decorarConteudo(content, opcoes = {}) {
    if (!content || typeof content !== "object") return content;
    if (content.react || content.delete || content.sticker || content.audio || content.poll || content.contacts || content.location) return content;

    const novo = { ...content };
    if (typeof novo.text === "string") novo.text = decorarTexto(novo.text, opcoes);
    if (typeof novo.caption === "string" && novo.caption.trim()) novo.caption = decorarTexto(novo.caption, opcoes);
    return novo;
}

module.exports = { AZUIS, SIMBOLOS, decorarTexto, decorarConteudo };
