"use strict";

const M = require("./matematica.js");
const { Tela, criarFundo, reduzir } = require("./raster.js");
const Modelos = require("./modelos.js");
const Texturas = require("./texturas.js");
const { ANIMACOES } = require("./animacoes.js");
const Video = require("./video.js");
const { limparFundoEntreQuadros } = require("../../utils/webp.js");

const { CUBO_V, CUBO_F, CUBO_A, UV } = Modelos;

const TEMA = { principal: [56, 198, 220], secundaria: [50, 118, 232], destaque: [221, 248, 255] };

const ESTILOS = {
    solido: "faces sólidas com luz e brilho",
    colorido: "cada face de uma cor",
    gradiente: "arco-íris por vértice, girando",
    xadrez: "textura de tabuleiro",
    foto: "sua foto nas 6 faces (use cubofoto)",
    dado: "dado com pontinhos (use cubodado)",
    rubik: "cubo mágico girando as camadas",
    vidro: "faces de vidro + cubo interno",
    wire: "só as arestas (wireframe)",
    neon: "arestas com brilho neon"
};

const PALETA6 = [[255, 77, 109], [255, 166, 43], [255, 230, 109], [74, 222, 128], [56, 189, 248], [167, 139, 250]];

const FUNDOS = {
    escuro: { topo: [8, 18, 40], base: [18, 58, 108] },
    claro: { topo: [236, 246, 255], base: [184, 212, 240] },
    preto: { topo: [0, 0, 0], base: [12, 12, 16] }
};

const LUZ = M.norm([-0.45, 0.75, 0.6]);
const MEIO = M.norm(M.add(LUZ, [0, 0, 1]));

function sombraDaFace(n) {
    const d = Math.max(0, M.dot(n, LUZ));
    const s = Math.max(0, M.dot(n, MEIO));
    return { sombra: 0.36 + 0.7 * d, brilho: Math.pow(s, 36) * 90 };
}

function criarRender(opc) {
    const estilo = ESTILOS[opc.estilo] ? opc.estilo : "solido";
    const animNome = ANIMACOES[opc.animacao] ? opc.animacao : (estilo === "dado" ? "rolar" : "giro");
    const formato = opc.formato || "mp4";
    const tamanho = Math.max(64, Math.round((opc.tamanho || 384) / 2) * 2);
    const ss = opc.ss || 2;
    const fps = opc.fps || 24;
    const duracao = opc.duracao || 4;
    const proj = ["perspectiva", "ortografica", "isometrica"].includes(opc.proj) ? opc.proj : "perspectiva";

    let anim = ANIMACOES[animNome];
    let nomeAnim = animNome;
    if (nomeAnim === "rolar" && estilo !== "dado") { nomeAnim = "giro"; anim = ANIMACOES.giro; }
    if (nomeAnim === "explosao" && estilo === "rubik") { nomeAnim = "giro"; anim = ANIMACOES.giro; }

    const transparente = opc.fundo === "transparente" && formato !== "mp4";
    const canais = transparente || formato === "sticker" ? 4 : 3;

    const W = tamanho * ss, H = tamanho * ss;
    const N = Math.max(1, Math.round(fps * duracao));
    const principal = opc.cor || TEMA.principal;

    let fundoCores = FUNDOS.escuro;
    if (Array.isArray(opc.fundo)) fundoCores = { topo: opc.fundo.map(c => c * 0.55), base: opc.fundo };
    else if (FUNDOS[opc.fundo]) fundoCores = FUNDOS[opc.fundo];
    const fundo = criarFundo(W, H, fundoCores.topo, fundoCores.base, transparente);

    const tela = new Tela(W, H);

    // ── câmera ──
    const D = 7;
    const ortogonal = proj !== "perspectiva";
    const tilt = proj === "isometrica" ? 0.6155 : 0.45;
    const ex = anim.extra;
    const raio = 1.75 * ex.s + ex.ex + ex.y;
    const FIT = 0.92;
    const focal = FIT * (D - raio) / raio;
    const escalaOrto = FIT / raio;
    const cx = W / 2, cy = H * 0.48;

    function projetar(p) {
        const zd = D - p[2];
        if (!ortogonal) {
            const k = focal / zd * (H / 2);
            return { x: cx + p[0] * k, y: cy - p[1] * k, dz: 1 / zd, w: 1 / zd, zd };
        }
        const k = escalaOrto * (H / 2);
        return { x: cx + p[0] * k, y: cy - p[1] * k, dz: -zd, w: 1, zd };
    }

    const virado = (nw, centro) => {
        const paraCam = ortogonal ? [0, 0, 1] : M.sub([0, 0, D], centro);
        return M.dot(nw, paraCam) > 0;
    };

    const transformar = (p, est) => M.add(M.mvec(est.R, M.mul(p, est.s)), [0, est.y, 0]);

    const lw = W * 0.006;

    // ── texturas ──
    let texturas = null;
    if (estilo === "foto") {
        if (!opc.textura) throw new Error("estilo foto precisa de uma imagem");
        texturas = { unica: opc.textura };
    } else if (estilo === "xadrez") {
        texturas = { unica: Texturas.xadrez([250, 250, 250], principal, 8) };
    } else if (estilo === "dado") {
        texturas = {};
        for (let n = 1; n <= 6; n++) texturas[n] = Texturas.faceDado(n);
    }

    const opcDado = Math.min(6, Math.max(1, parseInt(opc.dado, 10) || 1 + Math.floor(Math.random() * 6)));

    // ── estados ──
    function estadoAnim(i) {
        const t = i / N;
        const est = anim.estado(t, { tilt, dado: opcDado }, i, N);
        return { ex: 0, altura: 0, ...est };
    }

    function vertice(p, extra = {}) {
        const v = projetar(p);
        return { ...v, ...extra };
    }

    // ── desenhos por tipo ──
    function faces(est, i) {
        const duplaFace = est.ex > 0.001;
        const colorPorVertice = estilo === "gradiente";

        for (let fi = 0; fi < CUBO_F.length; fi++) {
            const f = CUBO_F[fi];
            const vm = f.idx.map(k => M.add(CUBO_V[k], M.mul(f.n, est.ex)));
            const vw = vm.map(p => transformar(p, est));
            let nw = M.mvec(est.R, f.n);
            const centro = M.media(vw);
            const frente = virado(nw, centro);

            if (!frente && !duplaFace) continue;
            if (!frente) nw = M.mul(nw, -1);

            const { sombra, brilho } = sombraDaFace(nw);
            const o = { testarZ: true, escreverZ: true, sombra, brilho };
            let verts;

            if (colorPorVertice) {
                verts = f.idx.map((k, j) => {
                    const c = M.hsl(k * 45 + (360 * i) / N, 0.85, 0.56);
                    return vertice(vw[j], { r: c[0], g: c[1], b: c[2] });
                });
                o.modo = 1;
            } else if (texturas) {
                const tex = texturas.unica || texturas[Modelos.numeroDadoDaFace(f)];
                verts = vw.map((p, j) => vertice(p, { u: UV[j][0], v: 1 - UV[j][1] }));
                o.modo = 2;
                o.tex = tex;
                o.brilho = brilho * 0.5;
            } else {
                const base = estilo === "colorido" ? PALETA6[fi] : principal;
                verts = vw.map(p => vertice(p));
                o.modo = 0; o.r = base[0]; o.g = base[1]; o.b = base[2];
            }

            if (verts.some(v => v.zd < 0.3)) continue;
            tela.quad(verts[0], verts[1], verts[2], verts[3], o);
        }

        if (!duplaFace && estilo !== "foto" && estilo !== "dado") {
            const cor = M.mul(M.add(principal, [255, 255, 255]), 0.5);
            const vw = CUBO_V.map(p => transformar(p, est));
            const pr = vw.map(p => projetar(p));
            const virada = CUBO_F.map(f => virado(M.mvec(est.R, f.n), M.media(f.idx.map(k => vw[k]))));

            for (const a of CUBO_A) {
                if (!a.faces.some(fi => virada[fi])) continue;
                tela.linha(pr[a.a].x, pr[a.a].y, pr[a.b].x, pr[a.b].y, lw * 0.55, cor, 0.55);
            }
        }
    }

    function rubik(est, i) {
        const polys = Modelos.poligonosRubik(Modelos.estadoRubik(i, N));

        for (const pg of polys) {
            const vw = pg.v.map(p => transformar(p, est));
            const nw = M.mvec(est.R, pg.n);
            if (!virado(nw, M.media(vw))) continue;

            const { sombra, brilho } = sombraDaFace(nw);
            const verts = vw.map(p => vertice(p));
            tela.quad(verts[0], verts[1], verts[2], verts[3], { modo: 0, r: pg.cor[0], g: pg.cor[1], b: pg.cor[2], sombra, brilho: brilho * 0.8 });
        }
    }

    function vidro(est) {
        const lista = [];

        for (const escala of [1, 0.5]) {
            CUBO_F.forEach(f => {
                const vw = f.idx.map(k => transformar(M.mul(CUBO_V[k], escala), est));
                const nw = M.mvec(est.R, f.n);
                lista.push({ vw, nw, escala, zd: D - M.media(vw)[2] });
            });
        }

        lista.sort((a, b) => b.zd - a.zd);

        for (const pg of lista) {
            const { sombra, brilho } = sombraDaFace(pg.nw);
            const verts = pg.vw.map(p => vertice(p));
            tela.quad(verts[0], verts[1], verts[2], verts[3], {
                modo: 0, r: principal[0], g: principal[1], b: principal[2],
                alfa: pg.escala === 1 ? 0.2 : 0.14, sombra: 0.5 + sombra * 0.6, brilho: brilho * 0.8,
                testarZ: false, escreverZ: false
            });
        }

        arestas(est, { escala: 1, largura: lw * 0.9, alfa: 0.95, cor: TEMA.destaque, fundoFraco: 0.55 });
        arestas(est, { escala: 0.5, largura: lw * 0.5, alfa: 0.5, cor: principal, fundoFraco: 0.6 });
    }

    function arestas(est, { escala = 1, largura, alfa, cor, fundoFraco = 0.35, aditivo = false, larguraFundo = null }) {
        const vw = CUBO_V.map(p => transformar(M.mul(p, escala), est));
        const pr = vw.map(p => projetar(p));
        const virada = CUBO_F.map(f => virado(M.mvec(est.R, f.n), M.media(f.idx.map(k => vw[k]))));

        const trasAntes = [...CUBO_A].sort((a, b) => (a.faces.some(fi => virada[fi]) ? 1 : 0) - (b.faces.some(fi => virada[fi]) ? 1 : 0));

        for (const a of trasAntes) {
            const visivel = a.faces.some(fi => virada[fi]);
            tela.linha(pr[a.a].x, pr[a.a].y, pr[a.b].x, pr[a.b].y,
                visivel ? largura : (larguraFundo || largura * 0.7), cor, visivel ? alfa : alfa * fundoFraco, aditivo);
        }
        return pr;
    }

    function wire(est, neon) {
        const inner = () => arestas(est, { escala: 0.5, largura: lw * 0.6, alfa: neon ? 0.35 : 0.45, cor: principal, fundoFraco: 0.6, aditivo: neon });

        if (neon) {
            for (const [mult, a] of [[9, 0.07], [5.5, 0.13], [3, 0.26]]) {
                arestas(est, { largura: lw * mult, alfa: a, cor: principal, fundoFraco: 0.5, aditivo: true, larguraFundo: lw * mult * 0.8 });
            }
            inner();
            arestas(est, { largura: lw * 1.3, alfa: 1, cor: TEMA.destaque, fundoFraco: 0.5, aditivo: true, larguraFundo: lw });
        } else {
            inner();
            arestas(est, { largura: lw * 1.5, alfa: 1, cor: principal, fundoFraco: 0.4 });
        }

        // pontinhos nos vértices (maiores quando estão mais perto)
        const vw = CUBO_V.map(p => transformar(p, est));
        for (const p of vw) {
            const pr = projetar(p);
            const perto = ortogonal ? 1 : Math.min(1.6, Math.max(0.6, 6 / pr.zd));
            tela.ponto(pr.x, pr.y, lw * 1.6 * perto, TEMA.destaque, 1, neon);
        }
    }

    // ── quadro ──
    function quadro(i) {
        const est = estadoAnim(i);
        tela.limpar(fundo);

        const ehSticker = formato === "sticker";
        if (!transparente && !ehSticker) {
            const esc = 1 - 0.45 * Math.min(1, (est.altura || 0) / 0.8);
            tela.sombra(cx, H * 0.925, W * 0.27 * esc, H * 0.03 * esc, 0.5);
        }

        if (estilo === "rubik") rubik(est, i);
        else if (estilo === "vidro") vidro(est);
        else if (estilo === "wire") wire(est, false);
        else if (estilo === "neon") wire(est, true);
        else faces(est, i);

        return reduzir(tela.px, W, H, ss, canais);
    }

    return { N, fps, largura: tamanho, altura: tamanho, canais, formato, estilo, animacao: nomeAnim, dado: opcDado, quadro };
}

// ── PIPELINE COMPLETO: opções → arquivo (Buffer) ──
async function gerar(opc) {
    const dados = { ...opc };
    if (dados.foto && !dados.textura) {
        dados.textura = await Texturas.deImagem(Buffer.from(dados.foto));
        delete dados.foto;
    }

    if (dados.formato === "png") {
        dados.fps = 1; dados.duracao = 1;
    }

    const r = criarRender(dados);
    const base = { largura: r.largura, altura: r.altura, fps: r.fps, formato: r.formato, canais: r.canais };

    if (r.formato === "sticker") {
        const frames = [];
        for (let i = 0; i < r.N; i++) frames.push(r.quadro(i));

        let ultimo = null;
        for (const q of [58, 42, 30, 20]) {
            const enc = Video.iniciar({ ...base, q });
            for (const f of frames) await enc.escrever(f);
            ultimo = limparFundoEntreQuadros(await enc.terminar());
            if (ultimo.length <= 500 * 1024) break;
        }
        return { buffer: ultimo, info: infoResultado(r) };
    }

    const enc = Video.iniciar(base);
    try {
        for (let i = 0; i < r.N; i++) await enc.escrever(r.quadro(i));
        return { buffer: await enc.terminar(), info: infoResultado(r) };
    } catch (err) {
        enc.cancelar();
        throw err;
    }
}

function infoResultado(r) {
    return { estilo: r.estilo, animacao: r.animacao, dado: r.estilo === "dado" ? r.dado : null, quadros: r.N };
}

module.exports = { criarRender, gerar, ESTILOS, ANIMACOES, TEMA, FUNDOS };
