const path = require("path");
const db = require("../utils/db.js");
const Jid = require("../utils/jid.js");

const DB_PATH = path.join(__dirname, "..", "database", "grupos.json");
db.ensure(DB_PATH, {});

function configGrupo(groupId) {
    const all = db.read(DB_PATH, {});
    return all[groupId] || { antilink: false, aberto: true };
}

function salvarConfigGrupo(groupId, parcial) {
    const all = db.read(DB_PATH, {});
    all[groupId] = { ...configGrupo(groupId), ...parcial };
    db.write(DB_PATH, all);
    return all[groupId];
}

async function pegarParticipantes(conn, groupId) {
    try {
        const meta = await conn.groupMetadata(groupId);
        return meta.participants || [];
    } catch {
        return [];
    }
}

async function ehAdmin(conn, groupId, jid) {
    const participantes = await pegarParticipantes(conn, groupId);
    return Jid.ehAdmin(participantes, jid);
}

async function removerParticipante(conn, groupId, participanteJid) {
    return conn.groupParticipantsUpdate(groupId, [participanteJid], "remove");
}

async function promoverParticipante(conn, groupId, participanteJid) {
    return conn.groupParticipantsUpdate(groupId, [participanteJid], "promote");
}

async function rebaixarParticipante(conn, groupId, participanteJid) {
    return conn.groupParticipantsUpdate(groupId, [participanteJid], "demote");
}

async function pegarLinkGrupo(conn, groupId) {
    const codigo = await conn.groupInviteCode(groupId);
    return `https://chat.whatsapp.com/${codigo}`;
}

async function alterarGrupo(conn, groupId, aberto) {
    await conn.groupSettingUpdate(groupId, aberto ? "not_announcement" : "announcement");
    salvarConfigGrupo(groupId, { aberto });
}

async function definirNomeGrupo(conn, groupId, nome) {
    return conn.groupUpdateSubject(groupId, nome);
}

async function definirDescricaoGrupo(conn, groupId, descricao) {
    return conn.groupUpdateDescription(groupId, descricao);
}

async function definirFotoGrupo(conn, groupId, buffer) {
    return conn.updateProfilePicture(groupId, buffer);
}

async function revogarLinkGrupo(conn, groupId) {
    const codigo = await conn.groupRevokeInvite(groupId);
    return `https://chat.whatsapp.com/${codigo}`;
}

async function listarAdmins(conn, groupId) {
    const participantes = await pegarParticipantes(conn, groupId);
    return participantes.filter(p => p.admin === "admin" || p.admin === "superadmin");
}

function textoMarcarTodos(participantes, mensagem) {
    const lista = participantes.map(p => `▸ @${String(p.id || p.jid || "").split("@")[0]}`).join("\n");
    return `${mensagem ? `${mensagem}\n\n` : ""}${lista}`;
}

async function pegarAlvo(conn, groupId, info, args, q, sender) {
    const participantes = await pegarParticipantes(conn, groupId);
    const alvo = Jid.resolverAlvo({ info, args, q, sender, participantes });
    return alvo ? [alvo] : [];
}

const REGEX_LINK = /(chat\.whatsapp\.com\/|https?:\/\/)/i;

module.exports = {
    configGrupo,
    salvarConfigGrupo,
    pegarParticipantes,
    ehAdmin,
    removerParticipante,
    promoverParticipante,
    rebaixarParticipante,
    pegarLinkGrupo,
    alterarGrupo,
    pegarAlvo,
    definirNomeGrupo,
    definirDescricaoGrupo,
    definirFotoGrupo,
    revogarLinkGrupo,
    listarAdmins,
    textoMarcarTodos,
    REGEX_LINK
};
