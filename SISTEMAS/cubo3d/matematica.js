"use strict";

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.hypot(a[0], a[1], a[2]);
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const media = pts => {
    const n = pts.length;
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n, pts.reduce((s, p) => s + p[2], 0) / n];
};

const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

function mmul(a, b) {
    const r = new Array(9);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
        }
    }
    return r;
}

const mvec = (m, v) => [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
];

function rotX(a) { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; }
function rotY(a) { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
function rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, s, c, 0, 0, 0, 1]; }
function rotEixo(eixo, a) { return eixo === "x" ? rotX(a) : eixo === "y" ? rotY(a) : rotZ(a); }

function rotacaoEntre(a, b) {
    const u = norm(a), v = norm(b);
    const c = dot(u, v);

    if (c > 0.999999) return I3.slice();
    if (c < -0.999999) {
        const perp = Math.abs(u[0]) < 0.9 ? cross(u, [1, 0, 0]) : cross(u, [0, 1, 0]);
        const p = norm(perp);
        return [
            2 * p[0] * p[0] - 1, 2 * p[0] * p[1], 2 * p[0] * p[2],
            2 * p[1] * p[0], 2 * p[1] * p[1] - 1, 2 * p[1] * p[2],
            2 * p[2] * p[0], 2 * p[2] * p[1], 2 * p[2] * p[2] - 1
        ];
    }

    const w = cross(u, v);
    const k = 1 / (1 + c);
    const vx = [0, -w[2], w[1], w[2], 0, -w[0], -w[1], w[0], 0];
    const vx2 = mmul(vx, vx);
    return I3.map((x, i) => x + vx[i] + vx2[i] * k);
}

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const suave = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const facil = t => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

module.exports = { add, sub, mul, dot, cross, len, norm, media, I3, mmul, mvec, rotX, rotY, rotZ, rotEixo, rotacaoEntre, clamp, lerp, suave, facil, hsl };
