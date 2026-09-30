const path = require("path");
const db = require("../utils/db.js");
const { getPerfil } = require("./perfil.js");

const DB_USUARIOS = path.join(__dirname, "..", "database", "usuarios.json");

const DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function diaDaSemana() {
    return DIAS_SEMANA[new Date().getDay()];
}

function semanaDoAno() {
    const hoje = new Date();
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    const diff = hoje - inicioAno;
    return Math.ceil((diff / 86400000 + inicioAno.getDay() + 1) / 7);
}

function gerarId(tamanho = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const tam = Math.min(Math.max(parseInt(tamanho) || 8, 4), 32);
    let id = "";
    for (let i = 0; i < tam; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function estatisticasBot() {
    const usuarios = db.read(DB_USUARIOS, {});
    const total = Object.keys(usuarios).length;
    const totalComandos = Object.values(usuarios).reduce((acc, u) => acc + (u.comandosUsados || 0), 0);
    return { totalUsuarios: total, totalComandos };
}

function proximoFeriado() {
    const hoje = new Date();
    const ano = hoje.getFullYear();

    const feriadosFixos = [
        { nome: "confraternização universal", mes: 0, dia: 1 },
        { nome: "tiradentes", mes: 3, dia: 21 },
        { nome: "dia do trabalho", mes: 4, dia: 1 },
        { nome: "independência do brasil", mes: 8, dia: 7 },
        { nome: "nossa senhora aparecida", mes: 9, dia: 12 },
        { nome: "finados", mes: 10, dia: 2 },
        { nome: "proclamação da república", mes: 10, dia: 15 },
        { nome: "natal", mes: 11, dia: 25 }
    ];

    const datas = feriadosFixos.map(f => ({ ...f, data: new Date(ano, f.mes, f.dia) }));
    let futuros = datas.filter(f => f.data >= hoje).sort((a, b) => a.data - b.data);

    if (!futuros.length) {
        futuros = datas.map(f => ({ ...f, data: new Date(ano + 1, f.mes, f.dia) })).sort((a, b) => a.data - b.data);
    }

    const proximo = futuros[0];
    const diasFaltando = Math.ceil((proximo.data - hoje) / 86400000);
    return { nome: proximo.nome, data: proximo.data, diasFaltando };
}

function horaMundo(offsetHoras = 0) {
    const off = parseFloat(offsetHoras);
    if (Number.isNaN(off)) return null;

    const agora = new Date();
    const utc = agora.getTime() + agora.getTimezoneOffset() * 60000;
    const destino = new Date(utc + off * 3600000);
    return destino.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function faltaPara(dataStr = "") {
    const [dia, mes, ano] = dataStr.trim().split(/[\/\-]/).map(Number);
    if (!dia || !mes || !ano) return null;

    const alvo = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const diffMs = alvo - hoje;
    if (Number.isNaN(alvo.getTime())) return null;

    const passou = diffMs < 0;
    const diasAbs = Math.abs(Math.ceil(diffMs / 86400000));
    return { passou, dias: diasAbs };
}

function dataPorExtenso(dataStr = "") {
    let data;
    if (!dataStr.trim()) {
        data = new Date();
    } else {
        const [dia, mes, ano] = dataStr.trim().split(/[\/\-]/).map(Number);
        if (!dia || !mes || !ano) return null;
        data = new Date(ano, mes - 1, dia);
        if (Number.isNaN(data.getTime())) return null;
    }

    return `${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function idadeAnimal(idadeHumana) {
    const idade = parseFloat(idadeHumana);
    if (!idade || idade < 0) return null;

    return {
        cachorro: Math.round(idade * 7),
        gato: Math.round(idade * 6),
        tartaruga: Math.round(idade * 0.6)
    };
}

function tempoOnline(jid) {
    const perfil = getPerfil(jid);
    const ms = Date.now() - (perfil.primeiraVez || Date.now());
    const dias = Math.floor(ms / 86400000);
    const horas = Math.floor((ms % 86400000) / 3600000);
    return { dias, horas };
}

function progresso(percentual) {
    const p = Math.min(Math.max(parseFloat(percentual) || 0, 0), 100);
    const preenchidos = Math.round(p / 10);
    return `[${"█".repeat(preenchidos)}${"░".repeat(10 - preenchidos)}] ${p.toFixed(0)}%`;
}

const RELOGIOS = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];

function relogioEmoji() {
    const hora = new Date().getHours() % 12;
    return RELOGIOS[hora];
}

const TIPOS_RUA = ["rua", "avenida", "travessa", "alameda", "praça"];
const NOMES_RUA = ["das gaivotas", "do sol nascente", "das conchas", "dos ipês", "da maré cheia", "das estrelas", "do coqueiral", "das andorinhas"];

function nomeRua() {
    const tipo = TIPOS_RUA[Math.floor(Math.random() * TIPOS_RUA.length)];
    const nome = NOMES_RUA[Math.floor(Math.random() * NOMES_RUA.length)];
    return `${tipo} ${nome}`;
}

const APELIDOS_PET = ["Bolinha", "Nuvem", "Café", "Biscoito", "Toddy", "Amora", "Trovão", "Sushi", "Pipoca", "Mel"];

function apelidoPet() {
    return APELIDOS_PET[Math.floor(Math.random() * APELIDOS_PET.length)];
}

const FRASES_DO_DIA = [
    "hoje é um ótimo dia pra recomeçar algo",
    "cada dia é uma nova página em branco",
    "pequenos passos ainda são passos",
    "um dia de cada vez já é o suficiente",
    "vale mais tentar com calma do que travar com pressa",
    "hoje pode ser mais leve do que ontem",
    "cuidar de si também é produtividade"
];

function fraseDoDia() {
    const hoje = new Date();
    const seed = hoje.getFullYear() * 1000 + diaDoAno(hoje);
    return FRASES_DO_DIA[seed % FRASES_DO_DIA.length];
}

function diaDoAno(data) {
    const inicio = new Date(data.getFullYear(), 0, 0);
    const diff = data - inicio;
    return Math.floor(diff / 86400000);
}

module.exports = {
    diaDaSemana,
    semanaDoAno,
    gerarId,
    estatisticasBot,
    proximoFeriado,
    horaMundo,
    faltaPara,
    dataPorExtenso,
    idadeAnimal,
    tempoOnline,
    progresso,
    relogioEmoji,
    nomeRua,
    apelidoPet,
    fraseDoDia,
    semanasRestantesAno,
    diasRestantesAno,
    estacaoDoAno,
    horaBrasilia,
    quantosDias,
    mesAtual,
    anoBissexto,
    horaFormatada,
    diaDoMes,
    trimestre,
    semestre,
    nomeDoMes,
    diaDaSemanaDeData,
    horasParaMinutos,
    minutosParaHoras,
    segundosParaHms,
    diasUteis
};

function semanasRestantesAno() {
    const hoje = new Date();
    const fimAno = new Date(hoje.getFullYear(), 11, 31);
    return Math.ceil((fimAno - hoje) / (7 * 86400000));
}

function diasRestantesAno() {
    const hoje = new Date();
    const fimAno = new Date(hoje.getFullYear(), 11, 31);
    return Math.ceil((fimAno - hoje) / 86400000);
}

function estacaoDoAno() {
    const mes = new Date().getMonth() + 1;
    const dia = new Date().getDate();

    if ((mes === 12 && dia >= 21) || mes <= 2 || (mes === 3 && dia < 20)) return "verão";
    if ((mes === 3 && dia >= 20) || mes <= 5 || (mes === 6 && dia < 21)) return "outono";
    if ((mes === 6 && dia >= 21) || mes <= 8 || (mes === 9 && dia < 23)) return "inverno";
    return "primavera";
}

function horaBrasilia() {
    return horaMundo(-3);
}

function quantosDias(dataInicioStr = "", dataFimStr = "") {
    const parse = str => {
        const [dia, mes, ano] = str.trim().split(/[\/\-]/).map(Number);
        if (!dia || !mes || !ano) return null;
        return new Date(ano, mes - 1, dia);
    };

    const inicio = parse(dataInicioStr);
    const fim = parse(dataFimStr);
    if (!inicio || !fim || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return null;

    return Math.abs(Math.round((fim - inicio) / 86400000));
}

function diasUteis(dataInicioStr = "", dataFimStr = "") {
    const parse = str => {
        const [dia, mes, ano] = str.trim().split(/[\/\-]/).map(Number);
        if (!dia || !mes || !ano) return null;
        return new Date(ano, mes - 1, dia);
    };

    const inicio = parse(dataInicioStr);
    const fim = parse(dataFimStr);
    if (!inicio || !fim || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return null;

    let [de, ate] = inicio <= fim ? [inicio, fim] : [fim, inicio];
    let contador = 0;
    const cursor = new Date(de);
    while (cursor <= ate) {
        const diaSemana = cursor.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) contador++;
        cursor.setDate(cursor.getDate() + 1);
    }
    return contador;
}

function mesAtual() {
    return MESES[new Date().getMonth()];
}

function nomeDoMes(numero) {
    const n = parseInt(numero);
    if (!n || n < 1 || n > 12) return null;
    return MESES[n - 1];
}

function anoBissexto(ano) {
    const a = parseInt(ano);
    if (!a) return null;
    return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
}

function trimestre() {
    const mes = new Date().getMonth() + 1;
    return Math.ceil(mes / 3);
}

function semestre() {
    const mes = new Date().getMonth() + 1;
    return mes <= 6 ? 1 : 2;
}

function diaDoMes() {
    return new Date().getDate();
}

function diaDaSemanaDeData(dataStr = "") {
    const [dia, mes, ano] = dataStr.trim().split(/[\/\-]/).map(Number);
    if (!dia || !mes || !ano) return null;
    const data = new Date(ano, mes - 1, dia);
    if (Number.isNaN(data.getTime())) return null;
    return DIAS_SEMANA[data.getDay()];
}

function horaFormatada() {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function horasParaMinutos(horas) {
    const h = parseFloat(horas);
    if (Number.isNaN(h)) return null;
    return h * 60;
}

function minutosParaHoras(minutos) {
    const m = parseFloat(minutos);
    if (Number.isNaN(m)) return null;
    return { horas: Math.floor(m / 60), minutos: Math.round(m % 60) };
}

function segundosParaHms(segundos) {
    const s = parseFloat(segundos);
    if (Number.isNaN(s)) return null;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = Math.floor(s % 60);
    return `${h}h ${m}m ${seg}s`;
}
