require("./autoinstall.js");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getBestWaVersion,
    Browsers
} = require("@systemzero/baileys");

const pino = require("pino");
const chalk = require("chalk");
const path = require("path");
const readline = require("readline");
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");

const config = require("./config.json");
const NejireSubbot = require("./subbot.js");
const BoasVindas = require("./SISTEMAS/boasvindas.js");
const Antis = require("./SISTEMAS/antis.js");
const DonoExtra = require("./SISTEMAS/donoextra.js");
const { attachNejireSend } = require("./utils/nejireSend.js");

// handler (index.js, com todos os comandos)
const handler = require("./index.js");

// mini app de pesca (html + api) — sobe uma vez, independe do socket
if (config.webapp?.habilitado) {
    try {
        require("./webapp/server.js").iniciarPainelPesca(config.webapp.porta);
    } catch (err) {
        console.error("[NEJIRE] não consegui subir a mini app de pesca:", err?.message || err);
    }
}

const SESSION_PATH = path.join(__dirname, "sessions", "main");
fs.ensureDirSync(SESSION_PATH);

let currentSocket = null;
let isReconnecting = false;

// ----------------------------------------------------------
// Store simples em memória, para o getMessage funcionar
// ----------------------------------------------------------
const store = {
    messages: {},
    bind(ev) {
        ev.on("messages.upsert", ({ messages }) => {
            for (const msg of messages) {
                if (!msg.key?.remoteJid) continue;
                store.messages[msg.key.remoteJid] ??= {};
                store.messages[msg.key.remoteJid][msg.key.id] = msg;
            }
        });
    },
    loadMessage: async (jid, id) => store.messages[jid]?.[id] || null
};

process.on("unhandledRejection", (reason) => {
    console.error(chalk.red("⚠️ Unhandled Rejection:"), reason);
});

process.on("uncaughtException", (err) => {
    console.error(chalk.red("⚠️ Uncaught Exception:"), err);
});

function question(texto) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(texto, resposta => {
            rl.close();
            resolve(resposta);
        });
    });
}

async function startNejire() {
    if (isReconnecting) return;
    isReconnecting = true;

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const { version, isLatest, source } = await getBestWaVersion();

    console.log(chalk.cyan(`\n💠 ${config.nome} — versão ${config.versao}`));
    console.log(chalk.cyan(`Baileys v${version.join(".")} (fonte: ${source}, latest: ${isLatest})\n`));

    const nejireSocket = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        qrTimeout: 180000,
        logger: pino({ level: "silent" }),
        // CRÍTICO para pareamento por código: usar identidade de browser
        // reconhecida (Chrome), não o nome customizado do bot — nome fora
        // do padrão faz o WhatsApp recusar a confirmação do pairing code
        // mesmo com o código correto digitado a tempo.
        browser: Browsers.macOS("Chrome"),
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 25000,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        generateHighQualityLinkPreview: false,
        emitOwnEvents: false,
        getMessage: async (key) => {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined;
        },
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!message?.interactiveMessage;
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {}
                            },
                            ...message
                        }
                    }
                };
            }
            return message;
        }
    });

    currentSocket = nejireSocket;
    global.nejireSock = nejireSocket;
    attachNejireSend(nejireSocket);

    store.bind(nejireSocket.ev);
    nejireSocket.ev.on("creds.update", saveCreds);

    // antis do bot inteiro (antipv/anticall) — respeita o ×anticall (liga/desliga,
    // rejeitar/bloquear); por padrão já vem ligado, igual o comportamento antigo.
    // não interfere no listener que o comando playcall usa pra saber quando
    // alguém atende (chamadas em global.chamadasAtivas são ignoradas).
    Antis.registrarEventos(nejireSocket, { chamadas: true });

    nejireSocket.ev.on("group-participants.update", async (evento) => {
        await BoasVindas.tratarEntradaSaida(nejireSocket, evento);
    });

    // autobackup (×autobackup) — checa a cada 5min se já passou o intervalo
    // configurado e manda o zip no privado do dono
    DonoExtra.iniciarAgendador(() => currentSocket);

    if (!state.creds.registered) {
        console.log(chalk.yellow("📱 Modo pairing code ativado"));

        let numero = await question("Número da Nejire, com DDI e DDD: ");
        numero = numero.replace(/[^0-9]/g, "");

        if (!numero) {
            console.log(chalk.red("❌ Número inválido."));
            process.exit(1);
        }

        try {
            const code = await nejireSocket.requestPairingCode(numero);
            const codeFormatado = code?.match(/.{1,4}/g)?.join("-") || code;

            console.log(chalk.green(`\n🔑 Código de pareamento: ${codeFormatado}\n`));
            console.log(chalk.cyan("Abra o WhatsApp > Aparelhos conectados > Conectar um aparelho > Conectar com número de telefone, e digite o código acima em até 60 segundos.\n"));
        } catch (err) {
            console.error(chalk.red("❌ Erro ao gerar o código de pareamento:"), err);
        }
    }

    nejireSocket.ev.on("connection.update", async update => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log(chalk.green(`✅ ${config.nome} conectada!`));
            isReconnecting = false;

            NejireSubbot.restoreAllSubbots(handler).catch(err => {
                console.error(chalk.red("[NEJIRE] erro ao restaurar subbots:"), err);
            });
        }

        if (connection === "close") {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode || null;

            console.log(chalk.yellow("⚠️ Nejire desconectou."), "Status:", statusCode);

            if (statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red("❌ Sessão deslogada. Apague a pasta sessions/main para logar de novo."));
                isReconnecting = false;
                currentSocket = null;
                return;
            }

            if (statusCode === DisconnectReason.forbidden || statusCode === 403) {
                console.log(chalk.red("❌ Sessão revogada (403) pelo WhatsApp. Apague sessions/main e repareie."));
                isReconnecting = false;
                currentSocket = null;
                return;
            }

            if (statusCode === DisconnectReason.connectionReplaced) {
                console.log(chalk.red("⚠️ Conflito: outra sessão ativa no mesmo número. Encerrando."));
                isReconnecting = false;
                currentSocket = null;
                return;
            }

            currentSocket = null;

            if (statusCode === 405) {
                console.log(chalk.red("[ANTI-BAN] 405 (limite de taxa). Aguardando 60s antes de reconectar..."));
                isReconnecting = false;
                setTimeout(() => {
                    startNejire().catch(err => {
                        console.error(chalk.red("❌ Erro ao reiniciar:"), err);
                        isReconnecting = false;
                    });
                }, 60000);
                return;
            }

            isReconnecting = false;
            console.log(chalk.cyan("🔄 Reconectando..."));

            setTimeout(() => {
                startNejire().catch(err => {
                    console.error(chalk.red("❌ Erro ao reiniciar:"), err);
                    isReconnecting = false;
                });
            }, statusCode === DisconnectReason.restartRequired ? 0 : 5000);
        }
    });

    nejireSocket.ev.on("messages.upsert", async upsert => {
        try {
            if (upsert.type !== "notify") return;
            for (const m of upsert.messages || []) {
                if (!m.message) Antis.tratarCifrado(nejireSocket, m); // antipayment stealth (mensagem indecifrável)
            }
            await handler(nejireSocket, upsert);
        } catch (err) {
            console.error(chalk.red("❌ ERRO NO messages.upsert:"), err);
        }
    });

    return nejireSocket;
}

startNejire().catch(err => {
    console.error(chalk.red("❌ ERRO AO INICIAR A NEJIRE:"), err);
    process.exit(1);
});
