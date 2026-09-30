const fs = require("fs-extra");
const path = require("path");
const ff = require("fluent-ffmpeg");
const { tmpdir } = require("os");
const crypto = require("crypto");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");
const ESTADO_PATH = path.join(__dirname, "..", "database", "estado.json");
const db = require("../utils/db.js");
const config = require("../config.json");

db.ensure(ESTADO_PATH, { ativo: true, iniciadoEm: Date.now() });

// ── LIGA/DESLIGA GLOBAL ──────────────────────────────
function botEstaAtivo() {
    return db.read(ESTADO_PATH, { ativo: true }).ativo !== false;
}

function definirEstadoBot(ativo) {
    const estado = db.read(ESTADO_PATH, {});
    db.write(ESTADO_PATH, { ...estado, ativo });
}

function horaInicio() {
    const estado = db.read(ESTADO_PATH, {});
    return estado.iniciadoEm || Date.now();
}

function trocarPrefixo(novoPrefixo) {
    config.prefixo = novoPrefixo;
    fs.writeJsonSync(CONFIG_PATH, config, { spaces: 4 });
    return config.prefixo;
}

const FIGURINHA_PADRAO = { ...(config.figurinha || {}) };

function definirFigurinhaPack(nome) {
    config.figurinha = { ...(config.figurinha || {}), packname: nome };
    fs.writeJsonSync(CONFIG_PATH, config, { spaces: 4 });
    return config.figurinha;
}

function definirFigurinhaAutor(nome) {
    config.figurinha = { ...(config.figurinha || {}), author: nome };
    fs.writeJsonSync(CONFIG_PATH, config, { spaces: 4 });
    return config.figurinha;
}

function resetarFigurinha() {
    config.figurinha = { ...FIGURINHA_PADRAO };
    fs.writeJsonSync(CONFIG_PATH, config, { spaces: 4 });
    return config.figurinha;
}

function uptimeTexto() {
    const ms = Date.now() - horaInicio();
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000) % 24;
    const d = Math.floor(ms / 86400000);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function figurinhaParaImagem(buffer) {
    const entrada = path.join(tmpdir(), `${crypto.randomBytes(6).toString("hex")}.webp`);
    const saida = path.join(tmpdir(), `${crypto.randomBytes(6).toString("hex")}.png`);

    fs.writeFileSync(entrada, buffer);

    await new Promise((resolve, reject) => {
        ff(entrada)
            .frames(1)
            .on("error", reject)
            .on("end", resolve)
            .save(saida);
    });

    const saidaBuffer = fs.readFileSync(saida);
    fs.removeSync(entrada);
    fs.removeSync(saida);
    return saidaBuffer;
}

async function aplicarEfeito8D(buffer, mimeExtensaoEntrada = "mp3") {
    const entrada = path.join(tmpdir(), `${crypto.randomBytes(6).toString("hex")}.${mimeExtensaoEntrada}`);
    const saida = path.join(tmpdir(), `${crypto.randomBytes(6).toString("hex")}.mp3`);

    fs.writeFileSync(entrada, buffer);

    await new Promise((resolve, reject) => {
        ff(entrada)
            .audioFilters("apulsator=hz=0.09")
            .on("error", reject)
            .on("end", resolve)
            .save(saida);
    });

    const saidaBuffer = fs.readFileSync(saida);
    fs.removeSync(entrada);
    fs.removeSync(saida);
    return saidaBuffer;
}

module.exports = {
    botEstaAtivo,
    definirEstadoBot,
    horaInicio,
    trocarPrefixo,
    definirFigurinhaPack,
    definirFigurinhaAutor,
    resetarFigurinha,
    uptimeTexto,
    figurinhaParaImagem,
    aplicarEfeito8D
};
