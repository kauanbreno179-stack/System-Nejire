const path = require("path");
const db = require("../utils/db.js");
const config = require("../config.json");

const DB_PATH = path.join(__dirname, "..", "database", "alugueis.json");
db.ensure(DB_PATH, {});

function listar() {
    return db.read(DB_PATH, {});
}

function status(alvoId) {
    const all = listar();
    const registro = all[alvoId];
    if (!registro) return null;

    if (Date.now() > registro.expiraEm) {
        delete all[alvoId];
        db.write(DB_PATH, all);
        return null;
    }

    return registro;
}

function estaAlugado(alvoId) {
    return !!status(alvoId);
}

function adicionar(alvoId, planoId, diasManual) {
    const plano = config.aluguel?.planos?.find(p => p.id === planoId);
    const dias = diasManual ?? plano?.dias ?? 30;

    const all = listar();
    const atual = all[alvoId];
    const baseTempo = atual && atual.expiraEm > Date.now() ? atual.expiraEm : Date.now();

    all[alvoId] = {
        plano: plano?.nome || planoId || "Aluguel",
        desde: atual?.desde || Date.now(),
        expiraEm: baseTempo + dias * 24 * 60 * 60 * 1000
    };

    db.write(DB_PATH, all);
    return all[alvoId];
}

function remover(alvoId) {
    const all = listar();
    if (!all[alvoId]) return false;
    delete all[alvoId];
    db.write(DB_PATH, all);
    return true;
}

function planosTexto(prefix) {
    const planos = config.aluguel?.planos || [];
    if (!planos.length) return "nenhum plano de aluguel configurado ainda.";

    return planos.map(p => `▸ ${p.nome} — ${p.dias} dias — ${p.preco}`).join("\n") +
        `\n\nfala com o dono pra fechar: ${prefix}addaluguel <numero/id do grupo> <id-do-plano>`;
}

module.exports = { listar, status, estaAlugado, adicionar, remover, planosTexto };
