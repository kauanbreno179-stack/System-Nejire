const path = require("path");
const db = require("./db.js");
const config = require("../config.json");

const DB_PATH = path.join(__dirname, "..", "database", "dispositivos.json");
db.ensure(DB_PATH, {});

function heuristicaPorId(id = "") {
    const limpo = String(id || "").toUpperCase();

    if (/^3EB3/.test(limpo)) return "iphone";
    if (/^3EB0/.test(limpo)) return "web";
    if (/^3A/.test(limpo) || /^[0-9A-F]{18,20}$/.test(limpo)) return "android";

    return "desconhecido";
}

function fixarPlataforma(jid, modo) {
    const all = db.read(DB_PATH, {});
    if (modo === "auto") {
        delete all[jid];
    } else {
        all[jid] = modo;
    }
    db.write(DB_PATH, all);
}

function plataformaFixada(jid) {
    const all = db.read(DB_PATH, {});
    return all[jid] || null;
}

function usarBotoes(jid, info) {

    const fixado = plataformaFixada(jid);
    if (fixado === "android") return true;
    if (fixado === "iphone") return false;

    const padrao = config?.plataforma?.padrao || "auto";
    if (padrao === "android") return true;
    if (padrao === "iphone") return false;

    return false;
}

module.exports = {
    heuristicaPorId,
    fixarPlataforma,
    plataformaFixada,
    usarBotoes
};
