///
const path = require("path");
const db = require("../utils/db.js");

const DB_PATH = path.join(__dirname, "..", "database", "usuarios.json");

db.ensure(DB_PATH, {});

function perfilPadrao() {
    return {
        apelido: null,
        pontosCuriosidade: 0,
        comandosUsados: 0,
        saldo: 0,
        xp: 0,
        ultimoDaily: 0,
        ultimoTrabalho: 0,
        ultimoRoubo: 0,
        inventario: [],
        primeiraVez: Date.now(),
        ultimaVez: Date.now()
    };
}

function getPerfil(jid) {
    const all = db.read(DB_PATH, {});

    if (!all[jid]) {
        all[jid] = perfilPadrao();
        db.write(DB_PATH, all);
    } else {

        all[jid] = { ...perfilPadrao(), ...all[jid] };
    }

    return all[jid];
}

function salvarPerfil(jid, parcial) {
    const all = db.read(DB_PATH, {});
    const atual = all[jid] || perfilPadrao();

    all[jid] = {
        ...atual,
        ...parcial,
        ultimaVez: Date.now()
    };

    db.write(DB_PATH, all);
    return all[jid];
}

function registrarComando(jid) {
    const perfil = getPerfil(jid);
    return salvarPerfil(jid, {
        comandosUsados: (perfil.comandosUsados || 0) + 1
    });
}

function darPontoCuriosidade(jid) {
    const perfil = getPerfil(jid);
    return salvarPerfil(jid, {
        pontosCuriosidade: (perfil.pontosCuriosidade || 0) + 1
    });
}

function ranking(limite = 10) {
    const all = db.read(DB_PATH, {});

    return Object.entries(all)
        .map(([jid, dados]) => ({ jid, ...dados }))
        .sort((a, b) => (b.pontosCuriosidade || 0) - (a.pontosCuriosidade || 0))
        .slice(0, limite);
}

module.exports = {
    getPerfil,
    salvarPerfil,
    registrarComando,
    darPontoCuriosidade,
    ranking
};
