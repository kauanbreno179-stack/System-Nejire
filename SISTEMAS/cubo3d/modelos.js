"use strict";
const M = require("./matematica.js");

const CUBO_V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];

const CUBO_F = [
    { idx: [4, 5, 6, 7], n: [0, 0, 1] },
    { idx: [1, 0, 3, 2], n: [0, 0, -1] },
    { idx: [5, 1, 2, 6], n: [1, 0, 0] },
    { idx: [0, 4, 7, 3], n: [-1, 0, 0] },
    { idx: [7, 6, 2, 3], n: [0, 1, 0] },
    { idx: [0, 1, 5, 4], n: [0, -1, 0] }
];

const UV = [[0, 0], [1, 0], [1, 1], [0, 1]];

const CUBO_A = (() => {
    const mapa = new Map();
    CUBO_F.forEach((f, fi) => {
        for (let k = 0; k < 4; k++) {
            const a = f.idx[k], b = f.idx[(k + 1) % 4];
            const chave = a < b ? `${a}-${b}` : `${b}-${a}`;
            if (!mapa.has(chave)) mapa.set(chave, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
            mapa.get(chave).faces.push(fi);
        }
    });
    return [...mapa.values()];
})();

const DADO_POR_NORMAL = { "0,0,1": 1, "0,0,-1": 6, "1,0,0": 2, "-1,0,0": 5, "0,1,0": 3, "0,-1,0": 4 };
const NORMAL_DO_DADO = { 1: [0, 0, 1], 6: [0, 0, -1], 2: [1, 0, 0], 5: [-1, 0, 0], 3: [0, 1, 0], 4: [0, -1, 0] };

function numeroDadoDaFace(f) {
    return DADO_POR_NORMAL[f.n.join(",")];
}

// ── RUBIK ────────────────────────────────────────────────
const RUBIK_CORPO = 0.325; 
const RUBIK_ADESIVO = 0.27;
const RUBIK_ELEV = 0.006;
const COR_CORPO = [22, 22, 28];

const RUBIK_CORES = {
    "y+": [242, 242, 242], "y-": [250, 214, 30],
    "z+": [40, 176, 84], "z-": [36, 92, 224],
    "x+": [218, 44, 44], "x-": [252, 132, 30]
};

const EIXOS = ["x", "y", "z"];

function criarRubik() {
    const cubies = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const pos = [x, y, z];
                const adesivos = {};
                pos.forEach((v, k) => {
                    if (v !== 0) {
                        const chave = `${EIXOS[k]}${v > 0 ? "+" : "-"}`;
                        adesivos[chave] = RUBIK_CORES[chave];
                    }
                });
                cubies.push({ pos, ori: M.I3.slice(), adesivos });
            }
        }
    }
    return cubies;
}

const arred = v => Math.round(v) + 0;

function aplicarMovimento(cubies, mov) {
    const k = EIXOS.indexOf(mov.eixo);
    const R = M.rotEixo(mov.eixo, mov.dir * Math.PI / 2);

    return cubies.map(c => {
        if (c.pos[k] !== mov.camada) return c;
        return {
            pos: M.mvec(R, c.pos).map(arred),
            ori: M.mmul(R, c.ori).map(arred),
            adesivos: c.adesivos
        };
    });
}

function roteiroRubik() {
    const base = [
        { eixo: "y", camada: 1, dir: 1 },
        { eixo: "x", camada: 1, dir: -1 },
        { eixo: "z", camada: 1, dir: 1 }
    ];
    const volta = base.slice().reverse().map(m => ({ ...m, dir: -m.dir }));
    return [...base, ...volta];
}

function estadoRubik(i, N) {
    const roteiro = roteiroRubik();
    const fatia = N / roteiro.length;
    const idx = Math.min(roteiro.length - 1, Math.floor(i / fatia));
    const p = (i - idx * fatia) / fatia;
    const prog = M.suave(M.clamp(p / 0.78, 0, 1));

    let cubies = criarRubik();
    for (let k = 0; k < idx; k++) cubies = aplicarMovimento(cubies, roteiro[k]);

    return { cubies, mov: roteiro[idx], prog };
}

function poligonosRubik({ cubies, mov, prog }) {
    const saida = [];
    const k = EIXOS.indexOf(mov.eixo);
    const rotCamada = M.rotEixo(mov.eixo, mov.dir * (Math.PI / 2) * prog);

    for (const c of cubies) {
        const centro = M.mul(c.pos, 2 / 3);
        const gira = c.pos[k] === mov.camada;

        const mundo = p => {
            const w = M.add(M.mvec(c.ori, p), centro);
            return gira ? M.mvec(rotCamada, w) : w;
        };

        for (const f of CUBO_F) {
            const nLocal = f.n;
            const nMundo = M.mvec(c.ori, nLocal);
            const nFinal = gira ? M.mvec(rotCamada, nMundo) : nMundo;

            saida.push({
                v: f.idx.map(i => mundo(M.mul(CUBO_V[i], RUBIK_CORPO))),
                n: nFinal,
                cor: COR_CORPO
            });

            const eixo = nLocal[0] !== 0 ? 0 : nLocal[1] !== 0 ? 1 : 2;
            const sinal = nLocal[eixo] > 0 ? "+" : "-";
            const cor = c.adesivos[`${EIXOS[eixo]}${sinal}`];

            if (cor) {
                saida.push({
                    v: f.idx.map(i => {
                        const v = CUBO_V[i];
                        return mundo(v.map((x, kk) => x * (kk === eixo ? RUBIK_CORPO + RUBIK_ELEV : RUBIK_ADESIVO)));
                    }),
                    n: nFinal,
                    cor
                });
            }
        }
    }

    return saida;
}

module.exports = { CUBO_V, CUBO_F, CUBO_A, UV, NORMAL_DO_DADO, numeroDadoDaFace, criarRubik, aplicarMovimento, roteiroRubik, estadoRubik, poligonosRubik };
