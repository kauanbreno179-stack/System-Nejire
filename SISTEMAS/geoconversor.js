function grausParaRadianos(g) {
    const n = parseFloat(g);
    if (!Number.isFinite(n)) return null;
    return n * (Math.PI / 180);
}

function radianosParaGraus(r) {
    const n = parseFloat(r);
    if (!Number.isFinite(n)) return null;
    return n * (180 / Math.PI);
}

module.exports = { grausParaRadianos, radianosParaGraus };
