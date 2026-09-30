const chalk = require("chalk");
const { decorarConteudo } = require("./decoracao.js");

const ENVIO_ORIGINAL = Symbol.for("system-nejire.envio-original");

function attachNejireSend(sock) {
    if (!sock[ENVIO_ORIGINAL]) {
        sock[ENVIO_ORIGINAL] = sock.sendMessage.bind(sock);
        sock.sendMessage = async (jid, content, options = {}) => {
            const opcoesDecoracao = options?.nejireDecoracao || {};
            const opcoesEnvio = { ...options };
            delete opcoesEnvio.nejireDecoracao;
            return sock[ENVIO_ORIGINAL](jid, decorarConteudo(content, opcoesDecoracao), opcoesEnvio);
        };
    }

    sock.nejireSend = async (jid, content, options = {}) => {
        try {
            return await sock.sendMessage(jid, content, options);
        } catch (err) {
            console.error(chalk.red("[NEJIRE] erro no nejireSend:"), err?.message || err);
            return null;
        }
    };

    return sock;
}

module.exports = { attachNejireSend };
