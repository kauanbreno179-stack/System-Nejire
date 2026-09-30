const {
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto,
} = require("@systemzero/baileys");

const config = require("../config.json");
const { usarBotoes } = require("../utils/device.js");
const { resolverSender } = require("../utils/jid.js");

function botaoUrl(texto, url) {
    return {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: texto,
            url,
            merchant_url: url
        })
    };
}

function botaoLista(tituloBotao, secoes) {
    return {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
            title: tituloBotao,
            sections: secoes.map(s => ({
                title: s.titulo,
                rows: s.linhas.map(l => ({
                    title: l.titulo,
                    description: l.descricao || "",
                    id: l.id
                }))
            }))
        })
    };
}

function botaoCanal() {
    const canal = config.canal;
    if (!canal?.url) return null;
    return botaoUrl(canal.nome || "𐙚ࣻࣻ༄ᶜʰᵃⁿⁿᵉˡ ⁿᵃʲⁱʳᵉ ⊹𓅗⊹", canal.url);
}

function contextInfoCanal() {
    const canal = config.canal;
    if (!canal?.id) return {};
    return {
        contextInfo: {
            isForwarded: true,
            forwardingScore: 9001,
            forwardedNewsletterMessageInfo: {
                newsletterJid: canal.id,
                newsletterName: canal.nome || "Canal Oficial",
                serverMessageId: 1
            }
        }
    };
}

function renderBotaoTexto(botao) {
    try {
        const dados = JSON.parse(botao.buttonParamsJson || "{}");
        switch (botao.name) {
            case "cta_url":
                return `▸ ${dados.display_text}: ${dados.url}`;
            case "cta_copy":
                return `▸ ${dados.display_text}: ${dados.copy_code}`;
            case "cta_call":
                return `▸ ${dados.display_text}: ${dados.phone_number}`;
            case "quick_reply":
                return `▸ ${dados.display_text} (manda: ${dados.id})`;
            case "single_select": {
                const linhas = (dados.sections || [])
                    .flatMap(s => s.rows || [])
                    .map(r => `   ▹ ${r.title}${r.description ? ` — ${r.description}` : ""}`)
                    .join("\n");
                return `▸ *${dados.title}*\n${linhas}`;
            }
            default:
                return `▸ ${dados.display_text || botao.name}`;
        }
    } catch {
        return null;
    }
}

async function enviarInteligente(conn, jid, info, opcoes = {}) {
    const {
        texto = "",
        footer = "",
        imagem = null,
        secoes = null,
        tituloBotao = "🐚 Ver opções 🫐",
        comCanal = true,
        extraBotoes = []
    } = opcoes;

    const isGroup = String(jid || "").endsWith("@g.us");
    const sender = resolverSender(info, isGroup, jid) || info?.key?.remoteJid || jid;
    const temAlgumBotao = (secoes && secoes.length) || (extraBotoes && extraBotoes.length);
    const deveUsarBotao = usarBotoes(sender, info) && temAlgumBotao;

    if (deveUsarBotao) {
        try {
            const buttons = [...extraBotoes];
            if (secoes && secoes.length) buttons.push(botaoLista(tituloBotao, secoes));
            if (comCanal) {
                const canal = botaoCanal();
                if (canal) buttons.push(canal);
            }

            const conteudo = {
                interactiveMessage: {
                    title: texto,
                    footer,
                    ...(imagem ? { image: imagem } : {}),
                    ...contextInfoCanal(),
                    nativeFlowMessage: { buttons }
                }
            };

            return await conn.sendMessage(jid, conteudo, { quoted: info });
        } catch (err) {
            console.error("[NEJIRE] falha ao enviar botões, caindo pro texto puro:", err?.message || err);
        
        }
    }

    let corpo = texto;

    if (secoes && secoes.length) {
        corpo += "\n\n" + secoes.map(s => {
            const linhas = s.linhas.map(l => `▸ ${l.titulo}${l.descricao ? ` — ${l.descricao}` : ""}`).join("\n");
            return `*${s.titulo}*\n${linhas}`;
        }).join("\n\n");
    }

    if (extraBotoes && extraBotoes.length) {
        const linhasExtra = extraBotoes.map(renderBotaoTexto).filter(Boolean).join("\n");
        if (linhasExtra) corpo += "\n\n" + linhasExtra;
    }

    if (footer) corpo += `\n\n${footer}`;

    if (imagem) {
        return conn.sendMessage(jid, { image: imagem, caption: corpo, ...contextInfoCanal() }, { quoted: info });
    }

    return conn.sendMessage(jid, { text: corpo, ...contextInfoCanal() }, { quoted: info });
}

async function enviarMenuHD(conn, jid, info, opcoes = {}) {
    const {
        texto = "",
        footer = "",
        imagemBuffer = null,
        secoes = [],
        tituloBotao = "🐚 abrir menu 🫐",
    } = opcoes;

    const isGroup = String(jid || "").endsWith("@g.us");
    const sender = resolverSender(info, isGroup, jid) || info?.key?.remoteJid || jid;

    if (!usarBotoes(sender, info) || !imagemBuffer) {
        return enviarInteligente(conn, jid, info, {
            texto,
            footer,
            imagem: imagemBuffer,
            secoes,
            tituloBotao,
            comCanal: true
        });
    }

    try {
        const media = await prepareWAMessageMedia(
            { image: imagemBuffer },
            { upload: conn.waUploadToServer }
        );

        const botoes = [botaoLista(tituloBotao, secoes)];
        const canal = botaoCanal();
        if (canal) botoes.push(canal);

        const nativeFlowConfig = { buttons: botoes };
        if (botoes.length > 2) {
            nativeFlowConfig.messageParamsJson = JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 2,
                    divider_indices: [1],
                    list_title: "🌊 mais opções",
                    button_title: "ver tudo"
                }
            });
        }

        const conteudo = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        header: proto.Message.InteractiveMessage.Header.create({
                            ...media,
                            hasMediaAttachment: true,
                        }),
                        body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
                        ...contextInfoCanal(),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(nativeFlowConfig),
                    })
                }
            }
        };

        const msg = generateWAMessageFromContent(jid, conteudo, {
            quoted: info,
            userJid: conn.user.id
        });

        return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    } catch (err) {
        console.error("[NEJIRE] falha ao enviar menu em HD, caindo pro texto puro:", err?.message || err);
        return enviarInteligente(conn, jid, info, {
            texto,
            footer,
            imagem: imagemBuffer,
            secoes,
            tituloBotao,
            comCanal: true
        });
    }
}


function botaoCtaUrl(texto, url) {

    return {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({ display_text: texto, url })
    };
}

function botaoWebview(titulo, url) {
    return {
        name: "cta_webview",
        buttonParamsJson: JSON.stringify({ title: titulo, url })
    };
}

function botaoQuickReply(texto, id) {
    return {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: texto, id })
    };
}

function botaoCopiar(texto, codigo) {
    return {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({ display_text: texto, copy_code: codigo })
    };
}

function botaoListaZero(tituloBotao, secoes) {
    return {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
            title: tituloBotao,
            sections: secoes.map(s => ({
                title: s.titulo,
                highlight_label: s.destaque,
                rows: s.linhas.map(l => ({
                    header: l.cabecalho,
                    title: l.titulo,
                    description: l.descricao || "",
                    id: l.id
                }))
            }))
        })
    };
}

async function enviarMenuNativo(conn, jid, info, opcoes = {}) {
    const {
        texto = "",
        footer = "",
        imagemBuffer = null,
        botoes = [],
        oferta = null,
        sheet = {},
        tap = null,
        fallback = null
    } = opcoes;

    try {
        if (!imagemBuffer) throw new Error("menu sem imagem");

        const media = await prepareWAMessageMedia(
            { image: imagemBuffer },
            { upload: conn.waUploadToServer }
        );

        if (media?.imageMessage) media.imageMessage.caption = texto;

        const divisores = Array.from({ length: Math.max(0, botoes.length - 2) }, (_, i) => i + 1);
        divisores.push(999);

        const params = {};
        if (oferta) params.limited_time_offer = oferta;
        params.bottom_sheet = {
            in_thread_buttons_limit: 2,
            divider_indices: divisores,
            list_title: sheet.list_title || "",
            button_title: sheet.button_title || ""
        };
        if (tap) params.tap_target_configuration = { ...tap, button_index: 0 };

        const contexto = { ...(contextInfoCanal().contextInfo || {}) };
        const pareado = proto?.ContextInfo?.PairedMediaType?.NOT_PAIRED_MEDIA;
        if (pareado !== undefined) contexto.pairedMediaType = pareado;

        const conteudo = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        header: proto.Message.InteractiveMessage.Header.create({
                            ...media,
                            hasMediaAttachment: true
                        }),
                        body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: botoes,
                            messageParamsJson: JSON.stringify(params)
                        }),
                        contextInfo: contexto
                    })
                }
            }
        };

        const msg = generateWAMessageFromContent(jid, conteudo, {
            quoted: info,
            userJid: conn.user.id
        });

        return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    } catch (err) {
        console.error("[NEJIRE] falha ao enviar o menu nativo:", err?.message || err);
        if (typeof fallback === "function") return fallback(err);
        throw err;
    }
}

module.exports = {
    botaoUrl,
    botaoCtaUrl,
    botaoWebview,
    botaoQuickReply,
    botaoCopiar,
    botaoListaZero,
    enviarMenuNativo,
    botaoLista,
    botaoCanal,
    contextInfoCanal,
    enviarInteligente,
    enviarMenuHD
};
