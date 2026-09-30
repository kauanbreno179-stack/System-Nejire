const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Module = require("module");

const ROOT_DIR = __dirname;

const IGNORE_DIRS = new Set([
    "node_modules",
    ".git",
    "sessions",
    "session",
    "auth",
    "tmp",
    "public"
]);

const builtins = new Set(Module.builtinModules);

function listJsFiles(dir, files = []) {

    let entries;

    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return files;
    }

    for (const entry of entries) {

        if (IGNORE_DIRS.has(entry.name)) continue;

        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            listJsFiles(full, files);
        } else if (entry.isFile() && /\.(js|cjs|mjs)$/.test(entry.name)) {
            files.push(full);
        }

    }

    return files;
}

function extractSpecifiers(content) {

    const names = new Set();

    const patterns = [
        /require\(\s*["']([^"']+)["']\s*\)/g,
        /from\s+["']([^"']+)["']/g,
        /import\(\s*["']([^"']+)["']\s*\)/g
    ];

    for (const regex of patterns) {

        let match;

        while ((match = regex.exec(content)) !== null) {
            names.add(match[1]);
        }

    }

    return names;
}

function toPackageName(specifier) {

    if (!specifier) return null;
    if (specifier.startsWith(".") || specifier.startsWith("/")) return null;
    if (specifier.startsWith("node:")) return null;

    if (specifier.startsWith("@")) {
        const parts = specifier.split("/");
        return parts.slice(0, 2).join("/");
    }

    return specifier.split("/")[0];
}

function isInstalled(pkgName) {

    try {
        require.resolve(pkgName, { paths: [ROOT_DIR] });
        return true;
    } catch {
        return false;
    }

}

function versaoDesejada(pkgName) {
    try {
        const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
        const todasDeps = { ...(pkgJson.dependencies || {}), ...(pkgJson.devDependencies || {}) };
        return todasDeps[pkgName] || null; // ex: "^4.21.0" — respeita o que já está pinado no package.json
    } catch {
        return null;
    }
}

function autoInstall() {

    console.log("🔍 Verificando módulos usados no projeto...");

    const files = listJsFiles(ROOT_DIR);
    const allSpecifiers = new Set();

    for (const file of files) {

        try {
            const content = fs.readFileSync(file, "utf8");
            for (const spec of extractSpecifiers(content)) {
                allSpecifiers.add(spec);
            }
        } catch {}

    }

    const missing = new Set();

    for (const spec of allSpecifiers) {

        const pkgName = toPackageName(spec);

        if (!pkgName) continue;
        if (builtins.has(pkgName)) continue;
        if (isInstalled(pkgName)) continue;

        missing.add(pkgName);

    }

    if (missing.size === 0) {
        console.log("✅ Todos os módulos já estão instalados.");
        return;
    }

    // Monta a lista já resolvendo pra versão do package.json quando existir,
    // pra não puxar "latest" e quebrar compatibilidade com o resto do projeto.
    const listaComVersao = [...missing].map((pkgName) => {
        const versao = versaoDesejada(pkgName);
        return versao ? `${pkgName}@${versao.replace(/^[\^~]/, "")}` : pkgName;
    });

    console.log(`📦 Módulos faltando (${missing.size}): ${[...missing].join(", ")}`);
    console.log("⬇️ Instalando tudo de uma vez...");

    try {

        execSync(
            `npm install ${listaComVersao.map((s) => `"${s}"`).join(" ")} --no-audit --no-fund --save`,
            {
                cwd: ROOT_DIR,
                stdio: "inherit"
            }
        );

        console.log(`✅ ${missing.size} módulo(s) instalado(s) com sucesso.`);

    } catch (err) {

        console.error("❌ Falha ao instalar em lote, tentando um por um...");

        const ok = [];
        const falhou = [];

        for (const especificador of listaComVersao) {

            console.log(`\n➡️  Instalando "${especificador}"...`);

            try {
                execSync(
                    `npm install "${especificador}" --no-audit --no-fund --save`,
                    { cwd: ROOT_DIR, stdio: "inherit" }
                );
                ok.push(especificador);
                console.log(`✅ "${especificador}" instalado!`);
            } catch (err2) {
                falhou.push(especificador);
                console.error(`❌ Falhou ao instalar "${especificador}": ${err2.message}`);
            }

        }

        console.log("\n===== RESUMO DA INSTALAÇÃO =====");
        console.log(`✅ Instalados (${ok.length}): ${ok.join(", ") || "nenhum"}`);
        console.log(`❌ Falharam (${falhou.length}): ${falhou.join(", ") || "nenhum"}`);
        console.log("=================================\n");

        if (falhou.length > 0) {
            console.error("⚠️  Alguns módulos não puderam ser instalados. O bot pode não iniciar corretamente.");
        }

    }

}

autoInstall();

module.exports = { autoInstall };