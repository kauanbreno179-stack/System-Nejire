const PREFIXOS_FANTASIA = ["Val", "Thor", "Eld", "Bran", "Dra", "Kael", "Ser", "Myr", "Gal", "Ash"];
const SUFIXOS_FANTASIA = ["mor", "wyn", "dor", "thas", "ric", "vane", "gard", "riel", "dris", "nor"];
const TIPOS_REINO = ["Reino", "Império", "Ducado", "Principado", "Confederação", "Domínio"];
const NOMES_REINO = ["das Sombras Douradas", "do Vale Eterno", "das Águas Profundas", "da Coroa de Ferro", "dos Ventos Uivantes", "da Chama Antiga"];

function sortearNomeFantasia() {
    const p = PREFIXOS_FANTASIA[Math.floor(Math.random() * PREFIXOS_FANTASIA.length)];
    const s = SUFIXOS_FANTASIA[Math.floor(Math.random() * SUFIXOS_FANTASIA.length)];
    return p + s;
}

function sortearNomeReino() {
    const t = TIPOS_REINO[Math.floor(Math.random() * TIPOS_REINO.length)];
    const n = NOMES_REINO[Math.floor(Math.random() * NOMES_REINO.length)];
    return `${t} ${n}`;
}

module.exports = { sortearNomeFantasia, sortearNomeReino };
