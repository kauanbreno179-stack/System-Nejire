const config = require("../config.json");

let lib = {};
try {
    lib = require("@systemzero/baileys");
} catch {
    lib = {};
}

const {
    lidToJid: libLidToJid,
    resolveAll: libResolveAll,
    normalizeJid: libNormalizeJid,
    getSenderInfo: libGetSenderInfo,
    isLidUser: libIsLidUser,
    getName: libGetName
} = lib;

function numero(jid) {
    return String(jid || "").replace(/[^0-9]/g, "");
}

function ehLid(jid) {
    return String(jid || "").endsWith("@lid");
}

function mesmoContato(a, b) {
    const na = numero(a);
    const nb = numero(b);
    if (!na || !nb) return false;
    return na === nb || na.endsWith(nb) || nb.endsWith(na);
}

function resolverSender(info, isGroup, from) {
    const bruto = isGroup
        ? (info?.key?.participantPn || info?.key?.participant || from)
        : (info?.key?.participantPn || info?.key?.remoteJid);

    if (!bruto) return bruto;

    const ehLidBruto = typeof libIsLidUser === "function" ? libIsLidUser(bruto) : ehLid(bruto);

    if (!ehLidBruto) {
        if (typeof libNormalizeJid === "function") {
            try {
                return libNormalizeJid(bruto) || bruto;
            } catch {}
        }
        return bruto;
    }

    if (typeof libGetSenderInfo === "function") {
        try {
            const { jid } = libGetSenderInfo(info) || {};
            if (jid && !ehLid(jid)) return jid;
        } catch {}
    }

    if (typeof libLidToJid === "function") {
        try {
            const jid = libLidToJid(bruto);
            if (jid && !ehLid(jid)) return jid;
        } catch {}
    }

    if (typeof libResolveAll === "function") {
        try {
            const { jid } = libResolveAll(bruto) || {};
            if (jid && !ehLid(jid)) return jid;
        } catch {}
    }

    if (typeof libNormalizeJid === "function") {
        try {
            const jid = libNormalizeJid(bruto);
            if (jid) return jid;
        } catch {}
    }

    return bruto;
}

function nomeUsuario(info, jidAlvo) {
    if (typeof libGetName === "function") {
        try {
            const nome = libGetName(info);
            if (nome) return nome;
        } catch {}
    }
    return info?.pushName || numero(jidAlvo) || "usuário desconhecido";
}

function paraLidChamada(jid) {
    if (!jid) return jid;
    if (ehLid(jid)) return jid;

    if (typeof libResolveAll === "function") {
        try {
            const { lid } = libResolveAll(jid) || {};
            if (lid) return lid;
        } catch {}
    }

    return jid;
}

const fs = require("fs");
const pathDonos = require("path").join(__dirname, "..", "database", "donoextra.json");
let _donosExtras = { m: 0, lista: [] };

function donosExtras() {
    try {
        const m = fs.statSync(pathDonos).mtimeMs;
        if (m !== _donosExtras.m) {
            const json = JSON.parse(fs.readFileSync(pathDonos, "utf8"));
            _donosExtras = { m, lista: Array.isArray(json.donos) ? json.donos : [] };
        }
    } catch {
        _donosExtras = { m: 0, lista: [] };
    }
    return _donosExtras.lista;
}

function ehDonoPrincipal(jid) {
    return mesmoContato(jid, config.numeroDono);
}

function ehDono(jid) {
    if (ehDonoPrincipal(jid)) return true;
    const n = numero(jid);
    return n.length >= 10 && donosExtras().some(d => mesmoContato(n, d));
}

function acharParticipante(participantes = [], jid) {
    return participantes.find(p => {
        return mesmoContato(p.id, jid) || mesmoContato(p.jid, jid) || mesmoContato(p.lid, jid);
    });
}

function ehAdmin(participantes = [], jid) {
    const participante = acharParticipante(participantes, jid);
    return !!participante && (participante.admin === "admin" || participante.admin === "superadmin");
}

function resolverAlvo({ info, args = [], q = "", sender, participantes = [] }) {
    const contextInfo =
        info?.message?.extendedTextMessage?.contextInfo ||
        info?.message?.imageMessage?.contextInfo ||
        info?.message?.videoMessage?.contextInfo ||
        {};

    let alvo = null;

    if (Array.isArray(contextInfo.mentionedJid) && contextInfo.mentionedJid.length > 0) {
        alvo = contextInfo.mentionedJid[0];
    } else if (contextInfo.participant) {
        alvo = contextInfo.participant;
    }

    if (!alvo) {
        const texto =
            info?.message?.extendedTextMessage?.text ||
            info?.message?.conversation ||
            q ||
            "";

        const match = texto.match(/@(\d+)/);
        if (match?.[1]) alvo = `${match[1]}@s.whatsapp.net`;
    }

    if (!alvo && args[0]) {
        const num = numero(args[0]);
        if (num.length >= 8) alvo = `${num}@s.whatsapp.net`;
    }

    if (!alvo && participantes.length && q) {
        const num = numero(q);
        if (num) {
            const achado = acharParticipante(participantes, num);
            if (achado) alvo = achado.id || achado.jid || achado.lid;
        }
    }

    if (!alvo || mesmoContato(alvo, sender)) return null;

    return alvo;
}

module.exports = {
    numero,
    ehLid,
    mesmoContato,
    ehDono,
    ehDonoPrincipal,
    acharParticipante,
    ehAdmin,
    resolverAlvo,
    resolverSender,
    nomeUsuario,
    paraLidChamada
};
