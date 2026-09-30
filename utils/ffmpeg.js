// Roda o binário do ffmpeg direto (child_process). Os módulos novos
// usam isso em vez do fluent-ffmpeg pra ter controle total dos
// argumentos, timeout e mensagem de erro real.
// Dá pra apontar outro binário com a variável FFMPEG_PATH.

const { spawn } = require("child_process");
const fs = require("fs");
const Tmp = require("./tmp.js");

function binario() {
    return process.env.FFMPEG_PATH || "ffmpeg";
}

function executar(args, { timeoutMs = 120000 } = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(binario(), ["-hide_banner", "-loglevel", "error", "-y", ...args], {
            stdio: ["ignore", "ignore", "pipe"]
        });

        let stderr = "";
        proc.stderr.on("data", d => {
            if (stderr.length < 4000) stderr += d.toString();
        });

        const timer = setTimeout(() => {
            proc.kill("SIGKILL");
            reject(new Error(`ffmpeg passou de ${Math.round(timeoutMs / 1000)}s e foi cancelado`));
        }, timeoutMs);

        proc.on("error", err => {
            clearTimeout(timer);
            reject(new Error(err.code === "ENOENT"
                ? "ffmpeg não encontrado — instale o ffmpeg (pkg install ffmpeg no termux)"
                : err.message));
        });

        proc.on("close", code => {
            clearTimeout(timer);
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg falhou (código ${code}): ${stderr.trim().split("\n").slice(-3).join(" | ")}`));
        });
    });
}

async function converter(bufferEntrada, extEntrada, extSaida, montarArgs, opts = {}) {
    const entrada = Tmp.arquivo(extEntrada);
    const saida = Tmp.arquivo(extSaida);

    fs.writeFileSync(entrada, bufferEntrada);

    try {
        await executar(montarArgs(entrada, saida), opts);
        return fs.readFileSync(saida);
    } finally {
        Tmp.remover(entrada, saida);
    }
}

module.exports = { binario, executar, converter };
