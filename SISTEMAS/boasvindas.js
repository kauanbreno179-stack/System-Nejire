const path = require("path");
const db = require("../utils/db.js");
const config = require("../config.json");

const DB_PATH = path.join(__dirname, "..", "database", "grupos.json");
db.ensure(DB_PATH, {});

function configGrupo(groupId) {
    const all = db.read(DB_PATH, {});
    return all[groupId] || {};
}

function salvarConfigGrupo(groupId, parcial) {
    const all = db.read(DB_PATH, {});
    all[groupId] = { ...(all[groupId] || {}), ...parcial };
    db.write(DB_PATH, all);
    return all[groupId];
}

function boasVindasAtivo(groupId) {
    const cfg = configGrupo(groupId);
    if (typeof cfg.boasVindas === "boolean") return cfg.boasVindas;
    return config.boasVindas?.ativo !== false;
}

function alternarBoasVindas(groupId, ativo) {
    salvarConfigGrupo(groupId, { boasVindas: ativo });
}

function definirRegras(groupId, texto) {
    salvarConfigGrupo(groupId, { regras: texto });
}

function obterRegras(groupId) {
    return configGrupo(groupId).regras || null;
}

function alternarAutoDelBv(groupId, ativo) {
    salvarConfigGrupo(groupId, { autoDelBv: ativo });
}

function montarTexto(modelo, { userJid, groupName, membros }) {
    const numero = userJid?.split("@")[0] || "???";
    return String(modelo || "")
        .replace(/@user/g, `@${numero}`)
        .replace(/@group/g, groupName || "")
        .replace(/@membros/g, membros ?? "");
}

async function tratarEntradaSaida(conn, evento) {
    try {
        const { id: groupId, participants, action } = evento;
        if (!["add", "remove"].includes(action)) return;
        if (!boasVindasAtivo(groupId)) return;

        const meta = await conn.groupMetadata(groupId).catch(() => null);
        const groupName = meta?.subject || "grupo";
        const membros = meta?.participants?.length ?? "";

        const legendaConfig = config.boasVindas || {};
        const custom = configGrupo(groupId);

        for (const userJid of participants) {
            const modelo = action === "add"
                ? (custom.legendaEntrada || legendaConfig.legendaEntrada)
                : (custom.legendaSaida || legendaConfig.legendaSaida);

            if (!modelo) continue;

            const texto = montarTexto(modelo, { userJid, groupName, membros });

            await conn.sendMessage(groupId, {
                text: texto,
                mentions: [userJid]
            });
        }
    } catch (err) {
        console.error("[NEJIRE] erro no sistema de boas-vindas:", err);
    }
}

module.exports = {
    boasVindasAtivo,
    alternarBoasVindas,
    definirRegras,
    obterRegras,
    alternarAutoDelBv,
    salvarConfigGrupo,
    configGrupo,
    montarTexto,
    tratarEntradaSaida
};
