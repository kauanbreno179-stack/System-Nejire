const path = require("path");
const db = require("../utils/db.js");

const DB_PATH = path.join(__dirname, "..", "database", "moderacao.json");
db.ensure(DB_PATH, { grupos: {}, bloqueados: [] });

function _ler() {
    return db.read(DB_PATH, { grupos: {}, bloqueados: [] });
}

function _grupo(dados, groupId) {
    if (!dados.grupos[groupId]) {
        dados.grupos[groupId] = { mutados: [], avisos: {}, antiflood: false };
    }
    return dados.grupos[groupId];
}

function mutar(groupId, jid) {
    const dados = _ler();
    const g = _grupo(dados, groupId);
    if (!g.mutados.includes(jid)) g.mutados.push(jid);
    db.write(DB_PATH, dados);
}

function desmutar(groupId, jid) {
    const dados = _ler();
    const g = _grupo(dados, groupId);
    g.mutados = g.mutados.filter(j => j !== jid);
    db.write(DB_PATH, dados);
}

function estaMutado(groupId, jid) {
    const dados = _ler();
    return _grupo(dados, groupId).mutados.includes(jid);
}

const LIMITE_AVISOS = 3;

function darAviso(groupId, jid) {
    const dados = _ler();
    const g = _grupo(dados, groupId);
    g.avisos[jid] = (g.avisos[jid] || 0) + 1;
    db.write(DB_PATH, dados);
    return g.avisos[jid];
}

function verAvisos(groupId, jid) {
    const dados = _ler();
    return _grupo(dados, groupId).avisos[jid] || 0;
}

function resetarAvisos(groupId, jid) {
    const dados = _ler();
    const g = _grupo(dados, groupId);
    delete g.avisos[jid];
    db.write(DB_PATH, dados);
}

const JANELA_FLOOD_MS = 10000;
const LIMITE_FLOOD = 6;
const _memoriaFlood = {};

function definirAntiflood(groupId, ativo) {
    const dados = _ler();
    const g = _grupo(dados, groupId);
    g.antiflood = ativo;
    db.write(DB_PATH, dados);
}

function antifloodAtivo(groupId) {
    const dados = _ler();
    return !!_grupo(dados, groupId).antiflood;
}

function registrarMensagemFlood(groupId, jid) {
    const chave = `${groupId}:${jid}`;
    const agora = Date.now();
    const lista = (_memoriaFlood[chave] || []).filter(t => agora - t < JANELA_FLOOD_MS);
    lista.push(agora);
    _memoriaFlood[chave] = lista;
    return lista.length >= LIMITE_FLOOD;
}

function bloquear(jid) {
    const dados = _ler();
    if (!dados.bloqueados.includes(jid)) dados.bloqueados.push(jid);
    db.write(DB_PATH, dados);
}

function desbloquear(jid) {
    const dados = _ler();
    dados.bloqueados = dados.bloqueados.filter(j => j !== jid);
    db.write(DB_PATH, dados);
}

function estaBloqueado(jid) {
    const dados = _ler();
    return dados.bloqueados.includes(jid);
}

function listarBloqueados() {
    const dados = _ler();
    return dados.bloqueados;
}

function desbloquearTodos() {
    const dados = _ler();
    const total = dados.bloqueados.length;
    dados.bloqueados = [];
    db.write(DB_PATH, dados);
    return total;
}

function limparFlood() {
    for (const chave of Object.keys(_memoriaFlood)) delete _memoriaFlood[chave];
}

module.exports = {
    mutar, desmutar, estaMutado,
    darAviso, verAvisos, resetarAvisos, LIMITE_AVISOS,
    definirAntiflood, antifloodAtivo, registrarMensagemFlood,
    bloquear, desbloquear, estaBloqueado, listarBloqueados, desbloquearTodos, limparFlood
};
