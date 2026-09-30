const path = require("path");
const db = require("../utils/db.js");
const config = require("../config.json");

const DB_PATH = path.join(__dirname, "..", "database", "vips.json");
db.ensure(DB_PATH, {});

function listar() {
    return db.read(DB_PATH, {});
}

function status(jid) {
    const all = listar();
    const registro = all[jid];
    if (!registro) return null;

    if (Date.now() > registro.expiraEm) {
        delete all[jid];
        db.write(DB_PATH, all);
        return null;
    }

    return registro;
}

function ehVip(jid) {
    return !!status(jid);
}

function adicionar(jid, planoId, diasManual) {
    const plano = config.vip?.planos?.find(p => p.id === planoId);
    const dias = diasManual ?? plano?.dias ?? 30;

    const all = listar();
    const atual = all[jid];
    const baseTempo = atual && atual.expiraEm > Date.now() ? atual.expiraEm : Date.now();

    all[jid] = {
        plano: plano?.nome || planoId || "VIP",
        desde: atual?.desde || Date.now(),
        expiraEm: baseTempo + dias * 24 * 60 * 60 * 1000
    };

    db.write(DB_PATH, all);
    return all[jid];
}

function remover(jid) {
    const all = listar();
    if (!all[jid]) return false;
    delete all[jid];
    db.write(DB_PATH, all);
    return true;
}

function planosTexto(prefix) {
    const planos = config.vip?.planos || [];
    if (!planos.length) return "nenhum plano de VIP configurado ainda.";

    return planos.map(p => `▸ ${p.nome} — ${p.dias} dias — ${p.preco}`).join("\n") +
        `\n\nfala com o dono pra ativar: ${prefix}addvip <numero> <id-do-plano>`;
}

module.exports = { listar, status, ehVip, adicionar, remover, planosTexto };
