//DETETIVE 
// ==========================================================

const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");

const CASOS = require("../data/detetive_casos.json").casos;
const DetetiveIA = require("./detetiveIA.js");

const PASTA_TMP = path.join(__dirname, "..", "tmp", "detetive");
const ARQ_PROGRESSO = path.join(__dirname, "..", "database", "detetive_progresso.json");
const ARQ_CODIGOS = path.join(__dirname, "..", "database", "detetive_codigos.json");

fs.mkdirSync(PASTA_TMP, { recursive: true });
if (!fs.existsSync(ARQ_PROGRESSO)) fs.writeFileSync(ARQ_PROGRESSO, "{}");
if (!fs.existsSync(ARQ_CODIGOS)) fs.writeFileSync(ARQ_CODIGOS, JSON.stringify({ codigos: [] }, null, 2));

// ---------------------------------------------------------
// persistência simples de progresso por usuário
// ---------------------------------------------------------
function lerProgresso() {
  try { return JSON.parse(fs.readFileSync(ARQ_PROGRESSO, "utf-8")); } catch { return {}; }
}
function salvarProgresso(todos) {
  fs.writeFileSync(ARQ_PROGRESSO, JSON.stringify(todos, null, 2));
}
function getEstado(sender) {
  const todos = lerProgresso();
  if (!todos[sender]) {
    todos[sender] = {
      casoAtivo: null,
      pistasReveladas: 0,
      perguntasFeitas: [],
      tentativasAcusacao: 0,
      casosResolvidos: [],
      casosLiberados: [],
      pontuacaoTotal: 0,
      aguardandoAcesso: null,
      tentativasAcesso: 0
    };
    salvarProgresso(todos);
  }
  // garante compatibilidade com progresso salvo antes desses campos existirem
  if (!todos[sender].casosLiberados) todos[sender].casosLiberados = [];
  if (todos[sender].aguardandoAcesso === undefined) todos[sender].aguardandoAcesso = null;
  if (todos[sender].tentativasAcesso === undefined) todos[sender].tentativasAcesso = 0;
  return todos[sender];
}
function setEstado(sender, novoEstado) {
  const todos = lerProgresso();
  todos[sender] = novoEstado;
  salvarProgresso(todos);
}

function buscarCaso(id) {
  return CASOS.find(c => c.id === id || String(c.numero) === String(id));
}

// ---------------------------------------------------------
// persistência dos códigos de acesso (ID do caso + senha gerados pelo dono)
// ---------------------------------------------------------
function lerCodigos() {
  try { return JSON.parse(fs.readFileSync(ARQ_CODIGOS, "utf-8")); } catch { return { codigos: [] }; }
}
function salvarCodigos(dados) {
  fs.writeFileSync(ARQ_CODIGOS, JSON.stringify(dados, null, 2));
}

const ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function gerarTrechoAleatorio(tamanho) {
  let s = "";
  for (let i = 0; i < tamanho; i++) s += ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)];
  return s;
}

function gerarCodigoAcesso(casoIdOuNumero) {
  const caso = buscarCaso(casoIdOuNumero);
  if (!caso) return { ok: false, texto: "Não achei esse caso. Manda *#casos* pra ver os disponíveis." };

  const dados = lerCodigos();
  const prefixoCaso = slug(caso.titulo).split("_")[0].slice(0, 4).toUpperCase();
  let codigo;
  do {
    codigo = `${prefixoCaso}-${gerarTrechoAleatorio(4)}`;
  } while (dados.codigos.some(c => c.codigo === codigo));

  dados.codigos.push({
    codigo,
    casoId: caso.id,
    criadoEm: Date.now(),
    usadoPor: null,
    usadoEm: null
  });
  salvarCodigos(dados);

  const texto = [
    "🔑 *Novo código de acesso gerado!*",
    "",
    `Caso: *${caso.numero} — ${caso.titulo}*`,
    `ID do caso: *${caso.numero}*`,
    `Código de acesso: *${codigo}*`,
    "",
    "Copia a mensagem abaixo e manda pra pessoa escolhida, no privado dela:",
    "```",
    `Quero te convidar pra jogar um caso no RPG de Detetive! Manda uma mensagem pro bot no privado falando sobre o caso, e quando ele pedir, informa:\nID do caso: ${caso.numero}\nCódigo de acesso: ${codigo}`,
    "```"
  ].join("\n");

  return { ok: true, texto };
}

/**
 * Lista os códigos ainda não usados (uso administrativo do dono).
 */
function listarCodigosAtivos(casoIdOuNumero) {
  const dados = lerCodigos();
  let pendentes = dados.codigos.filter(c => !c.usadoPor);
  if (casoIdOuNumero) {
    const caso = buscarCaso(casoIdOuNumero);
    if (caso) pendentes = pendentes.filter(c => c.casoId === caso.id);
  }
  if (!pendentes.length) return "Nenhum código de acesso pendente no momento. Gera um novo com *#gerarcodigo <número do caso>*.";

  const porCaso = {};
  for (const c of pendentes) {
    porCaso[c.casoId] = porCaso[c.casoId] || [];
    porCaso[c.casoId].push(c.codigo);
  }
  const linhas = ["🔑 *Códigos de acesso pendentes*", ""];
  for (const casoId of Object.keys(porCaso)) {
    const caso = buscarCaso(casoId);
    linhas.push(`*${caso ? caso.titulo : casoId}* (ID ${caso ? caso.numero : "?"})`);
    for (const cod of porCaso[casoId]) linhas.push(`  • ${cod}`);
  }
  return linhas.join("\n");
}

// ---------------------------------------------------------
// fluxo de liberação de caso (conversa no PV: ID + código)
// ---------------------------------------------------------
const PALAVRAS_GATILHO_CASO = [
  "caso", "casos", "detetive", "investigar", "investigacao", "investigação",
  "misterio", "mistério", "rpg de detetive", "quero jogar", "denuncia", "denúncia"
];

function pareceQueQuerFalarSobreCaso(texto) {
  const norm = normalizar(texto);
  if (!norm) return false;
  return PALAVRAS_GATILHO_CASO.some(p => norm.includes(normalizar(p)));
}

function casoJaLiberado(sender, casoId) {
  const estado = getEstado(sender);
  return estado.casosLiberados.includes(casoId);
}

/**
 * Inicia (ou reinicia) a conversa pedindo ID do caso + código de acesso.
 * Se `casoIdConhecido` for passado (ex: a pessoa tentou `#caso 3` direto),
 * só falta pedir o código; senão pede os dois juntos.
 */
function iniciarConversaAcesso(sender, casoIdConhecido = null) {
  const estado = getEstado(sender);
  estado.aguardandoAcesso = { casoId: casoIdConhecido };
  estado.tentativasAcesso = 0;
  setEstado(sender, estado);

  if (casoIdConhecido) {
    const caso = buscarCaso(casoIdConhecido);
    return [
      `🔒 Esse caso é liberado por convite: *${caso.titulo}*.`,
      "",
      "Me manda o código de acesso que te passaram (recebido junto com o ID do caso). É só o código, numa mensagem."
    ].join("\n");
  }

  return [
    "🕵️ Curioso(a) pra jogar? Os casos do RPG de Detetive são liberados por convite.",
    "",
    "Se alguém já te passou um ID de caso e um código de acesso, me manda os dois juntos, assim:",
    "*<número do caso> <código de acesso>*",
    "",
    "Ex: `1 AZUL-7K4Q`",
    "",
    "Se você ainda não tem um convite, pede pro dono do bot gerar um pra você! 💙"
  ].join("\n");
}

/**
 * Processa a resposta da pessoa durante o fluxo de acesso. Retorna sempre
 * um objeto { ok, texto, zipPath?, fileName? } — o índice do zip só vem
 * junto quando o acesso é validado com sucesso (caso já entregue).
 */
async function processarRespostaAcesso(sender, texto) {
  const estado = getEstado(sender);
  if (!estado.aguardandoAcesso) {
    return { ok: false, texto: null }; // não tem fluxo pendente, quem chamou decide o que fazer
  }

  const partes = String(texto).trim().split(/\s+/).filter(Boolean);
  let casoAlvoId = estado.aguardandoAcesso.casoId;
  let codigoInformado;

  if (casoAlvoId) {
    // já sabe o caso, só falta o código — pega o "trecho" inteiro como código
    codigoInformado = partes.join(" ").toUpperCase();
  } else {
    // precisa dos dois: primeiro token = id/numero do caso, resto = código
    if (partes.length < 2) {
      estado.tentativasAcesso++;
      setEstado(sender, estado);
      if (estado.tentativasAcesso >= 5) {
        estado.aguardandoAcesso = null;
        setEstado(sender, estado);
        return { ok: false, texto: "Deixa pra lá por enquanto — quando tiver o ID do caso e o código de acesso em mãos, é só me chamar de novo. 💙" };
      }
      return { ok: false, texto: "Preciso dos dois: o número/ID do caso *e* o código de acesso, na mesma mensagem. Ex: `1 AZUL-7K4Q`" };
    }
    casoAlvoId = partes[0];
    codigoInformado = partes.slice(1).join(" ").toUpperCase();
  }

  const caso = buscarCaso(casoAlvoId);
  if (!caso) {
    estado.tentativasAcesso++;
    setEstado(sender, estado);
    return { ok: false, texto: `Não achei nenhum caso com o ID "${casoAlvoId}". Confere com quem te passou o convite e tenta de novo.` };
  }

  const dadosCodigos = lerCodigos();
  const registro = dadosCodigos.codigos.find(c => c.casoId === caso.id && c.codigo === codigoInformado && !c.usadoPor);

  if (!registro) {
    estado.tentativasAcesso++;
    setEstado(sender, estado);
    if (estado.tentativasAcesso >= 5) {
      estado.aguardandoAcesso = null;
      setEstado(sender, estado);
      return { ok: false, texto: "Código incorreto demais vezes — vou parar por aqui. Confere o convite com calma e me chama de novo quando quiser tentar." };
    }
    return { ok: false, texto: `Código incorreto pro caso *${caso.titulo}*. Confere se digitou certinho (tentativa ${estado.tentativasAcesso}/5).` };
  }

  // código válido! marca como usado e libera o caso pra esse sender
  registro.usadoPor = sender;
  registro.usadoEm = Date.now();
  salvarCodigos(dadosCodigos);

  estado.aguardandoAcesso = null;
  estado.tentativasAcesso = 0;
  if (!estado.casosLiberados.includes(caso.id)) estado.casosLiberados.push(caso.id);
  setEstado(sender, estado);

  const resultado = await iniciarCaso(sender, caso.id);
  resultado.texto = `✅ *Acesso liberado!*\n\n${resultado.texto}`;
  return resultado;
}

/**
 * Ponto de entrada usado pelo comando #caso — verifica se o caso exige
 * código e, se exigir e a pessoa ainda não tiver liberado, inicia o fluxo
 * de acesso em vez de entregar o pacote direto.
 */
async function iniciarCasoComVerificacao(sender, casoId) {
  const caso = buscarCaso(casoId);
  if (!caso) return { ok: false, texto: "Não achei esse caso. Manda *#casos* pra ver os disponíveis." };

  if (caso.requerCodigo && !casoJaLiberado(sender, caso.id)) {
    return { ok: false, texto: iniciarConversaAcesso(sender, caso.id) };
  }
  return iniciarCaso(sender, caso.id);
}

// ---------------------------------------------------------
// gerador de PDF puro (sem dependência externa)
// monta um PDF válido de texto simples na mão
// ---------------------------------------------------------
function gerarPDFSimples(titulo, paragrafos) {
  const larguraPagina = 595.28; // A4
  const alturaPagina = 841.89;
  const margemEsq = 50;
  const margemTopo = 780;
  const fontSize = 11;
  const lineHeight = 16;
  const linhasPorPagina = 40;

  function quebrarLinha(texto, maxChars) {
    const palavras = String(texto).split(" ");
    const linhas = [];
    let atual = "";
    for (const p of palavras) {
      if ((atual + " " + p).trim().length > maxChars) {
        linhas.push(atual.trim());
        atual = p;
      } else {
        atual = (atual + " " + p).trim();
      }
    }
    if (atual) linhas.push(atual);
    return linhas;
  }

  function escapePdfText(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  let todasLinhas = [{ texto: titulo, negrito: true }, { texto: "", negrito: false }];
  for (const p of paragrafos) {
    if (p === "") { todasLinhas.push({ texto: "", negrito: false }); continue; }
    const quebradas = quebrarLinha(p, 92);
    for (const l of quebradas) todasLinhas.push({ texto: l, negrito: false });
    todasLinhas.push({ texto: "", negrito: false });
  }

  const paginas = [];
  for (let i = 0; i < todasLinhas.length; i += linhasPorPagina) {
    paginas.push(todasLinhas.slice(i, i + linhasPorPagina));
  }
  if (paginas.length === 0) paginas.push([]);

  const objetos = [];
  const idFonteBold = 3;
  const idFonteNormal = 4;
  objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objetos[idFonteBold] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objetos[idFonteNormal] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const idsPaginas = [];
  let proximoId = 5;

  for (const pagina of paginas) {
    const idPag = proximoId++;
    const idConteudo = proximoId++;
    idsPaginas.push(idPag);

    let stream = "BT\n";
    pagina.forEach((linha, i) => {
      const fonte = linha.negrito ? "/F1" : "/F2";
      const tam = linha.negrito ? fontSize + 3 : fontSize;
      const mover = i === 0 ? `${margemEsq} ${margemTopo} Td\n` : `0 -${lineHeight} Td\n`;
      stream += `${fonte} ${tam} Tf\n${mover}(${escapePdfText(linha.texto)}) Tj\n`;
    });
    stream += "ET";

    objetos[idPag] = `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${idFonteBold} 0 R /F2 ${idFonteNormal} 0 R >> >> /MediaBox [0 0 ${larguraPagina} ${alturaPagina}] /Contents ${idConteudo} 0 R >>`;
    objetos[idConteudo] = { stream };
  }

  objetos[2] = `<< /Type /Pages /Kids [${idsPaginas.map(id => `${id} 0 R`).join(" ")}] /Count ${idsPaginas.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  const maxId = Math.max(...Object.keys(objetos).map(Number));

  for (let id = 1; id <= maxId; id++) {
    if (objetos[id] === undefined) { offsets[id] = null; continue; }
    offsets[id] = Buffer.byteLength(pdf, "latin1");
    if (typeof objetos[id] === "string") {
      pdf += `${id} 0 obj\n${objetos[id]}\nendobj\n`;
    } else {
      const streamContent = objetos[id].stream;
      pdf += `${id} 0 obj\n<< /Length ${Buffer.byteLength(streamContent, "latin1")} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
    }
  }

  const xrefStart = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id <= maxId; id++) {
    if (offsets[id] === null) { pdf += "0000000000 00000 f \n"; continue; }
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

function gerarRelatorioPoliciaPDF(caso) {
  const v = caso.vitima;
  const paragrafos = [
    "RELATORIO DE OCORRENCIA - CONFIDENCIAL",
    "",
    `Caso No ${String(caso.numero).padStart(3, "0")}: ${removerAcentos(caso.titulo)}`,
    `Local: ${removerAcentos(caso.local)}`,
    `Data/Horario estimado: ${removerAcentos(caso.dataHora)}`,
    "",
    "VITIMA / OCORRENCIA",
    v.idade ? `Nome: ${removerAcentos(v.nome)} | Idade: ${v.idade} | Ocupacao: ${removerAcentos(v.ocupacao)}` : `Local/empresa afetada: ${removerAcentos(v.nome)} (${removerAcentos(v.ocupacao)})`,
    "",
    "RESUMO DA OCORRENCIA",
    removerAcentos(caso.introducao),
    "",
    "SUSPEITOS IDENTIFICADOS",
    ...caso.suspeitos.map(s => `- ${removerAcentos(s.nome)} (${removerAcentos(s.apelido)}), ${s.idade} anos - ${removerAcentos(s.ocupacao)}`),
    "",
    "OBSERVACOES DA PERICIA",
    "Este relatorio nao contem a conclusao do caso. Cabe ao investigador responsavel cruzar depoimentos, evidencias fisicas e o material confidencial apreendido para formalizar uma acusacao.",
    "",
    "Documento gerado automaticamente pelo Nucleo de Investigacoes - Sistema Nejire."
  ];
  return gerarPDFSimples(`CASO No ${String(caso.numero).padStart(3, "0")} - RELATORIO POLICIAL`, paragrafos);
}

function gerarDocumentoPDF(titulo, paragrafos) {
  return gerarPDFSimples(titulo.toUpperCase(), paragrafos.map(removerAcentos));
}

function removerAcentos(texto) {
  return String(texto)
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7E]/g, "?");
}

// ---------------------------------------------------------
// gerador de .docx de verdade (zip com o mínimo de XML válido —
// abre normalmente no Word, Google Docs, LibreOffice etc.)
// ---------------------------------------------------------
async function gerarDocumentoDOCX(titulo, paragrafos) {
  const pastaTmp = path.join(PASTA_TMP, `docx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  await fsp.mkdir(path.join(pastaTmp, "_rels"), { recursive: true });
  await fsp.mkdir(path.join(pastaTmp, "word"), { recursive: true });

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

  const corpo = [
    `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t xml:space="preserve">${escapeXML(titulo)}</w:t></w:r></w:p>`,
    `<w:p/>`
  ];
  for (const p of paragrafos) {
    if (p === "") { corpo.push(`<w:p/>`); continue; }
    corpo.push(`<w:p><w:r><w:t xml:space="preserve">${escapeXML(p)}</w:t></w:r></w:p>`);
  }
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${corpo.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417"/></w:sectPr></w:body></w:document>`;

  await fsp.writeFile(path.join(pastaTmp, "[Content_Types].xml"), contentTypes);
  await fsp.writeFile(path.join(pastaTmp, "_rels", ".rels"), rels);
  await fsp.writeFile(path.join(pastaTmp, "word", "document.xml"), documentXml);

  const docxPath = path.join(pastaTmp, "_saida.docx");
  execSync(`cd "${pastaTmp}" && zip -q -X -r "${docxPath}" "[Content_Types].xml" _rels word`);
  const buf = await fsp.readFile(docxPath);
  await fsp.rm(pastaTmp, { recursive: true, force: true });
  return buf;
}

// ---------------------------------------------------------
// gerador de "foto" de evidência (cartão estilizado via sharp/SVG)
// ---------------------------------------------------------
function quebrarSVG(texto, maxChars) {
  const palavras = String(texto).split(" ");
  const linhas = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > maxChars) { linhas.push(atual.trim()); atual = p; }
    else atual = (atual + " " + p).trim();
  }
  if (atual) linhas.push(atual);
  return linhas;
}

async function gerarFotoEvidencia(titulo, legenda, numero) {
  const largura = 900, altura = 700;
  const linhasLegenda = quebrarSVG(legenda, 48);
  const svg = `
  <svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b1e3d"/>
        <stop offset="100%" stop-color="#123a66"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect x="20" y="20" width="${largura - 40}" height="${altura - 40}" fill="none" stroke="#5ab6ff" stroke-width="3" stroke-dasharray="10,6"/>
    <text x="50" y="80" font-family="Courier New, monospace" font-size="22" fill="#5ab6ff">EVIDÊNCIA FOTOGRÁFICA #${String(numero).padStart(2, "0")}</text>
    <line x1="50" y1="100" x2="${largura - 50}" y2="100" stroke="#5ab6ff" stroke-width="1"/>
    <text x="50" y="150" font-family="Georgia, serif" font-size="34" fill="#ffffff" font-weight="bold">${escapeXML(titulo)}</text>
    <rect x="50" y="180" width="${largura - 100}" height="280" fill="#04101f" stroke="#2c5a8f" stroke-width="2"/>
    <text x="${largura / 2}" y="330" font-family="Courier New, monospace" font-size="16" fill="#3d6f9c" text-anchor="middle">[ imagem de evidência catalogada — arquivo do caso ]</text>
    <text x="50" y="500" font-family="Courier New, monospace" font-size="13" fill="#3d6f9c">LEGENDA DA PERÍCIA:</text>
    ${linhasLegenda.map((l, i) => `<text x="50" y="${528 + i * 26}" font-family="Arial" font-size="18" fill="#cfe6ff">${escapeXML(l)}</text>`).join("\n")}
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ---------------------------------------------------------
// gerador de "print de celular" (chat estilizado) e
// "print de computador" (janela/terminal estilizado)
// ---------------------------------------------------------
async function gerarPrintCelular(titulo, subtitulo, mensagens) {
  const largura = 420;
  const topoChat = 100;

  let cursorY = topoChat + 30;
  const blocos = [];
  for (const msg of mensagens) {
    const linhasTexto = quebrarSVG(msg.texto, 30);
    const larguraBolha = Math.min(310, 70 + Math.max(...linhasTexto.map(l => l.length)) * 8);
    const alturaBolha = 30 + linhasTexto.length * 20;
    const direita = !!msg.deMim;
    const x = direita ? largura - 24 - larguraBolha : 24;
    const corBolha = direita ? "#2f7d46" : "#242f3d";

    blocos.push(`
      <rect x="${x}" y="${cursorY}" width="${larguraBolha}" height="${alturaBolha}" rx="14" fill="${corBolha}"/>
      ${linhasTexto.map((l, li) => `<text x="${x + 14}" y="${cursorY + 22 + li * 20}" font-family="Arial" font-size="14" fill="#e9edef">${escapeXML(l)}</text>`).join("")}
      <text x="${direita ? x + larguraBolha - 12 : x + 12}" y="${cursorY + alturaBolha + 16}" font-family="Arial" font-size="10" fill="#7d8a97" text-anchor="${direita ? "end" : "start"}">${escapeXML(msg.de || "")}${msg.hora ? " • " + escapeXML(msg.hora) : ""}</text>
    `);
    cursorY += alturaBolha + 36;
  }
  const altura = cursorY + 40;

  const svg = `<svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0b141a"/>
    <rect x="0" y="0" width="${largura}" height="86" fill="#1f2c34"/>
    <circle cx="46" cy="46" r="22" fill="#374151"/>
    <text x="80" y="42" font-family="Arial" font-size="18" fill="#e9edef" font-weight="bold">${escapeXML(titulo)}</text>
    <text x="80" y="62" font-family="Arial" font-size="12" fill="#8b96a5">${escapeXML(subtitulo || "")}</text>
    ${blocos.join("\n")}
    <text x="${largura / 2}" y="${altura - 14}" font-family="Courier New, monospace" font-size="10" fill="#54656f" text-anchor="middle">print recuperado — evidência digital catalogada</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function gerarPrintComputador(titulo, subtitulo, linhas) {
  const largura = 960;
  const altura = Math.max(400, 130 + linhas.length * 30 + 40);
  const svg = `<svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1e1e1e"/>
    <rect x="0" y="0" width="${largura}" height="46" fill="#2d2d2d"/>
    <circle cx="26" cy="23" r="7" fill="#ff5f56"/>
    <circle cx="50" cy="23" r="7" fill="#ffbd2e"/>
    <circle cx="74" cy="23" r="7" fill="#27c93f"/>
    <rect x="110" y="10" width="${largura - 220}" height="26" rx="6" fill="#141414"/>
    <text x="122" y="28" font-family="Consolas, monospace" font-size="13" fill="#9ca3af">${escapeXML(subtitulo || "")}</text>
    <text x="30" y="80" font-family="Consolas, monospace" font-size="18" fill="#e5e7eb" font-weight="bold">${escapeXML(titulo)}</text>
    <line x1="30" y1="94" x2="${largura - 30}" y2="94" stroke="#3f3f3f" stroke-width="1"/>
    ${linhas.map((l, i) => `<text x="30" y="${128 + i * 30}" font-family="Consolas, monospace" font-size="14" fill="${i % 2 === 0 ? "#d1d5db" : "#9ca3af"}">${escapeXML(l)}</text>`).join("\n")}
    <text x="${largura / 2}" y="${altura - 16}" font-family="Consolas, monospace" font-size="10" fill="#4b5563" text-anchor="middle">captura de tela recuperada — evidência digital catalogada</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ---------------------------------------------------------
// gerador de "post de rede social"
// ---------------------------------------------------------
async function gerarPostRedeSocial(usuario, legenda, curtidas, comentarios) {
  const largura = 640;
  const linhasLegenda = quebrarSVG(legenda, 46);
  const comentariosQuebrados = (comentarios || []).map(c => quebrarSVG(c, 50));
  const alturaImagem = largura;
  const topoTexto = 60 + alturaImagem + 34;
  let alturaTotal = topoTexto + 28 + linhasLegenda.length * 22 + 24;
  for (const c of comentariosQuebrados) alturaTotal += c.length * 20 + 6;
  alturaTotal += 30;

  let cursorY = topoTexto + 28 + linhasLegenda.length * 22 + 24;
  const blocosComentarios = [];
  for (const c of comentariosQuebrados) {
    for (const linha of c) {
      blocosComentarios.push(`<text x="20" y="${cursorY}" font-family="Arial" font-size="13" fill="#9ca3af">${escapeXML(linha)}</text>`);
      cursorY += 20;
    }
    cursorY += 6;
  }

  const svg = `<svg width="${largura}" height="${alturaTotal}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#000000"/>
    <rect x="0" y="0" width="${largura}" height="60" fill="#111111"/>
    <circle cx="36" cy="30" r="18" fill="#374151"/>
    <text x="66" y="36" font-family="Arial" font-size="16" fill="#ffffff" font-weight="bold">${escapeXML(usuario)}</text>
    <rect x="0" y="60" width="${largura}" height="${alturaImagem}" fill="#1f2937"/>
    <text x="${largura / 2}" y="${60 + alturaImagem / 2}" font-family="Courier New, monospace" font-size="14" fill="#4b5563" text-anchor="middle">[ imagem da publicação — evidência catalogada ]</text>
    <text x="20" y="${60 + alturaImagem + 34}" font-family="Arial" font-size="14" fill="#ffffff" font-weight="bold">❤️ ${Number(curtidas).toLocaleString("pt-BR")} curtidas</text>
    ${linhasLegenda.map((l, i) => `<text x="20" y="${60 + alturaImagem + 62 + i * 22}" font-family="Arial" font-size="14" fill="#e5e7eb">${i === 0 ? `<tspan font-weight="bold">${escapeXML(usuario)} </tspan>` : ""}${escapeXML(l)}</text>`).join("\n")}
    ${blocosComentarios.join("\n")}
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function escapeXML(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------------------------------------------------------
// gerador de áudio WAV com pista por CONTAGEM DE BIPES
// (substituiu o código morse puro — dá pra decifrar só de ouvido,
// contando bipe por bipe, sem precisar de tradutor externo)
// ---------------------------------------------------------
function gerarAudioPistaWAV(sequenciaDigitos) {
  const sampleRate = 8000;
  const freqBipe = 900;
  const freqZero = 260;
  const amostrasPorMs = sampleRate / 1000;

  function tom(ms, freq) {
    const n = Math.round(ms * amostrasPorMs);
    const buf = Buffer.alloc(n * 2);
    for (let i = 0; i < n; i++) {
      const t = i / sampleRate;
      const fade = Math.min(1, i / 100, (n - i) / 100);
      const v = Math.sin(2 * Math.PI * freq * t) * 0.6 * fade;
      buf.writeInt16LE(Math.round(v * 32767), i * 2);
    }
    return buf;
  }
  function silencio(ms) {
    const n = Math.round(ms * amostrasPorMs);
    return Buffer.alloc(n * 2);
  }

  const marcador = [tom(140, 1300), silencio(90), tom(140, 1300)];
  const partes = [silencio(500), ...marcador, silencio(700)];

  const digitos = String(sequenciaDigitos).replace(/[^0-9]/g, "").split("");
  for (const d of digitos) {
    const n = parseInt(d, 10);
    if (n === 0) {
      partes.push(tom(500, freqZero));
    } else {
      for (let i = 0; i < n; i++) {
        partes.push(tom(160, freqBipe));
        partes.push(silencio(160));
      }
    }
    partes.push(silencio(750)); // pausa maior entre dígitos
  }

  partes.push(silencio(300), ...marcador, silencio(400));

  const dataBuf = Buffer.concat(partes);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataBuf.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataBuf.length, 40);

  return Buffer.concat([header, dataBuf]);
}

function gerarGuiaAudioTXT() {
  return [
    "GUIA DE LEITURA DO ÁUDIO-PISTA",
    "=".repeat(50),
    "",
    "O áudio começa e termina com dois bipes agudos rápidos — é só o",
    "marcador de início/fim, não faz parte do código.",
    "",
    "No meio, cada grupo de bipes curtos representa UM dígito: conte",
    "quantos bipes tem no grupo (ex: 3 bipes seguidos = dígito 3).",
    "Um tom único, grave e mais longo representa o dígito 0.",
    "Uma pausa maior separa um grupo (um dígito) do próximo.",
    "",
    "Ouça em um lugar tranquilo e, se precisar, ouça mais de uma vez —",
    "não tem problema nenhum contar de novo com calma.",
    "",
    "Exemplo: bipe-bipe [pausa] bipe-bipe-bipe-bipe [pausa] tom-longo",
    "         = dígitos 2, 4, 0"
  ].join("\n");
}

// ---------------------------------------------------------
// depoimentos em .txt
// ---------------------------------------------------------
function gerarDepoimentoTXT(caso, suspeito) {
  return [
    `DEPOIMENTO — CASO No ${String(caso.numero).padStart(3, "0")}`,
    `Caso: ${caso.titulo}`,
    "=".repeat(50),
    "",
    `Nome: ${suspeito.nome} (${suspeito.apelido})`,
    `Idade: ${suspeito.idade} | Ocupação: ${suspeito.ocupacao}`,
    "",
    `Descrição registrada: ${suspeito.descricao}`,
    "",
    `Álibi declarado: "${suspeito.alibi}"`,
    "",
    "-".repeat(50),
    "Este depoimento foi colhido no local. Para mais detalhes,",
    "use o comando de interrogatório diretamente com o suspeito.",
    "-".repeat(50)
  ].join("\n");
}

// ---------------------------------------------------------
// monta o pacote completo do caso e devolve o caminho do .zip final
// ---------------------------------------------------------
async function gerarPacoteCaso(casoId) {
  const caso = buscarCaso(casoId);
  if (!caso) throw new Error("Caso não encontrado");

  const pastaCaso = path.join(PASTA_TMP, `caso_${caso.id}_${Date.now()}`);
  await fsp.mkdir(path.join(pastaCaso, "Depoimentos"), { recursive: true });
  await fsp.mkdir(path.join(pastaCaso, "Evidencias_Fotos"), { recursive: true });

  const arquivosConfidenciaisGerados = [];

  // README
  const readme = [
    `CASO No ${String(caso.numero).padStart(3, "0")} — ${caso.titulo}`,
    "=".repeat(60),
    "",
    caso.introducao,
    "",
    "COMO JOGAR",
    "-".repeat(60),
    "Examine todos os arquivos desta pasta com calma: relatório,",
    "depoimentos, documentos, prints, fotos e o(s) áudio(s). Um ou",
    "mais arquivos estão protegidos por senha — as dicas pra descobrir",
    "cada senha estão espalhadas nas outras evidências, e cada uma",
    "usa um tipo diferente de pista. Depois de investigar, volte pro",
    "chat com o bot e:",
    "",
    "  • pergunte aos suspeitos o que quiser saber (interrogatório)",
    "  • peça pistas extras se travar",
    "  • peça dicas de senha quando precisar",
    "  • quando tiver certeza, faça sua acusação final",
    "",
    "Boa sorte, investigador(a). 🔎💙"
  ].join("\n");
  await fsp.writeFile(path.join(pastaCaso, "LEIA-ME.txt"), readme);

  // relatório policial (pdf, sempre automático)
  const pdfBuf = gerarRelatorioPoliciaPDF(caso);
  await fsp.writeFile(path.join(pastaCaso, "Relatorio_Policial.pdf"), pdfBuf);

  // depoimentos (sempre automático, um por suspeito)
  for (const s of caso.suspeitos) {
    const nomeArq = `dep_${s.id}.txt`;
    await fsp.writeFile(path.join(pastaCaso, "Depoimentos", nomeArq), gerarDepoimentoTXT(caso, s));
  }

  // demais evidências, conforme o tipo declarado no JSON do caso
  let numFoto = 1;
  let algumAudioGerado = false;

  for (const ev of caso.evidencias) {
    const destino = path.join(pastaCaso, ev.arquivo || "");
    switch (ev.tipo) {
      case "foto": {
        const buf = await gerarFotoEvidencia(ev.titulo, ev.legenda, numFoto++);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "documento_pdf": {
        const buf = gerarDocumentoPDF(ev.titulo, ev.conteudo || []);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "documento_docx": {
        const buf = await gerarDocumentoDOCX(ev.titulo, ev.conteudo || []);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "print_celular": {
        const buf = await gerarPrintCelular(ev.titulo, ev.subtitulo, ev.mensagens || []);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "print_computador": {
        const buf = await gerarPrintComputador(ev.titulo, ev.subtitulo, ev.linhas || []);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "post_social": {
        const buf = await gerarPostRedeSocial(ev.usuario, ev.legenda, ev.curtidas || 0, ev.comentarios || []);
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, buf);
        break;
      }
      case "audio": {
        const wavBuf = gerarAudioPistaWAV(ev.codigo || "0");
        await fsp.mkdir(path.dirname(destino), { recursive: true });
        await fsp.writeFile(destino, wavBuf);
        algumAudioGerado = true;
        break;
      }
      case "confidencial": {
        const pastaConfTmp = path.join(pastaCaso, `_conf_tmp_${arquivosConfidenciaisGerados.length}`);
        await fsp.mkdir(pastaConfTmp, { recursive: true });
        const conteudoTxt = (ev.conteudo || []).join("\n");
        await fsp.writeFile(path.join(pastaConfTmp, "documento.txt"), conteudoTxt);

        await fsp.mkdir(path.dirname(destino), { recursive: true });
        let senhaAplicada = false;
        try {
          execSync(`cd "${pastaConfTmp}" && zip -q -P "${ev.senha}" "${destino}" documento.txt`);
          senhaAplicada = true;
        } catch (e) {
          console.error("[detetive] falha ao gerar zip com senha (binário 'zip' ausente?):", e.message);
        }
        await fsp.rm(pastaConfTmp, { recursive: true, force: true });

        if (!senhaAplicada) {
          // fallback: se o binário zip não existir no servidor, ainda entrega
          // o documento (sem proteção) pra não travar o fluxo do jogo
          const destinoFallback = destino.replace(/\.zip$/i, "_SEM_SENHA.txt");
          await fsp.writeFile(destinoFallback, conteudoTxt);
        }
        arquivosConfidenciaisGerados.push(ev.arquivo);
        break;
      }
      // "relatorio" e "depoimento" já são gerados automaticamente acima —
      // essas entradas só existem no JSON pra aparecer na listagem de #evidencias
      default:
        break;
    }
  }

  if (algumAudioGerado) {
    await fsp.writeFile(path.join(pastaCaso, "Guia_Audio_Pista.txt"), gerarGuiaAudioTXT());
  }

  // zipa o pacote final inteiro
  const zipFinalPath = path.join(PASTA_TMP, `Caso_${String(caso.numero).padStart(2, "0")}_${slug(caso.titulo)}.zip`);
  await fsp.rm(zipFinalPath, { force: true }).catch(() => {});
  execSync(`cd "${pastaCaso}" && zip -q -r "${zipFinalPath}" .`);
  await fsp.rm(pastaCaso, { recursive: true, force: true });

  return zipFinalPath;
}

function slug(texto) {
  return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// ---------------------------------------------------------
// lógica de jogo
// ---------------------------------------------------------
function listarCasosTexto() {
  return [
    "🔎 *CASOS DISPONÍVEIS*",
    "",
    ...CASOS.map(c => `${c.capa} *Caso ${String(c.numero).padStart(2, "0")} — ${c.titulo}*${c.requerCodigo ? " 🔒" : ""}\n_${c.resumo}_`),
    "",
    "🔒 = caso liberado por convite (precisa de ID + código de acesso).",
    "",
    "Pra começar um caso, manda: *#caso <número>* (ex: #caso 1)"
  ].join("\n\n");
}

async function iniciarCaso(sender, casoId) {
  const caso = buscarCaso(casoId);
  if (!caso) return { ok: false, texto: "Não achei esse caso. Manda *#casos* pra ver os disponíveis." };

  const estado = getEstado(sender);
  estado.casoAtivo = caso.id;
  estado.pistasReveladas = 0;
  estado.perguntasFeitas = [];
  estado.tentativasAcusacao = 0;
  setEstado(sender, estado);
  DetetiveIA.limparTodasConversasDoCaso(sender, caso.id);

  const zipPath = await gerarPacoteCaso(caso.id);

  const qtdConfidenciais = caso.evidencias.filter(e => e.tipo === "confidencial").length;

  const texto = [
    `${caso.capa} *CASO ${String(caso.numero).padStart(2, "0")}: ${caso.titulo}*`,
    "",
    caso.introducao,
    "",
    `📦 Te mandei o pacote com todas as evidências do caso (relatório, depoimentos, documentos, prints, fotos, áudio${qtdConfidenciais > 1 ? ` e ${qtdConfidenciais} arquivos confidenciais protegidos por senha` : " e um arquivo confidencial protegido por senha"}).`,
    "",
    "Comandos que você pode usar agora:",
    "• *#suspeitos* — ver a lista de suspeitos",
    "• *#interrogar <nome> <pergunta>* — interrogar alguém",
    "• *#pista* — pedir uma pista extra",
    "• *#dicasenha* — dica pra senha dos arquivos confidenciais",
    "• *#evidencias* — ver a lista de evidências do caso",
    "• *#acusar <suspeito> ; <arma/método> ; <local>* — fazer sua acusação final",
    "",
    "Boa investigação! 🕵️‍♀️💙"
  ].join("\n");

  return { ok: true, texto, zipPath, fileName: path.basename(zipPath) };
}

function listarSuspeitosTexto(sender) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis.";
  return [
    `🗂️ *Suspeitos — ${caso.titulo}*`,
    "",
    ...caso.suspeitos.map(s => `• *${s.nome}* (${s.apelido}), ${s.idade} anos — ${s.ocupacao}`),
    "",
    "Use *#interrogar <nome> <pergunta>* pra conversar com qualquer um deles."
  ].join("\n");
}

function listarEvidenciasTexto(sender) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis.";
  return [
    `🧾 *Evidências — ${caso.titulo}*`,
    "",
    ...caso.evidencias.map(e => `• ${e.arquivo}${e.titulo ? ` — ${e.titulo}` : ""}`),
    "",
    `Pistas extras já reveladas: ${estado.pistasReveladas}/${caso.pistasExtras.length}`
  ].join("\n");
}

/**
 * Interroga um suspeito. Tenta primeiro a IA (resposta dinâmica, pode
 * responder qualquer pergunta mantendo a persona); se a IA falhar por
 * qualquer motivo, cai pro sistema estático de palavras-chave do JSON,
 * pra nunca deixar o jogo travado.
 *
 * Retorna { texto, suspeito, viaIA } — quem chamar pode usar `suspeito`
 * pra gerar um áudio da resposta (voz do personagem) se quiser.
 */
async function interrogar(sender, nomeAlvo, pergunta) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return { texto: "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis." };
  if (!nomeAlvo) return { texto: `Fala assim: *#interrogar <nome do suspeito> <sua pergunta>*` };

  const alvoNorm = normalizar(nomeAlvo);
  const suspeito = caso.suspeitos.find(s =>
    normalizar(s.nome).includes(alvoNorm) || normalizar(s.id) === alvoNorm || normalizar(s.apelido).includes(alvoNorm)
  );
  if (!suspeito) return { texto: `Não achei esse suspeito no caso atual. Manda *#suspeitos* pra ver os nomes certinhos.` };

  if (!pergunta || !pergunta.trim()) {
    return { texto: `Você chamou *${suspeito.nome}* pra conversar, mas esqueceu de perguntar alguma coisa. Tenta: *#interrogar ${suspeito.nome.split(" ")[0]} onde você estava na hora do crime*` };
  }

  estado.perguntasFeitas.push({ suspeito: suspeito.id, pergunta });
  setEstado(sender, estado);

  const respostaIA = await DetetiveIA.perguntarSuspeitoIA(sender, caso, suspeito, pergunta);
  if (respostaIA) {
    return { texto: `🗣️ *${suspeito.nome}* responde:\n\n${respostaIA}`, suspeito, falaCrua: respostaIA, viaIA: true };
  }

  // fallback offline: sistema antigo por palavra-chave
  const perguntaNorm = normalizar(pergunta);
  const respostaEstatica = suspeito.perguntas.find(p => p.gatilhos.some(g => perguntaNorm.includes(normalizar(g))));
  const falaFinal = respostaEstatica ? respostaEstatica.resposta.replace(/^"|"$/g, "") : suspeito.respostaPadrao.replace(/^"|"$/g, "");
  return { texto: `🗣️ *${suspeito.nome}* responde:\n\n"${falaFinal}"`, suspeito, falaCrua: falaFinal, viaIA: false };
}

function pedirPista(sender) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis.";
  if (estado.pistasReveladas >= caso.pistasExtras.length) {
    return "Você já usou todas as pistas extras desse caso. A partir daqui é só juntar as peças! 🧩";
  }
  const pista = caso.pistasExtras[estado.pistasReveladas];
  estado.pistasReveladas++;
  setEstado(sender, estado);
  return `💡 *Pista ${estado.pistasReveladas}/${caso.pistasExtras.length}:*\n${pista}`;
}

function dicaSenha(sender) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis.";

  const confidenciais = caso.evidencias.filter(e => e.tipo === "confidencial");
  if (!confidenciais.length) return "Esse caso não tem nenhum arquivo protegido por senha.";

  const linhas = ["🔐 *Dicas de senha dos arquivos confidenciais:*", ""];
  confidenciais.forEach((c, i) => {
    linhas.push(`*${i + 1}. ${c.arquivo}*`);
    linhas.push(c.dicaSenha);
    linhas.push("");
  });
  linhas.push("(o áudio da pasta *Audio_Pistas/* tem um guia de leitura junto — é só contar os bipes com calma)");
  return linhas.join("\n");
}

function acusar(sender, textoAcusacao) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  if (!caso) return "Você não tem nenhum caso ativo. Manda *#casos* pra ver os disponíveis.";

  const partes = textoAcusacao.split(";").map(p => p.trim()).filter(Boolean);
  if (partes.length < 3) {
    return `Formato errado! Use:\n*#acusar <suspeito> ; <arma ou método> ; <local>*\n\nEx: #acusar Diego Ferraz ; estatueta de bronze ; sala de curadoria`;
  }
  const [nomeAcusado, armaTexto, localTexto] = partes;

  estado.tentativasAcusacao++;

  const alvoNorm = normalizar(nomeAcusado);
  const suspeito = caso.suspeitos.find(s =>
    normalizar(s.nome).includes(alvoNorm) || normalizar(s.id) === alvoNorm ||
    correspondeAproximado(nomeAcusado, s.nome, 0.5) || correspondeAproximado(nomeAcusado, s.apelido, 0.5)
  );
  const acertouSuspeito = suspeito && suspeito.id === caso.solucao.suspeitoId;
  const acertouArma = correspondeAproximado(armaTexto, caso.solucao.arma);
  const acertouLocal = correspondeAproximado(localTexto, caso.solucao.local);

  setEstado(sender, estado);

  if (acertouSuspeito && acertouArma && acertouLocal) {
    const pontos = Math.max(20, caso.pontosMax - (estado.pistasReveladas * 10) - ((estado.tentativasAcusacao - 1) * 15));
    estado.casosResolvidos.push(caso.id);
    estado.pontuacaoTotal += pontos;
    estado.casoAtivo = null;
    setEstado(sender, estado);
    DetetiveIA.limparTodasConversasDoCaso(sender, caso.id);
    return [
      "🎉 *CASO SOLUCIONADO!*",
      "",
      `Isso mesmo! *${suspeito.nome}* foi o(a) responsável, usando *${caso.solucao.arma}* em *${caso.solucao.local}*.`,
      "",
      `Pontuação dessa investigação: *${pontos} pontos* (pistas usadas: ${estado.pistasReveladas}, tentativas: ${estado.tentativasAcusacao})`,
      "",
      "Manda *#casos* pra ver o próximo mistério! 🔎💙"
    ].join("\n");
  }

  let dicas = [];
  if (!acertouSuspeito) dicas.push("o suspeito apontado não é quem cometeu o crime");
  if (!acertouArma) dicas.push("a arma/método não confere com as evidências");
  if (!acertouLocal) dicas.push("o local não é onde tudo aconteceu");

  if (estado.tentativasAcusacao >= 3) {
    estado.casoAtivo = null;
    setEstado(sender, estado);
    DetetiveIA.limparTodasConversasDoCaso(sender, caso.id);
    return [
      "❌ *Acusação incorreta — e você já usou suas 3 tentativas nesse caso.*",
      "",
      `O caso *${caso.titulo}* fica arquivado sem solução por enquanto. Quando quiser tentar de novo, é só usar *#caso ${caso.numero}* pra recomeçar do zero.`
    ].join("\n");
  }

  return [
    `❌ *Acusação incorreta.* (tentativa ${estado.tentativasAcusacao}/3)`,
    "",
    `Pelo menos uma parte está errada: ${dicas.join("; ")}.`,
    "",
    "Revise os depoimentos e evidências antes de tentar de novo."
  ].join("\n");
}

function abandonarCaso(sender) {
  const estado = getEstado(sender);
  if (!estado.casoAtivo) return "Você não tinha nenhum caso ativo mesmo.";
  const caso = buscarCaso(estado.casoAtivo);
  estado.casoAtivo = null;
  setEstado(sender, estado);
  if (caso) DetetiveIA.limparTodasConversasDoCaso(sender, caso.id);
  return `Caso *${caso ? caso.titulo : ""}* abandonado. Quando quiser, é só chamar *#casos* de novo.`;
}

function statusCaso(sender) {
  const estado = getEstado(sender);
  const caso = buscarCaso(estado.casoAtivo);
  return [
    "📊 *SEU PROGRESSO NO RPG DE DETETIVE*",
    "",
    caso ? `Caso ativo: *${caso.titulo}* (Caso ${caso.numero})` : "Nenhum caso ativo no momento.",
    caso ? `Pistas extras usadas: ${estado.pistasReveladas}/${caso.pistasExtras.length}` : "",
    caso ? `Tentativas de acusação: ${estado.tentativasAcusacao}/3` : "",
    "",
    `Casos liberados até agora: ${estado.casosLiberados.length}/${CASOS.length}`,
    `Casos resolvidos até agora: ${estado.casosResolvidos.length}/${CASOS.length}`,
    `Pontuação total acumulada: ${estado.pontuacaoTotal}`
  ].filter(Boolean).join("\n");
}

function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// ---------------------------------------------------------
// correspondência aproximada — pra acusação não exigir a palavra EXATA.
// aceita: substring, sobreposição de palavras (jaccard) e, pra frases
// curtas, distância de edição (corrige erro de digitação/sinônimo próximo)
// ---------------------------------------------------------
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const linha = new Array(n + 1);
  for (let j = 0; j <= n; j++) linha[j] = j;
  for (let i = 1; i <= m; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = linha[j];
      linha[j] = a[i - 1] === b[j - 1]
        ? anterior
        : 1 + Math.min(anterior, linha[j], linha[j - 1]);
      anterior = temp;
    }
  }
  return linha[n];
}

function correspondeAproximado(textoInformado, textoAlvo, limiarSobreposicao = 0.5) {
  const a = normalizar(textoInformado);
  const b = normalizar(textoAlvo);
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;

  const stopwords = new Set(["de", "da", "do", "das", "dos", "a", "o", "e", "em", "um", "uma", "no", "na"]);
  const ta = new Set(a.split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w)));
  const tb = new Set(b.split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w)));
  if (ta.size && tb.size) {
    let intersecao = 0;
    for (const w of ta) if (tb.has(w)) intersecao++;
    // coeficiente de sobreposição (intersecção / menor conjunto) — lida melhor
    // com o investigador digitando uma versão mais curta da resposta certa
    const sobreposicao = intersecao / Math.min(ta.size, tb.size);
    if (sobreposicao >= limiarSobreposicao) return true;
  }

  // frases curtas (até 2 palavras de cada lado): tolera erro de digitação
  if (ta.size <= 2 && tb.size <= 2) {
    const dist = levenshtein(a, b);
    const maiorTamanho = Math.max(a.length, b.length);
    if (maiorTamanho > 0 && 1 - dist / maiorTamanho >= 0.6) return true;
  }

  return false;
}

module.exports = {
  CASOS,
  listarCasosTexto,
  iniciarCaso,
  iniciarCasoComVerificacao,
  listarSuspeitosTexto,
  listarEvidenciasTexto,
  interrogar,
  pedirPista,
  dicaSenha,
  acusar,
  abandonarCaso,
  statusCaso,
  gerarPacoteCaso,
  gerarCodigoAcesso,
  listarCodigosAtivos,
  pareceQueQuerFalarSobreCaso,
  casoJaLiberado,
  iniciarConversaAcesso,
  processarRespostaAcesso,
  getEstado
};
