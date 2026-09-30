function validarCPFFormato(cpf = "") {
    const limpo = String(cpf).replace(/[^0-9]/g, "");
    if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(limpo[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === parseInt(limpo[10]);
}

function validarEmailFormato(email = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

module.exports = { validarCPFFormato, validarEmailFormato };
