const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");
const config = require("../config.json");

const { getPerfil, salvarPerfil } = require("./perfil.js");
const db = require("../utils/db.js");

const DB_USUARIOS = path.join(__dirname, "..", "database", "usuarios.json");

// ── PERFIL/ECONOMIA (ajustes manuais do dono) ────────────
function definirSaldo(jid, valor) {
    return salvarPerfil(jid, { saldo: Math.max(0, Math.floor(valor)) });
}

function definirXp(jid, valor) {
    return salvarPerfil(jid, { xp: Math.max(0, Math.floor(valor)) });
}

function resetarUsuario(jid) {
    const all = db.read(DB_USUARIOS, {});
    delete all[jid];
    db.write(DB_USUARIOS, all);
    return getPerfil(jid);
}

function zerarRanking() {
    const all = db.read(DB_USUARIOS, {});
    for (const jid of Object.keys(all)) {
        all[jid].pontosCuriosidade = 0;
    }
    db.write(DB_USUARIOS, all);
    return Object.keys(all).length;
}

function listarUsuarios(limite = 15) {
    const all = db.read(DB_USUARIOS, {});
    const entradas = Object.entries(all)
        .sort((a, b) => (b[1].ultimaVez || 0) - (a[1].ultimaVez || 0))
        .slice(0, limite);
    return { total: Object.keys(all).length, recentes: entradas };
}

function listarTodosJids() {
    const all = db.read(DB_USUARIOS, {});
    return Object.keys(all);
}

function exportarResumoUsuarios() {
    const all = db.read(DB_USUARIOS, {});
    const entradas = Object.entries(all).map(([jid, p]) => ({ jid, ...p }));

    const topSaldo = [...entradas].sort((a, b) => (b.saldo || 0) - (a.saldo || 0)).slice(0, 5);
    const topXp = [...entradas].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
    const totalSaldo = entradas.reduce((acc, u) => acc + (u.saldo || 0), 0);
    const totalXp = entradas.reduce((acc, u) => acc + (u.xp || 0), 0);

    return { total: entradas.length, totalSaldo, totalXp, topSaldo, topXp };
}

// ── CONFIG (ajustes gerais salvos em config.json) ────────
function _salvarConfig() {
    fs.writeJsonSync(CONFIG_PATH, config, { spaces: 4 });
}

function definirDailyMin(valor) {
    config.economia = config.economia || {};
    config.economia.dailyMin = Math.max(0, Math.floor(valor));
    _salvarConfig();
    return config.economia.dailyMin;
}

function definirDailyMax(valor) {
    config.economia = config.economia || {};
    config.economia.dailyMax = Math.max(0, Math.floor(valor));
    _salvarConfig();
    return config.economia.dailyMax;
}

function definirMoedaNome(nome) {
    config.economia = config.economia || {};
    config.economia.moeda = nome;
    _salvarConfig();
    return config.economia.moeda;
}

function definirNumeroDono(numero) {
    config.numeroDono = numero.replace(/[^0-9]/g, "");
    _salvarConfig();
    return config.numeroDono;
}

function definirCanal(nome, url) {
    config.canal = config.canal || {};
    if (nome) config.canal.nome = nome;
    if (url) config.canal.url = url;
    _salvarConfig();
    return config.canal;
}

function definirVersao(versao) {
    config.versao = versao;
    _salvarConfig();
    return config.versao;
}

// ── ESTATÍSTICAS DO PROCESSO ──────────────────────────────
function statusProcesso() {
    const mem = process.memoryUsage();
    return {
        memoriaUsadaMb: (mem.rss / 1024 / 1024).toFixed(1),
        memoriaLivreMb: (os.freemem() / 1024 / 1024).toFixed(1),
        memoriaTotalMb: (os.totalmem() / 1024 / 1024).toFixed(1),
        nodeVersao: process.version,
        plataforma: `${os.platform()} ${os.arch()}`,
        uptimeProcessoSeg: Math.floor(process.uptime())
    };
}

module.exports = {
    definirSaldo,
    definirXp,
    resetarUsuario,
    zerarRanking,
    listarUsuarios,
    listarTodosJids,
    exportarResumoUsuarios,
    definirDailyMin,
    definirDailyMax,
    definirMoedaNome,
    definirNumeroDono,
    definirCanal,
    definirVersao,
    statusProcesso
};
