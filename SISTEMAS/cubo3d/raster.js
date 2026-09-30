"use strict";

const EPS = -1e-7;
const _amostra = new Float64Array(4);

function amostrar(tex, u, v, saida = _amostra) {
    const w = tex.w, h = tex.h, d = tex.data;
    u = u < 0 ? 0 : u > 1 ? 1 : u;
    v = v < 0 ? 0 : v > 1 ? 1 : v;

    const fx = u * (w - 1), fy = v * (h - 1);
    const x0 = fx | 0, y0 = fy | 0;
    const x1 = x0 + 1 < w ? x0 + 1 : x0, y1 = y0 + 1 < h ? y0 + 1 : y0;
    const tx = fx - x0, ty = fy - y0;

    const i00 = (y0 * w + x0) * 4, i10 = (y0 * w + x1) * 4, i01 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4;
    const a = (1 - tx) * (1 - ty), b = tx * (1 - ty), c = (1 - tx) * ty, e = tx * ty;

    saida[0] = d[i00] * a + d[i10] * b + d[i01] * c + d[i11] * e;
    saida[1] = d[i00 + 1] * a + d[i10 + 1] * b + d[i01 + 1] * c + d[i11 + 1] * e;
    saida[2] = d[i00 + 2] * a + d[i10 + 2] * b + d[i01 + 2] * c + d[i11 + 2] * e;
    saida[3] = d[i00 + 3] * a + d[i10 + 3] * b + d[i01 + 3] * c + d[i11 + 3] * e;
    return saida;
}

class Tela {
    constructor(largura, altura) {
        this.w = largura;
        this.h = altura;
        this.px = new Uint8ClampedArray(largura * altura * 4);
        this.z = new Float32Array(largura * altura);
    }

    limpar(fundo) {
        if (fundo) this.px.set(fundo); else this.px.fill(0);
        this.z.fill(-1e30);
    }

    triangulo(a, b, c, o) {
        const W = this.w, H = this.h;
        const x0 = a.x, y0 = a.y, x1 = b.x, y1 = b.y, x2 = c.x, y2 = c.y;

        let minX = Math.floor(Math.min(x0, x1, x2)), maxX = Math.ceil(Math.max(x0, x1, x2));
        let minY = Math.floor(Math.min(y0, y1, y2)), maxY = Math.ceil(Math.max(y0, y1, y2));
        if (minX < 0) minX = 0;
        if (minY < 0) minY = 0;
        if (maxX > W - 1) maxX = W - 1;
        if (maxY > H - 1) maxY = H - 1;
        if (minX > maxX || minY > maxY) return;

        const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
        if (Math.abs(area) < 1e-9) return;
        const inv = 1 / area;

        const A0 = (y1 - y2) * inv, B0 = (x2 - x1) * inv, C0 = (x1 * y2 - x2 * y1) * inv;
        const A1 = (y2 - y0) * inv, B1 = (x0 - x2) * inv, C1 = (x2 * y0 - x0 * y2) * inv;

        const px = this.px, zb = this.z;
        const modo = o.modo | 0;
        const alfaBase = o.alfa === undefined ? 1 : o.alfa;
        const sombra = o.sombra === undefined ? 1 : o.sombra;
        const brilho = o.brilho || 0;
        const testarZ = o.testarZ !== false;
        const escreverZ = o.escreverZ !== false;
        const aditivo = !!o.aditivo;
        const tex = o.tex;
        const cr = o.r, cg = o.g, cb = o.b;

        for (let y = minY; y <= maxY; y++) {
            const py = y + 0.5;
            let l0 = A0 * (minX + 0.5) + B0 * py + C0;
            let l1 = A1 * (minX + 0.5) + B1 * py + C1;
            let idx = y * W + minX;

            for (let x = minX; x <= maxX; x++, idx++, l0 += A0, l1 += A1) {
                const l2 = 1 - l0 - l1;
                if (l0 < EPS || l1 < EPS || l2 < EPS) continue;

                const dz = l0 * a.dz + l1 * b.dz + l2 * c.dz;
                if (testarZ && dz <= zb[idx]) continue;

                let r, g, bl, alfa = alfaBase;

                if (modo === 0) {
                    r = cr; g = cg; bl = cb;
                } else {
                    const w0 = l0 * a.w, w1 = l1 * b.w, w2 = l2 * c.w;
                    const k = 1 / (w0 + w1 + w2);

                    if (modo === 1) {
                        r = (w0 * a.r + w1 * b.r + w2 * c.r) * k;
                        g = (w0 * a.g + w1 * b.g + w2 * c.g) * k;
                        bl = (w0 * a.b + w1 * b.b + w2 * c.b) * k;
                    } else {
                        const t = amostrar(tex, (w0 * a.u + w1 * b.u + w2 * c.u) * k, (w0 * a.v + w1 * b.v + w2 * c.v) * k);
                        r = t[0]; g = t[1]; bl = t[2];
                        alfa *= t[3] / 255;
                        if (alfa <= 0.003) continue;
                    }
                }

                r = r * sombra + brilho;
                g = g * sombra + brilho;
                bl = bl * sombra + brilho;

                const p = idx * 4;

                if (aditivo) {
                    px[p] += r * alfa;
                    px[p + 1] += g * alfa;
                    px[p + 2] += bl * alfa;
                    const aa = alfa * 255;
                    if (aa > px[p + 3]) px[p + 3] = aa;
                } else if (alfa >= 0.999) {
                    px[p] = r; px[p + 1] = g; px[p + 2] = bl; px[p + 3] = 255;
                } else {
                    const da = px[p + 3] / 255;
                    const oa = alfa + da * (1 - alfa);
                    if (oa > 0) {
                        const kd = da * (1 - alfa);
                        px[p] = (r * alfa + px[p] * kd) / oa;
                        px[p + 1] = (g * alfa + px[p + 1] * kd) / oa;
                        px[p + 2] = (bl * alfa + px[p + 2] * kd) / oa;
                        px[p + 3] = oa * 255;
                    }
                }

                if (escreverZ) zb[idx] = dz;
            }
        }
    }

    quad(p0, p1, p2, p3, o) {
        this.triangulo(p0, p1, p2, o);
        this.triangulo(p0, p2, p3, o);
    }

    linha(x0, y0, x1, y1, largura, cor, alfa = 1, aditivo = false) {
        let dx = x1 - x0, dy = y1 - y0;
        const l = Math.hypot(dx, dy);
        if (l < 1e-6) return;
        dx /= l; dy /= l;

        const hw = largura / 2;
        const nx = -dy * hw, ny = dx * hw;
        const ex = dx * hw, ey = dy * hw;
        const a = { x: x0 - ex + nx, y: y0 - ey + ny, dz: 0, w: 1 };
        const b = { x: x1 + ex + nx, y: y1 + ey + ny, dz: 0, w: 1 };
        const c = { x: x1 + ex - nx, y: y1 + ey - ny, dz: 0, w: 1 };
        const d = { x: x0 - ex - nx, y: y0 - ey - ny, dz: 0, w: 1 };

        this.quad(a, b, c, d, { modo: 0, r: cor[0], g: cor[1], b: cor[2], alfa, aditivo, testarZ: false, escreverZ: false });
    }

    ponto(x, y, raio, cor, alfa = 1, aditivo = false) {
        const a = { x: x - raio, y: y, dz: 0, w: 1 };
        const b = { x: x, y: y - raio, dz: 0, w: 1 };
        const c = { x: x + raio, y: y, dz: 0, w: 1 };
        const d = { x: x, y: y + raio, dz: 0, w: 1 };
        this.quad(a, b, c, d, { modo: 0, r: cor[0], g: cor[1], b: cor[2], alfa, aditivo, testarZ: false, escreverZ: false });
    }

    sombra(cx, cy, rx, ry, forca) {
        const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(this.w - 1, Math.ceil(cx + rx));
        const y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(this.h - 1, Math.ceil(cy + ry));
        const px = this.px;

        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
                const d2 = nx * nx + ny * ny;
                if (d2 >= 1) continue;
                const a = forca * (1 - d2) * (1 - d2);
                const p = (y * this.w + x) * 4;
                px[p] *= 1 - a;
                px[p + 1] *= 1 - a;
                px[p + 2] *= 1 - a;
            }
        }
    }
}

function criarFundo(w, h, topo, base, transparente = false) {
    const buf = new Uint8ClampedArray(w * h * 4);
    if (transparente) return buf;

    for (let y = 0; y < h; y++) {
        const t = y / (h - 1);
        for (let x = 0; x < w; x++) {
            const dx = x / (w - 1) - 0.5, dy = y / (h - 1) - 0.5;
            const v = 1 - 0.55 * (dx * dx + dy * dy);
            const p = (y * w + x) * 4;
            buf[p] = (topo[0] + (base[0] - topo[0]) * t) * v;
            buf[p + 1] = (topo[1] + (base[1] - topo[1]) * t) * v;
            buf[p + 2] = (topo[2] + (base[2] - topo[2]) * t) * v;
            buf[p + 3] = 255;
        }
    }
    return buf;
}

function reduzir(px, w, h, ss, canais, saida) {
    const ow = (w / ss) | 0, oh = (h / ss) | 0;
    const out = saida || new Uint8Array(ow * oh * canais);
    const n = ss * ss;

    if (ss === 1) {
        for (let i = 0, j = 0; i < w * h * 4; i += 4) {
            out[j++] = px[i]; out[j++] = px[i + 1]; out[j++] = px[i + 2];
            if (canais === 4) out[j++] = px[i + 3];
        }
        return out;
    }

    let o = 0;
    for (let y = 0; y < oh; y++) {
        for (let x = 0; x < ow; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let sy = 0; sy < ss; sy++) {
                let i = ((y * ss + sy) * w + x * ss) * 4;
                for (let sx = 0; sx < ss; sx++, i += 4) {
                    if (canais === 4) {
                        const al = px[i + 3];
                        r += px[i] * al; g += px[i + 1] * al; b += px[i + 2] * al; a += al;
                    } else {
                        r += px[i]; g += px[i + 1]; b += px[i + 2];
                    }
                }
            }

            if (canais === 4) {
                if (a > 0) {
                    out[o++] = r / a; out[o++] = g / a; out[o++] = b / a; out[o++] = a / n;
                } else {
                    out[o++] = 0; out[o++] = 0; out[o++] = 0; out[o++] = 0;
                }
            } else {
                out[o++] = r / n; out[o++] = g / n; out[o++] = b / n;
            }
        }
    }
    return out;
}

module.exports = { Tela, amostrar, criarFundo, reduzir };
