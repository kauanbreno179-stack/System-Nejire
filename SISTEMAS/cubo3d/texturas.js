"use strict";
const { clamp } = require("./matematica.js");

function criarTextura(tam) {
    return { w: tam, h: tam, data: new Uint8ClampedArray(tam * tam * 4) };
}

// tabuleiro de xadrez n×n entre duas cores
function xadrez(c1, c2, n = 8, tam = 256) {
    const t = criarTextura(tam);
    for (let y = 0; y < tam; y++) {
        for (let x = 0; x < tam; x++) {
            const par = (Math.floor(x * n / tam) + Math.floor(y * n / tam)) % 2 === 0;
            const c = par ? c1 : c2;
            const p = (y * tam + x) * 4;
            t.data[p] = c[0]; t.data[p + 1] = c[1]; t.data[p + 2] = c[2]; t.data[p + 3] = 255;
        }
    }
    return t;
}

const PONTOS = {
    1: [[0.5, 0.5]],
    2: [[0.27, 0.27], [0.73, 0.73]],
    3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
    4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
    5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
    6: [[0.29, 0.25], [0.29, 0.5], [0.29, 0.75], [0.71, 0.25], [0.71, 0.5], [0.71, 0.75]]
};

function faceDado(n, tam = 256) {
    const t = criarTextura(tam);
    const pts = PONTOS[n];
    const raio = n === 1 ? 0.13 : 0.085;
    const suaviza = 1.4 / tam;

    for (let y = 0; y < tam; y++) {
        for (let x = 0; x < tam; x++) {
            const u = (x + 0.5) / tam, v = (y + 0.5) / tam;

            const borda = Math.min(u, 1 - u, v, 1 - v);
            const bisel = 1 - 0.32 * (1 - clamp(borda / 0.07, 0, 1)) ** 2;
            const luz = 0.94 + 0.06 * (1 - v);
            let r = 248 * bisel * luz, g = 244 * bisel * luz, b = 234 * bisel * luz;

            let cobertura = 0;
            for (const [px, py] of pts) {
                const d = Math.hypot(u - px, v - py);
                cobertura = Math.max(cobertura, clamp((raio - d) / suaviza + 0.5, 0, 1));
            }

            const cor = n === 1 ? [200, 30, 40] : [24, 24, 30];
            r = r * (1 - cobertura) + cor[0] * cobertura;
            g = g * (1 - cobertura) + cor[1] * cobertura;
            b = b * (1 - cobertura) + cor[2] * cobertura;

            const p = (y * tam + x) * 4;
            t.data[p] = r; t.data[p + 1] = g; t.data[p + 2] = b; t.data[p + 3] = 255;
        }
    }
    return t;
}

async function deImagem(buffer, tam = 256) {
    const Ffmpeg = require("../../utils/ffmpeg.js");

    let bruto;
    try {
        bruto = await Ffmpeg.converter(buffer, "bin", "raw", (i, o) => [
            "-i", i, "-frames:v", "1",
            "-vf", `scale=${tam}:${tam}:force_original_aspect_ratio=increase,crop=${tam}:${tam},format=rgba`,
            "-f", "rawvideo", "-pix_fmt", "rgba", o
        ], { timeoutMs: 30000 });
    } catch {
        throw new Error("não consegui ler essa imagem");
    }

    if (bruto.length !== tam * tam * 4) throw new Error("não consegui ler essa imagem");
    return { w: tam, h: tam, data: new Uint8ClampedArray(bruto.buffer, bruto.byteOffset, bruto.length).slice() };
}

module.exports = { xadrez, faceDado, deImagem };
