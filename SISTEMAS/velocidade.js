function kmhParaMph(kmh) {
    const n = parseFloat(kmh);
    if (!Number.isFinite(n)) return null;
    return n * 0.621371;
}

function mphParaKmh(mph) {
    const n = parseFloat(mph);
    if (!Number.isFinite(n)) return null;
    return n / 0.621371;
}

module.exports = { kmhParaMph, mphParaKmh };
