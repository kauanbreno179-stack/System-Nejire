function distanciaLevenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}

function sugerir(comandoDigitado, listaValida, limite = 3) {
    if (!comandoDigitado) return [];

    const alvo = comandoDigitado.toLowerCase();

    const pontuados = listaValida
        .map(cmd => ({ cmd, distancia: distanciaLevenshtein(alvo, cmd.toLowerCase()) }))
        .filter(p => p.distancia <= Math.max(2, Math.ceil(alvo.length * 0.5)))
        .sort((a, b) => a.distancia - b.distancia);

    return pontuados.slice(0, limite).map(p => p.cmd);
}

module.exports = { distanciaLevenshtein, sugerir };
