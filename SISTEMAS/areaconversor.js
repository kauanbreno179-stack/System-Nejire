function m2ParaFt2(m2) {
    const n = parseFloat(m2);
    if (!Number.isFinite(n)) return null;
    return n * 10.7639;
}

function ft2ParaM2(ft2) {
    const n = parseFloat(ft2);
    if (!Number.isFinite(n)) return null;
    return n / 10.7639;
}

module.exports = { m2ParaFt2, ft2ParaM2 };
