// roda junto do bot (mesmo processo, mesmos arquivos json) e só
// expõe o necessário pro painel html: nunca aceita jid cru — só
// token gerado pelo comando #painelpesca / #pesca no whatsapp.
//
// precisa de "express" instalado (npm install express).

const path = require("path");
const express = require("express");
const config = require("../config.json");
const Pesca = require("../SISTEMAS/pesca.js");
const Economia = require("../SISTEMAS/economia.js");

function jidPorToken(req, res) {
    const token = req.query.token || req.body?.token;
    const jid = token && Pesca.resolverToken(token);
    if (!jid) {
        res.status(401).json({ ok: false, erro: "token inválido ou expirado — gera um novo com #painelpesca no whatsapp" });
        return null;
    }
    return jid;
}

function iniciarPainelPesca(porta = config.webapp?.porta || 3055) {
    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname)));

    app.get("/api/pesca/estado", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        res.json({ ok: true, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/pescar", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.pescar(jid);
        if (resultado.ok) Economia.ganharXp(jid, 1);
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/local", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.definirLocal(jid, String(req.body?.local || "").toLowerCase());
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/comprar-vara", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.comprarVara(jid, String(req.body?.id || "").toLowerCase());
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/comprar-isca", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.comprarIsca(jid, String(req.body?.id || "").toLowerCase(), Number(req.body?.qtd) || 1);
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/comprar-barco", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.comprarBarco(jid);
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/equipar-vara", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = Pesca.equiparVara(jid, String(req.body?.id || "").toLowerCase());
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.post("/api/pesca/vender", (req, res) => {
        const jid = jidPorToken(req, res);
        if (!jid) return;
        const resultado = req.body?.indice === "tudo"
            ? Pesca.venderTudoPesca(jid)
            : Pesca.venderPeixe(jid, Number(req.body?.indice));
        res.json({ resultado, estado: Pesca.estadoPublico(jid) });
    });

    app.get("/api/pesca/ranking", (req, res) => {
        res.json({ ok: true, ranking: Pesca.rankingPesca(10) });
    });

    app.get("/api/pesca/catalogo", (req, res) => {
        res.json({ ok: true, varas: Pesca.VARAS, iscas: Pesca.ISCAS, locais: Pesca.LOCAIS, raridades: Pesca.RARIDADES });
    });

    app.listen(porta, () => {
        console.log(`[NEJIRE] mini app de pesca no ar na porta ${porta}`);
    });

    return app;
}

module.exports = { iniciarPainelPesca };