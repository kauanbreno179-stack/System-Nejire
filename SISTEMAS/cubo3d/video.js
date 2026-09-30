"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const Ffmpeg = require("../../utils/ffmpeg.js");
const Tmp = require("../../utils/tmp.js");

function argumentos({ largura, altura, fps, formato, q, canais }, saida) {
    const entrada = [
        "-hide_banner", "-loglevel", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", canais === 4 ? "rgba" : "rgb24",
        "-s", `${largura}x${altura}`, "-framerate", String(fps), "-i", "pipe:0"
    ];

    if (formato === "sticker") {
        return [...entrada, "-c:v", "libwebp", "-lossless", "0", "-q:v", String(q || 55), "-compression_level", "4", "-loop", "0", "-preset", "default", "-pix_fmt", "yuva420p", "-an", "-vsync", "0", saida];
    }
    if (formato === "png") {
        return [...entrada, "-frames:v", "1", saida];
    }
    return [...entrada, "-c:v", "libx264", "-preset", "veryfast", "-crf", String(q || 21), "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", saida];
}

const EXTENSAO = { mp4: "mp4", sticker: "webp", png: "png" };

function iniciar(cfg) {
    const saida = Tmp.arquivo(EXTENSAO[cfg.formato] || "mp4");
    const proc = spawn(Ffmpeg.binario(), argumentos(cfg, saida), { stdio: ["pipe", "ignore", "pipe"] });

    let erro = "";
    let falhou = null;
    proc.stderr.on("data", d => { if (erro.length < 3000) erro += d.toString(); });
    proc.stdin.on("error", e => { falhou = falhou || e; });

    const fim = new Promise((resolve, reject) => {
        proc.on("error", e => reject(new Error(e.code === "ENOENT" ? "ffmpeg não encontrado" : e.message)));
        proc.on("close", code => code === 0 ? resolve() : reject(new Error(`ffmpeg falhou: ${erro.trim().split("\n").slice(-2).join(" | ")}`)));
    });
    fim.catch(() => {});

    return {
        async escrever(frame) {
            if (falhou) throw falhou;
            const buf = Buffer.from(frame.buffer, frame.byteOffset, frame.byteLength);
            if (!proc.stdin.write(buf)) {
                await new Promise(res => proc.stdin.once("drain", res));
            }
        },
        async terminar() {
            proc.stdin.end();
            try {
                await fim;
                return fs.readFileSync(saida);
            } finally {
                Tmp.remover(saida);
            }
        },
        cancelar() {
            try { proc.kill("SIGKILL"); } catch {}
            Tmp.remover(saida);
        }
    };
}

module.exports = { iniciar };
