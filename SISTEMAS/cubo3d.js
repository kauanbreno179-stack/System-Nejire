//CUBO

const { Worker } = require("worker_threads");
const path = require("path");
const crypto = require("crypto");
const config = require("../config.json");
const Render = require("./cubo3d/render.js");

const { ESTILOS, ANIMACOES } = Render;

const CORES_PT = {
    vermelho: [235, 64, 64], laranja: [255, 146, 43], amarelo: [255, 214, 10], verde: [52, 199, 89],
    azul: [50, 118, 232], ciano: [56, 198, 220], roxo: [150, 90, 240], rosa: [255, 105, 180],
    branco: [240, 240, 245], preto: [40, 40, 52], cinza: [150, 155, 165], dourado: [255, 196, 0]
};

const APELIDOS = {
    estilo: {
        rubiks: "rubik", cubomagico: "rubik", magico: "rubik",
        wireframe: "wire", aramado: "wire", aramada: "wire",
        glass: "vidro", cristal: "vidro",
        arcoiris: "gradiente", degrade: "gradiente",
        tabuleiro: "xadrez", dados: "dado"
    },
    animacao: { explodir: "explosao", exploded: "explosao", pular: "quicar", pula: "quicar", pendulo: "pendulo", rodar: "giro", girar: "giro", cambalhota: "tumble", pulsa: "pulsar" }
};

function hexParaRgb(txt) {
    const h = String(txt).replace(/^#/, "");
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function temaDaConfig() {
    return hexParaRgb(config.tema?.corPrincipal || "") || Render.TEMA.principal;
}

// "neon giro azul claro hd" → { estilo, animacao, cor, fundo, ... }
function interpretarArgs(args = []) {
    const opc = {};
    const desconhecidos = [];

    for (const bruto of args) {
        let tok = String(bruto).toLowerCase().replace(/[.,;!]+$/g, "");
        if (!tok) continue;

        const kv = tok.match(/^(fundo|cor|estilo|animacao|proj)=(.+)$/);
        if (kv) tok = kv[2];

        if (APELIDOS.estilo[tok]) tok = APELIDOS.estilo[tok];
        else if (APELIDOS.animacao[tok]) tok = APELIDOS.animacao[tok];

        if (ESTILOS[tok]) opc.estilo = tok;
        else if (ANIMACOES[tok]) opc.animacao = tok;
        else if (CORES_PT[tok]) opc.cor = CORES_PT[tok];
        else if (/^#?[0-9a-f]{6}$/.test(tok) && hexParaRgb(tok)) opc.cor = hexParaRgb(tok);
        else if (["claro", "escuro", "preto", "transparente"].includes(tok)) opc.fundo = tok;
        else if (["iso", "isometrico", "isometrica"].includes(tok)) opc.proj = "isometrica";
        else if (["orto", "ortogonal", "ortografica", "ortografico"].includes(tok)) opc.proj = "ortografica";
        else if (tok === "perspectiva") opc.proj = "perspectiva";
        else if (tok === "hd") opc.tamanho = 512;
        else if (tok === "rapido" || tok === "rápido") opc.duracao = 2.5;
        else if (tok === "lento") opc.duracao = 6;
        else if (/^[1-6]$/.test(tok)) opc.dado = Number(tok);
        else desconhecidos.push(bruto);
    }

    return { opc, desconhecidos };
}

// ── fila + cache ──
const LIMITE_FILA = 3;
const TIMEOUT_MS = 120000;
let _cadeia = Promise.resolve();
let _pendentes = 0;
const _cache = new Map();
const CACHE_MAX = 6;

function chaveCache(o) {
    const { foto, ...resto } = o;
    const h = foto ? crypto.createHash("sha1").update(foto).digest("hex") : "";
    return JSON.stringify(resto) + h;
}

function rodarWorker(opcoes) {
    return new Promise((resolve, reject) => {
        let worker;
        try {
            worker = new Worker(path.join(__dirname, "cubo3d", "worker.js"), { workerData: opcoes });
        } catch {
            // ambiente sem worker_threads: roda na thread principal mesmo
            Render.gerar(opcoes).then(resolve, reject);
            return;
        }

        const timer = setTimeout(() => {
            worker.terminate();
            reject(new Error("o cubo demorou demais pra renderizar"));
        }, TIMEOUT_MS);

        worker.once("message", m => {
            clearTimeout(timer);
            if (m.ok) resolve({ buffer: Buffer.from(m.buffer), info: m.info });
            else reject(new Error(m.erro));
        });
        worker.once("error", err => { clearTimeout(timer); reject(err); });
        worker.once("exit", code => {
            clearTimeout(timer);
            if (code !== 0) reject(new Error(`o render fechou com código ${code}`));
        });
    });
}

// opções: estilo, animacao, cor, fundo, proj, tamanho, fps, duracao, dado, formato ("mp4"|"sticker"|"png"), foto (Buffer)
async function renderizar(opcoes = {}) {
    const formato = opcoes.formato || "mp4";
    const o = { ...opcoes, formato };

    if (!o.cor) o.cor = temaDaConfig();
    if (o.foto && !o.estilo) o.estilo = "foto";
    if ((o.estilo || "solido") === "dado" && !o.dado) o.dado = 1 + Math.floor(Math.random() * 6);

    if (formato === "sticker") {
        o.tamanho = o.tamanho || 512;
        o.fps = o.fps || 12;
        o.duracao = o.duracao || 3;
        if (!o.fundo) o.fundo = "transparente";
    }

    const chave = chaveCache(o);
    if (_cache.has(chave)) {
        const c = _cache.get(chave);
        _cache.delete(chave);
        _cache.set(chave, c);
        return { ...c, doCache: true };
    }

    if (_pendentes >= LIMITE_FILA) throw new Error("tem renders demais na fila, tenta de novo daqui a pouco");

    _pendentes++;
    const exec = _cadeia.then(() => rodarWorker(o));
    _cadeia = exec.catch(() => {});

    try {
        const r = await exec;
        const res = { ...r, formato };
        _cache.set(chave, res);
        while (_cache.size > CACHE_MAX) _cache.delete(_cache.keys().next().value);
        return res;
    } finally {
        _pendentes--;
    }
}

function listarEstilos() {
    return Object.entries(ESTILOS).map(([nome, desc]) => ({ nome, desc }));
}

function listarAnimacoes() {
    return Object.entries(ANIMACOES).map(([nome, a]) => ({ nome, desc: a.desc }));
}

module.exports = { renderizar, interpretarArgs, listarEstilos, listarAnimacoes, CORES_PT, ESTILOS, ANIMACOES };
