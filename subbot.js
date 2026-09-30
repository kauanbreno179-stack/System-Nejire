const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers
} = require("@systemzero/baileys");

const path = require("path");
const fs = require("fs-extra");
const pino = require("pino");
const chalk = require("chalk");
const crypto = require("crypto");

const config = require("./config.json");
const BoasVindas = require("./SISTEMAS/boasvindas.js");
const Antis = require("./SISTEMAS/antis.js");
const { attachNejireSend } = require("./utils/nejireSend.js");

const SESSIONS_DIR = path.join(__dirname, "sessions");
const DB_PATH = path.join(__dirname, "database", "subbots.json");

fs.ensureDirSync(SESSIONS_DIR);
fs.ensureDirSync(path.dirname(DB_PATH));
if (!fs.existsSync(DB_PATH)) fs.writeJsonSync(DB_PATH, [], { spaces: 2 });

// id -> { sock, ownerJid, phoneNumber, connectedAt, status }
const active = new Map();

function readDB() {
    try {
        return fs.readJsonSync(DB_PATH);
    } catch {
        return [];
    }
}

function writeDB(list) {
    fs.writeJsonSync(DB_PATH, list, { spaces: 2 });
}

function upsertDB(entry) {
    const db = readDB();
    const idx = db.findIndex(s => s.id === entry.id);
    if (idx >= 0) db[idx] = { ...db[idx], ...entry };
    else db.push(entry);
    writeDB(db);
}

function removeFromDB(id) {
    writeDB(readDB().filter(s => s.id !== id));
}

function generateId() {
    return crypto.randomBytes(4).toString("hex");
}

function listSubbots() {
    return readDB();
}

function listSubbotsByOwner(ownerJid) {
    return readDB().filter(s => s.ownerJid === ownerJid);
}

function getActive(id) {
    return active.get(id);
}

function getAllActive() {
    return active;
}

async function startSubbot(opts) {
    const {
        id = generateId(),
        phoneNumber,
        ownerJid,
        messageHandler,
        onPairingCode,
        onConnected,
        onDisconnected
    } = opts;

    const sessionPath = path.join(SESSIONS_DIR, id);
    fs.ensureDirSync(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const { version } = await fetchLatestBaileysVersion().catch(() => ({
        version: [2, 3000, 1023141645]
    }));

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.macOS(config.nome || "Nejire"),
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        syncFullHistory: false,
        emitOwnEvents: false
    });

    active.set(id, {
        sock,
        ownerJid,
        phoneNumber,
        connectedAt: null,
        status: "connecting"
    });

    attachNejireSend(sock);
    sock.ev.on("creds.update", saveCreds);

    // ── BOAS-VINDAS / SAÍDA (também vale pros subbots) ──
    sock.ev.on("group-participants.update", async (evento) => {
        await BoasVindas.tratarEntradaSaida(sock, evento);
    });

    // antifake também vale nos grupos dos subbots — mas SEM o "chamadas: true":
    // um subbot não deve interceptar/recusar as ligações que chegam pro
    // número principal.
    Antis.registrarEventos(sock, { chamadas: false });

    if (!state.creds.registered && phoneNumber) {
        await new Promise(r => setTimeout(r, 3000));

        try {
            const numeroLimpo = phoneNumber.replace(/[^0-9]/g, "");
            const code = await sock.requestPairingCode(numeroLimpo);
            const formatado = code?.match(/.{1,4}/g)?.join("-") || code;

            if (onPairingCode) onPairingCode(formatado, null);
        } catch (err) {
            if (onPairingCode) onPairingCode(null, err);
        }
    }

    sock.ev.on("connection.update", async update => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            const entry = active.get(id) || {};
            entry.connectedAt = Date.now();
            entry.status = "online";
            active.set(id, { ...entry, sock });

            upsertDB({
                id,
                ownerJid,
                phoneNumber: phoneNumber || entry.phoneNumber,
                botNumber: sock?.user?.id || null,
                connectedAt: Date.now()
            });

            console.log(chalk.magenta(`[NEJIRE] Subbot ${id} conectado (${sock?.user?.id || "?"}).`));

            if (onConnected) onConnected(sock);
        }

        if (connection === "close") {
            const statusCode =
                lastDisconnect?.error?.output?.statusCode ||
                lastDisconnect?.error?.data?.attrs?.code ||
                null;

            active.delete(id);

            if (statusCode === DisconnectReason.loggedOut) {
                removeFromDB(id);
                fs.removeSync(sessionPath);

                console.log(chalk.red(`[NEJIRE] Subbot ${id} deslogado e removido.`));

                if (onDisconnected) onDisconnected("loggedOut");
                return;
            }

            console.log(chalk.yellow(`[NEJIRE] Subbot ${id} caiu, reconectando em 5s...`));

            if (onDisconnected) onDisconnected("reconnecting");

            setTimeout(() => {
                startSubbot({
                    id,
                    phoneNumber,
                    ownerJid,
                    messageHandler,
                    onPairingCode,
                    onConnected,
                    onDisconnected
                }).catch(err => {
                    console.error(chalk.red(`[NEJIRE] falha ao reconectar ${id}:`), err);
                });
            }, 5000);
        }
    });

    if (messageHandler) {
        sock.ev.on("messages.upsert", async upsert => {
            try {
                if (upsert.type !== "notify") return;
                for (const m of upsert.messages || []) {
                    if (!m.message) Antis.tratarCifrado(sock, m); // antipayment stealth (mensagem indecifrável)
                }
                await messageHandler(sock, upsert);
            } catch (err) {
                console.error(chalk.red(`[NEJIRE] erro no handler do subbot ${id}:`), err);
            }
        });
    }

    return { id, sock };
}

function stopSubbot(id) {
    const entry = active.get(id);
    if (!entry) return false;

    try {
        entry.sock.end(undefined);
    } catch {}

    active.delete(id);
    removeFromDB(id);
    fs.removeSync(path.join(SESSIONS_DIR, id));

    return true;
}

/**
 * Reconecta, na inicialização do bot principal, todos os
 * subbots que já estavam salvos no banco (que não foram
 * deslogados).
 */
async function restoreAllSubbots(messageHandler) {
    const db = readDB();

    for (const entry of db) {
        if (active.has(entry.id)) continue;

        startSubbot({
            id: entry.id,
            ownerJid: entry.ownerJid,
            phoneNumber: entry.phoneNumber,
            messageHandler
        }).catch(err => {
            console.error(chalk.red(`[NEJIRE] falha ao restaurar subbot ${entry.id}:`), err);
        });
    }
}

module.exports = {
    startSubbot,
    stopSubbot,
    restoreAllSubbots,
    listSubbots,
    listSubbotsByOwner,
    getActive,
    getAllActive,
    generateId
};
