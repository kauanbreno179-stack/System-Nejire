const path = require("path");
const fs = require("fs");
const db = require("../utils/db.js");
const Jid = require("../utils/jid.js");
const Tmp = require("../utils/tmp.js");
const config = require("../config.json");

const DB_PATH = path.join(__dirname, "..", "database", "donoextra.json");
const PADRAO = () => ({
    donos: [],
    cmdsOff: [],
    autoler: false,
    presenca: "off",
    autobackup: { horas: 0, ultimo: 0 },
    uso: {}
});

db.ensure(DB_PATH, PADRAO());

// ── BANCO
let _cache = null;
let _mtime = 0;

function _dados() {
    let m = 0;
    try { m = fs.statSync(DB_PATH).mtimeMs; } catch {}

    if (!_cache || m !== _mtime) {
        const bruto = db.read(DB_PATH, {}) || {};
        _cache = { ...PADRAO(), ...bruto, autobackup: { ...PADRAO().autobackup, ...(bruto.autobackup || {}) } };
        _mtime = m;
    }
    return _cache;
}

function _salvar() {
    db.write(DB_PATH, _cache);
    try { _mtime = fs.statSync(DB_PATH).mtimeMs; } catch {}
}

// ── 3. CO-DONOS ──────────────────────────────────────────
function listarDonos() {
    return [...(_dados().donos || [])];
}

function addDono(jidOuNumero) {
    const n = Jid.numero(jidOuNumero);
    if (n.length < 10 || n.length > 15) return { ok: false, motivo: "número inválido (use DDI + DDD + número)" };
    if (Jid.ehDonoPrincipal(n)) return { ok: false, motivo: "esse já é o dono principal" };

    const d = _dados();
    if (d.donos.includes(n)) return { ok: false, motivo: "essa pessoa já é co-dona" };
    if (d.donos.length >= 10) return { ok: false, motivo: "limite de 10 co-donos" };

    d.donos.push(n);
    _salvar();
    return { ok: true, numero: n };
}

function delDono(jidOuNumero) {
    const n = Jid.numero(jidOuNumero);
    const d = _dados();
    const antes = d.donos.length;
    d.donos = d.donos.filter(x => x !== n);
    _salvar();
    return d.donos.length < antes;
}

// ── 4. COMANDOS DESLIGADOS ───────────────────────────────
const PROTEGIDOS = new Set(["cmdon", "cmdoff", "cmdsoff", "boton", "botoff", "menu", "donos", "adddono", "deldono", "reiniciar"]);

function desativarComando(cmd) {
    const c = String(cmd || "").toLowerCase().trim();
    if (!c) return { ok: false, motivo: "diga qual comando" };
    if (PROTEGIDOS.has(c)) return { ok: false, motivo: "esse comando é protegido e não pode ser desligado" };

    const d = _dados();
    if (d.cmdsOff.includes(c)) return { ok: false, motivo: "esse comando já está desligado" };
    d.cmdsOff.push(c);
    _salvar();
    return { ok: true };
}

function ativarComando(cmd) {
    const c = String(cmd || "").toLowerCase().trim();
    const d = _dados();
    const antes = d.cmdsOff.length;
    d.cmdsOff = d.cmdsOff.filter(x => x !== c);
    _salvar();
    return d.cmdsOff.length < antes;
}

function comandosDesativados() {
    return [...(_dados().cmdsOff || [])];
}

function comandoDesativado(cmd) {
    return _dados().cmdsOff.includes(cmd);
}

// ── 5. ERROS RECENTES ────────────────────────────────────
const _erros = [];
const MAX_ERROS = 50;

function _textoDe(x) {
    if (x instanceof Error) return x.stack || x.message;
    if (typeof x === "object" && x !== null) {
        try { return JSON.stringify(x); } catch { return String(x); }
    }
    return String(x);
}

function registrarErro(args) {
    const texto = args.map(_textoDe).join(" ").replace(/\x1B\[[0-9;]*m/g, "").slice(0, 700);
    _erros.push({ t: Date.now(), texto });
    if (_erros.length > MAX_ERROS) _erros.shift();
}

if (!console.error.__nejireCaptura) {
    const original = console.error.bind(console);
    const captura = (...args) => {
        try { registrarErro(args); } catch {}
        original(...args);
    };
    captura.__nejireCaptura = true;
    console.error = captura;
}

function ultimosErros(n = 5) {
    return _erros.slice(-Math.max(1, Math.min(15, n))).reverse();
}

function totalErros() {
    return _erros.length;
}

function limparErros() {
    const total = _erros.length;
    _erros.length = 0;
    return total;
}

// ── 6. RANKING DE COMANDOS ───────────────────────────────
let _sujo = false;

function contarUso(cmd) {
    const d = _dados();
    d.uso[cmd] = (d.uso[cmd] || 0) + 1;
    _sujo = true;
}

function _gravarUso() {
    if (!_sujo) return;
    _sujo = false;
    try { _salvar(); } catch {}
}

const _timerUso = setInterval(_gravarUso, 30000);
_timerUso.unref?.();
process.on("exit", _gravarUso);

function topComandos(n = 10) {
    const d = _dados();
    const total = Object.values(d.uso).reduce((a, b) => a + b, 0);
    const lista = Object.entries(d.uso).sort((a, b) => b[1] - a[1]).slice(0, Math.max(1, Math.min(30, n)));
    return { total, lista };
}

function zerarUso() {
    _dados().uso = {};
    _salvar();
}

// ── 1. BACKUP ────────────────────────────────────────────
function gerarBackup() {
    const AdmZip = require("adm-zip");
    const raiz = path.join(__dirname, "..");
    const zip = new AdmZip();

    const pastaDb = path.join(raiz, "database");
    if (fs.existsSync(pastaDb)) zip.addLocalFolder(pastaDb, "database");

    const arquivos = ["config.json", path.join("data", "modoai.json")];
    for (const rel of arquivos) {
        const abs = path.join(raiz, rel);
        if (fs.existsSync(abs)) zip.addLocalFile(abs, path.dirname(rel) === "." ? "" : path.dirname(rel));
    }

    const agora = new Date();
    const p = n => String(n).padStart(2, "0");
    const nome = `nejire-backup-${agora.getFullYear()}-${p(agora.getMonth() + 1)}-${p(agora.getDate())}_${p(agora.getHours())}-${p(agora.getMinutes())}.zip`;

    return { buffer: zip.toBuffer(), nome };
}

function jidDoDono() {
    return `${Jid.numero(config.numeroDono)}@s.whatsapp.net`;
}

// ── 2. BACKUP AUTOMÁTICO ─────────────────────────────────
function autobackupConfig() {
    return { ..._dados().autobackup };
}

function definirAutobackup(horas) {
    const h = Math.max(0, Math.min(24 * 30, Number(horas) || 0));
    const d = _dados();
    d.autobackup.horas = h;
    d.autobackup.ultimo = h > 0 ? Date.now() : d.autobackup.ultimo;
    _salvar();
    return h;
}

let _agendador = null;

async function _tickBackup(pegarConn) {
    const cfg = _dados().autobackup;
    if (!cfg.horas || Date.now() - cfg.ultimo < cfg.horas * 3600000) return;

    const conn = pegarConn();
    if (!conn) return;

    try {
        const { buffer, nome } = gerarBackup();
        await conn.sendMessage(jidDoDono(), {
            document: buffer,
            mimetype: "application/zip",
            fileName: nome,
            caption: `💾 backup automático (a cada ${cfg.horas}h)`
        });
        _dados().autobackup.ultimo = Date.now();
        _salvar();
    } catch (err) {
        console.error("[autobackup] falhou:", err?.message || err);
    }
}

function iniciarAgendador(pegarConn) {
    if (_agendador) return;
    _agendador = setInterval(() => _tickBackup(pegarConn), 5 * 60 * 1000);
    _agendador.unref?.();
}

// ── 7. ENTRAR EM GRUPO ───────────────────────────────────
function codigoConvite(txt) {
    const m = String(txt || "").match(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/);
    return m ? m[1] : null;
}

// ── 8. AUTOLER ───────────────────────────────────────────
function autoler() {
    return !!_dados().autoler;
}

function definirAutoler(ligado) {
    _dados().autoler = !!ligado;
    _salvar();
}

// ── 9. PRESENÇA ──────────────────────────────────────────
const MODOS_PRESENCA = ["off", "digitando", "gravando", "online"];

function presenca() {
    const p = _dados().presenca;
    return MODOS_PRESENCA.includes(p) ? p : "off";
}

function definirPresenca(modo) {
    if (!MODOS_PRESENCA.includes(modo)) return false;
    _dados().presenca = modo;
    _salvar();
    return true;
}

function aplicarPresenca(conn, jid) {
    const modo = presenca();
    if (modo === "off") return;

    try {
        if (modo === "online") conn.sendPresenceUpdate("available");
        else conn.sendPresenceUpdate(modo === "digitando" ? "composing" : "recording", jid);
    } catch {}
}

// ── 10. LIMPAR CACHE ─────────────────────────────────────
function limparCache({ tudo = false } = {}) {
    return Tmp.limpar(tudo ? 0 : 5 * 60 * 1000);
}

module.exports = {
    listarDonos, addDono, delDono,
    PROTEGIDOS, desativarComando, ativarComando, comandosDesativados, comandoDesativado,
    ultimosErros, totalErros, limparErros, registrarErro,
    contarUso, topComandos, zerarUso, _gravarUso,
    gerarBackup, definirAutobackup, autobackupConfig, iniciarAgendador, _tickBackup, jidDoDono,
    codigoConvite,
    autoler, definirAutoler,
    MODOS_PRESENCA, presenca, definirPresenca, aplicarPresenca,
    limparCache
};
