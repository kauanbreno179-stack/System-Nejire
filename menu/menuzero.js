const config = require("../config.json");
const { titular } = require("../utils/texto.js");
const {
    botaoCtaUrl,
    botaoWebview,
    botaoQuickReply,
    botaoCopiar,
    botaoListaZero
} = require("./botoes.js");
const {
    secoesZeroCategorias,
    secoesZeroMiniGames,
    textoMenuZero
} = require("./nejiremenu.js");

const CEM_DIAS_MS = 100 * 24 * 60 * 60 * 1000;

function montarMenuZero(prefix, extra = {}) {
    const { status = "user pobre", uptime = "", painelUrl = null } = extra;
    const canal = config.canal;
    const nomeBot = titular("system nejire");

    const botoes = [];

    if (canal?.url) {
        botoes.push(botaoCtaUrl(`𓏵 ˚₊ ${titular("canal oficial")} ₊˚ 𓏵`, canal.url));
    }

    botoes.push(botaoListaZero(`˗ˏˋ ${titular("menus de comandos")} ˎˊ˗ `, secoesZeroCategorias(prefix)));
    botoes.push(botaoListaZero(`ᯓ★ ${titular("mini games")}`, secoesZeroMiniGames(prefix)));
    botoes.push(botaoQuickReply(`⭑ ๋࣭ ˚₊ ${titular("alugar bot")} ₊˚ ๋࣭ ⭑`, `${prefix}alugar`));

    if (config.siteOficial) {
        botoes.push(botaoCtaUrl(`⭑ ๋࣭ ˚₊ ${titular("site oficial")} ₊˚ ๋࣭ ⭑`, config.siteOficial));
    }

    if (painelUrl) {
        const rotulo = `˗ˏˋ✴︎ ${titular("abrir painel")} ✴︎ˎˊ˗`;
        botoes.push(/^https:\/\//i.test(painelUrl)
            ? botaoWebview(rotulo, painelUrl)
            : botaoCtaUrl(rotulo, painelUrl));
    }

    botoes.push(botaoCopiar(`˖ ࣪⊹ ${titular("copiar prefixo")} [ ${prefix} ] ⊹࣪ ˖`, prefix));

    const urlBase = canal?.url || config.siteOficial || "https://whatsapp.com";
    let dominio = urlBase;
    try { dominio = new URL(urlBase).origin; } catch {}

    return {
        texto: textoMenuZero(prefix, { status, uptime }),
        footer: ` ݁.✦˖ 𓆩🩵𓆪 ${nomeBot} 𓆩🩵𓆪 ˖✦. ݁`,
        botoes,
        oferta: {
            text: ` ݁. ݁✦˖ ${config.nome} ݁˖.✦. ݁.`,
            url: urlBase,
            copy_code: `© ${config.nome}`,
            expiration_time: Date.now() + CEM_DIAS_MS
        },
        sheet: {
            list_title: `𓇼 🩵 ${nomeBot} 🩵 𓇼`,
            button_title: `˗ˏˋ ${titular("abrir opcoes")} ˎˊ˗`
        },
        tap: {
            title: `‧₊˚ ${config.nome} ˚₊‧`,
            description: `˖ ࣪⊹ ${titular("bot oficial")} ⊹࣪ ˖`,
            canonical_url: urlBase,
            domain: dominio
        }
    };
}

module.exports = { montarMenuZero };
