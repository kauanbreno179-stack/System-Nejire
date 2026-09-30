"use strict";
const M = require("./matematica.js");
const { NORMAL_DO_DADO } = require("./modelos.js");

const TAU = Math.PI * 2;

const ANIMACOES = {
    giro: {
        desc: "gira no eixo vertical (padrão)",
        extra: { s: 1, y: 0, ex: 0 },
        estado: (t, o) => ({ R: M.mmul(M.rotX(o.tilt), M.mmul(M.rotZ(0.1 * Math.sin(TAU * t)), M.rotY(TAU * t))), s: 1, y: 0, ex: 0 })
    },
    tumble: {
        desc: "cambalhota em todos os eixos",
        extra: { s: 1, y: 0, ex: 0 },
        estado: t => ({ R: M.mmul(M.rotX(TAU * t), M.mmul(M.rotY(TAU * 2 * t), M.rotZ(TAU * t))), s: 1, y: 0, ex: 0 })
    },
    pendulo: {
        desc: "balança de um lado pro outro",
        extra: { s: 1, y: 0, ex: 0 },
        estado: (t, o) => ({ R: M.mmul(M.rotX(o.tilt + 0.15 * Math.cos(TAU * t)), M.rotY(0.7 + 0.85 * Math.sin(TAU * t))), s: 1, y: 0, ex: 0 })
    },
    pulsar: {
        desc: "gira e pulsa como um coração",
        extra: { s: 1.22, y: 0, ex: 0 },
        estado: (t, o) => ({ R: M.mmul(M.rotX(o.tilt), M.rotY(TAU * t)), s: 1.02 + 0.2 * Math.sin(TAU * 2 * t), y: 0, ex: 0 })
    },
    quicar: {
        desc: "pula e gira",
        extra: { s: 1, y: 0.55, ex: 0 },
        estado: (t, o) => {
            const h = Math.abs(Math.sin(TAU * t));
            return { R: M.mmul(M.rotX(o.tilt), M.rotY(TAU * t)), s: 1, y: h * 1.0 - 0.45, ex: 0, altura: h };
        }
    },
    orbita: {
        desc: "a câmera orbita, subindo e descendo",
        extra: { s: 1, y: 0, ex: 0 },
        estado: t => ({ R: M.mmul(M.rotX(0.15 + 0.5 * (0.5 + 0.5 * Math.sin(TAU * t)) ), M.rotY(TAU * t + 0.6)), s: 1, y: 0, ex: 0 })
    },
    explosao: {
        desc: "as faces se afastam e voltam",
        extra: { s: 1, y: 0, ex: 0.95 },
        estado: (t, o) => ({ R: M.mmul(M.rotX(o.tilt), M.rotY(TAU * t)), s: 0.95, y: 0, ex: 0.95 * (0.5 - 0.5 * Math.cos(TAU * t)) })
    },
    rolar: {
        desc: "(dado) rola e para no número escolhido",
        extra: { s: 1, y: 0.7, ex: 0 },
        estado: (t, o, i, N) => {
            const p = Math.min(1, i / (N * 0.72)); 
            const k = Math.pow(1 - p, 1.7);
            const alvo = M.rotacaoEntre(NORMAL_DO_DADO[o.dado || 1], [0, 0, 1]);
            const inclina = M.mmul(M.rotX(0.5), M.rotY(-0.5));
            const gira = M.mmul(M.rotZ(k * TAU * 1.2), M.mmul(M.rotY(k * TAU * 2.4), M.rotX(k * TAU * 2.6)));
            const h = Math.abs(Math.sin(p * TAU * 1.5)) * 0.7 * Math.pow(1 - p, 1.4);
            return { R: M.mmul(inclina, M.mmul(alvo, gira)), s: 1, y: h - 0.35, ex: 0, altura: h };
        }
    }
};

module.exports = { ANIMACOES, TAU };
