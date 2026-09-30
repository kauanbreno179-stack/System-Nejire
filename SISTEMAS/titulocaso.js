function paraTituloCase(texto = "") {
    return String(texto).toLowerCase().split(" ").filter(Boolean)
        .map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
}

function paraSnakeCase(texto = "") {
    return String(texto).trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/).filter(Boolean).join("_");
}

module.exports = { paraTituloCase, paraSnakeCase };
