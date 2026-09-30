// Os módulos novos (figurinhas, scrapers, cubo 3d) escrevem seus
// arquivos temporários aqui dentro (./tmp) em vez de espalhar
// coisa pelo tmpdir do sistema — assim o comando limparcache sabe
// exatamente o que pode apagar sem tocar em arquivo de terceiros.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.join(__dirname, "..", "tmp");

function garantir() {
    fs.mkdirSync(DIR, { recursive: true });
    return DIR;
}

function arquivo(ext = "bin") {
    garantir();
    const sufixo = String(ext).replace(/^\./, "") || "bin";
    return path.join(DIR, `${Date.now().toString(36)}_${crypto.randomBytes(5).toString("hex")}.${sufixo}`);
}

function remover(...caminhos) {
    for (const c of caminhos.flat()) {
        if (!c) continue;
        try { fs.unlinkSync(c); } catch {}
    }
}

function limpar(idadeMs = 0) {
    garantir();
    let removidos = 0;
    let bytes = 0;

    for (const nome of fs.readdirSync(DIR)) {
        const p = path.join(DIR, nome);
        try {
            const st = fs.statSync(p);
            if (!st.isFile()) continue;
            if (Date.now() - st.mtimeMs < idadeMs) continue;
            bytes += st.size;
            fs.unlinkSync(p);
            removidos++;
        } catch {}
    }

    return { removidos, bytes };
}

function tamanho() {
    garantir();
    let arquivos = 0;
    let bytes = 0;

    for (const nome of fs.readdirSync(DIR)) {
        try {
            const st = fs.statSync(path.join(DIR, nome));
            if (!st.isFile()) continue;
            arquivos++;
            bytes += st.size;
        } catch {}
    }

    return { arquivos, bytes };
}

module.exports = { DIR, garantir, arquivo, remover, limpar, tamanho };
