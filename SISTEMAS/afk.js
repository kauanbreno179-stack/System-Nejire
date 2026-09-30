const path = require("path");
const db = require("../utils/db.js");

const DB_PATH = path.join(__dirname, "..", "database", "afk.json");
db.ensure(DB_PATH, {});

function marcarAfk(jid, motivo) {
    const all = db.read(DB_PATH, {});
    all[jid] = { motivo: motivo || "sem motivo", desde: Date.now() };
    db.write(DB_PATH, all);
}

function removerAfk(jid) {
    const all = db.read(DB_PATH, {});
    if (!all[jid]) return null;
    const registro = all[jid];
    delete all[jid];
    db.write(DB_PATH, all);
    return registro;
}

function obterAfk(jid) {
    const all = db.read(DB_PATH, {});
    return all[jid] || null;
}

module.exports = { marcarAfk, removerAfk, obterAfk };
