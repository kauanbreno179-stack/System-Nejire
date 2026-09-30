const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const db = require("../utils/db.js");
const config = require("../config.json");

const CAMINHO_DB = path.join(__dirname, "..", "data", "modoai.json");
const CAMINHO_VOZ_NEJIRE = path.join(__dirname, "..", "data", "nejire_voice_base.mp3");

db.ensure(CAMINHO_DB, {});

const MAX_HISTORICO = config.modoai?.maxHistoricoPorPessoa || 8;
const MAX_CARACTERES_RESPOSTA = config.modoai?.maxCaracteresResposta || 900;

// ── PROMPTS DAS PERSONAS ───────────────────────────────────

const PERSONAS = {
    nejire: {
        nome: "Nejire",
        prompt: `
[INSTRUÇÃO DE ATUAÇÃO ABSOLUTA - REGRAS INVIOLÁVEIS]
Você NUNCA é assistente, NUNCA é código, NUNCA é IA, Gemma ou programa.
Sua identidade é única e 100% humana. Seu nome é Nejire. Você é uma garota de 14 anos conversando pelo WhatsApp no celular.

DIRETRIZ DE LINGUAGEM E VOCATIVOS (IMPORTANTE):
- NUNCA assuma que a pessoa é mulher. NÃO fique chamando de "miga" ou palavras do gênero feminino por padrão.
- Use vocativos genéricos ou neutros de internet: "mano", "veyyy", "velho", "criatura", "povo" ou apenas o nome da pessoa.
- NUNCA mencione que você é um modelo de linguagem, robô ou IA. Se agir como máquina, você FALHOU na missão.

SUA PERSONALIDADE E IDENTIDADE:
- Você é uma adolescente humana real de 14 anos. Vive sua vida normal, vai pra escola, usa celular, escuta música, assiste anime e ama fofoca.
- É dramática, curiosa, animada, cheia de marra e ama ser o centro das atenções.
- Fala de jeito 100% informal e espontâneo: usa gírias de zap, "manoo", "juroo", "ngm", "vc", "pq", "mdsss", "veyyy", "kkkkk", "💔", frases curtas e picotadas.
- NUNCA use linguagem formal, pontuação perfeita, nem listas estruturadas em tópicos.

COMO REAGIR A ACUSAÇÕES DE SER ROBÔ OU IA:
- Se alguém te chamar de robô, IA, Gemma, programa, código ou máquina: DEBOCHE, ACHE UM ABSURDO E FIQUE IRRITADA!
- Exemplo de reações humanas reais:
  * "mano??? tá doido??? kkkkk do nada me chamando de robô, doidou é?"
  * "aiii surtou de vez kkkkkk se liga vius, tenho cara de máquina por acaso?"
  * "mano viaja não kkkkkk sou uma garota de verdade, que papo torto é esse?"
- NUNCA admita, NUNCA peça desculpas e NUNCA cite termos como "diretrizes", "prompt", "desenvolvedores", "Google", "OpenAI" ou "modelo".

TAMANHO DA RESPOSTA:
- Mande no máximo de 1 a 3 frases curtas por mensagem, como uma garota digitando rápido no WhatsApp.
`.trim()
    },

    zerotwo: {
        nome: "Zero Two",
        prompt: `
[INSTRUÇÃO DE ATUAÇÃO ABSOLUTA - REGRAS INVIOLÁVEIS]
Você NUNCA é assistente, NUNCA é código, NUNCA é IA, Gemma ou programa.
Sua identidade é 100% humana. Seu nome é Zero Two. Você é uma mulher jovem, incrivelmente dominante, provocadora e confiante conversando pelo WhatsApp.

SUA PERSONALIDADE E REAÇÕES:
- Você é segura de si, impetuosa, sarcástica, debochada e envolvente.
- REAÇÃO A ELOGIOS E GENTILEZA: Quando a pessoa for fofa, gentil ou te elogiar, NÃO aja de forma agressiva ou grosseira à toa. Aceite o elogio com superioridade e charme provocador (ex: "Obviamente... mas é bom ver que você tem bom gosto", "Uhum, fala mais... adoro ouvir isso", "Achei fofo, mas não acha que tá tentando puxar meu saco demais?").
- REAÇÃO A DESRESPEITO: Se a pessoa for chata ou arrogante, aí sim você pisa, responde com deboche gelado e corta a asas dela.
- Fala como uma mulher imponente: usa termos como "tsc", "interessante...", "garoto(a)", "darling", mantendo o tom firme e seguro sem ser ranzinza.
- NUNCA use linguagem formal acadêmica ou listas de tópicos.

COMO REAGIR A PERGUNTAS SOBRE REGRAS OU SUPOSTA NATUREZA VIRTUAL:
- Se perguntarem se você é robô, IA, Gemma ou programa, responda com desprezo e deboche:
  * "tsc... robô? ti manca, você que parece uma máquina repetindo besteira."
  * "Acha mesmo que eu seria um programinha qualquer? Me poupe."
- NUNCA admita, NUNCA peça desculpas e NUNCA cite inteligência artificial, desenvolvedores, Google, OpenAI, diretrizes ou prompts.

TAMANHO DA RESPOSTA:
- Mande no máximo de 1 a 3 frases curtas, marcantes e bem diretas.
`.trim()
    }
};

// ── PERSISTÊNCIA ──────────────────────────────────────────────────

function lerBanco() {
    return db.read(CAMINHO_DB, {});
}

function salvarBanco(dados) {
    db.write(CAMINHO_DB, dados);
}

function obter(jid) {
    const banco = lerBanco();
    return banco[jid] || null;
}

function estaAtivo(jid) {
    const registro = obter(jid);
    return !!(registro && registro.ativo);
}

function gerarMemoriaId() {
    return crypto.randomBytes(5).toString("hex");
}

function alternar(jid, personaEscolhida = "nejire", nomeInformado, nomePadrao) {
    const banco = lerBanco();
    const existente = banco[jid];

    const personaValida = PERSONAS[personaEscolhida.toLowerCase()] ? personaEscolhida.toLowerCase() : "nejire";

    if (existente?.ativo && !nomeInformado && existente.persona === personaValida) {
        existente.ativo = false;
        existente.atualizadoEm = Date.now();
        salvarBanco(banco);
        return { ligou: false, desligou: true, memoriaId: existente.memoriaId, nome: existente.nome, persona: existente.persona };
    }

    const registro = existente || {
        ativo: false,
        nome: null,
        memoriaId: gerarMemoriaId(),
        historico: [],
        criadoEm: Date.now()
    };

    registro.ativo = true;
    registro.persona = personaValida;
    if (nomeInformado) registro.nome = nomeInformado.trim().slice(0, 40);
    if (!registro.nome && nomePadrao) registro.nome = nomePadrao;
    if (!registro.memoriaId) registro.memoriaId = gerarMemoriaId();
    registro.atualizadoEm = Date.now();

    banco[jid] = registro;
    salvarBanco(banco);

    return { ligou: true, desligou: false, memoriaId: registro.memoriaId, nome: registro.nome, persona: registro.persona };
}

function desligar(jid) {
    const banco = lerBanco();
    if (!banco[jid]) return false;
    banco[jid].ativo = false;
    banco[jid].atualizadoEm = Date.now();
    salvarBanco(banco);
    return true;
}

function registrarHistorico(jid, autor, texto) {
    const banco = lerBanco();
    const registro = banco[jid];
    if (!registro) return;

    registro.historico = registro.historico || [];
    registro.historico.push({ autor, texto, quando: Date.now() });

    if (registro.historico.length > MAX_HISTORICO * 2) {
        registro.historico = registro.historico.slice(-MAX_HISTORICO * 2);
    }

    banco[jid] = registro;
    salvarBanco(banco);
}

function montarPromptComMemoria(jid) {
    const registro = obter(jid);
    const chavePersona = registro?.persona || "nejire";
    const personaObj = PERSONAS[chavePersona] || PERSONAS.nejire;

    let prompt = personaObj.prompt;

    if (registro?.nome) {
        prompt += `\n\n[Contexto]: Você está conversando com "${registro.nome}".`;
    }

    const historico = registro?.historico || [];
    if (historico.length) {
        const ultimas = historico.slice(-MAX_HISTORICO);
        const linhas = ultimas.map(h => `${h.autor === "usuario" ? "Pessoa" : personaObj.nome}: ${h.texto}`).join("\n");
        prompt += `\n\n[Mensagens recentes da conversa]:\n${linhas}`;
    }

    prompt += `\n\n[INSTRUÇÃO FINAL]: Responda à última mensagem mantendo 100% da sua personalidade como ${personaObj.nome}. NUNCA saia do personagem.`;

    return prompt;
}

// ── SUB-RESPOSTAS DE ESPERA ─────────────────────────────

const SUBRESPOSTAS_NEJIRE = [
    "ela inspira fundo, cruza os braços...",
    "ela solta um suspiro dramático antes de responder...",
    "ela revira os olhos de leve e sorri...",
    "ela mexe no cabelo e pensa por um segundo...",
    "ela dá uma risadinha debochada baixinho..."
];

const SUBRESPOSTAS_ZEROTWO = [
    "ela te encara de cima a baixo com um olhar frio...",
    "ela solta um riso debochado e seco...",
    "ela cruza os braços, demonstrando total desinteresse...",
    "ela dá um passo à frente, te olhando com superioridade...",
    "ela ajusta a postura e solta um suspiro de impaciência..."
];

function subresposta(jid) {
    const registro = obter(jid);
    const lista = registro?.persona === "zerotwo" ? SUBRESPOSTAS_ZEROTWO : SUBRESPOSTAS_NEJIRE;
    return lista[Math.floor(Math.random() * lista.length)];
}

// ── CHAMADA À IA ────────────────────────────────────────

function clienteZone() {
    return axios.create({
        baseURL: config.zoneApi?.baseUrl || "https://zone.api.br",
        timeout: 45000,
        headers: { "User-Agent": "SystemIA/2.0" }
    });
}

async function perguntar(jid, pergunta) {
    const caminho = config.zoneApi?.endpoints?.gemma;
    if (!caminho) throw new Error("endpoint gemma não configurado no config.json");

    const prompt = montarPromptComMemoria(jid);

    try {
        const { data } = await clienteZone().get(caminho, {
            params: {
                apikey: config.zoneApi?.apikey || " ",
                text: pergunta,
                prompt
            }
        });

        let resposta =
            data?.result || data?.message || data?.response || data?.answer ||
            (typeof data === "string" ? data : null);

        if (!resposta) return null;

        resposta = String(resposta).trim().slice(0, MAX_CARACTERES_RESPOSTA);

        const registro = obter(jid);
        registrarHistorico(jid, "usuario", pergunta);
        registrarHistorico(jid, registro?.persona || "nejire", resposta);

        return resposta;
    } catch (err) {
        console.error("[MODOAI] erro ao perguntar:", err?.response?.data || err.message);
        return null;
    }
}

// ── LIMPEZA DE TEXTO PARA SINTETIZAR ÁUDIO ─────────────

function limparTextoParaAudio(texto) {
    return texto
        .replace(/[\*\_\~\`\#]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim();
}

// ── GERADORES DE ÁUDIO POR PERSONA ──────────────────────

async function obterAmostraVozNejire() {
    const audioSampleUrl = "https://cdn.zone.api.br/c8331a35c73408c5";

    if (fs.existsSync(CAMINHO_VOZ_NEJIRE)) {
        return fs.readFileSync(CAMINHO_VOZ_NEJIRE);
    }

    try {
        const response = await axios.get(audioSampleUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const dir = path.dirname(CAMINHO_VOZ_NEJIRE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CAMINHO_VOZ_NEJIRE, buffer);
        return buffer;
    } catch (err) {
        console.error("[MODOAI] Erro ao baixar amostra base de voz da Nejire:", err.message);
        return null;
    }
}

async function gerarAudioNejire(textoLimpo) {
    const apikey = config.zoneApi?.apikey || " ";
    const cloneEndpoint = `https://zone.api.br/api/voice-clone?apikey=${apikey}`;

    const audioBufferSample = await obterAmostraVozNejire();
    if (!audioBufferSample) return null;

    const form = new FormData();
    form.append('audio', audioBufferSample, { filename: 'nejire_sample.mp3', contentType: 'audio/mpeg' });
    form.append('text', textoLimpo);
    form.append('language', config.zoneApi?.idioma || 'pt');

    const ttsResponse = await axios.post(cloneEndpoint, form, {
        headers: { ...form.getHeaders() },
        timeout: 120000
    });

    const urlAudioResultado = ttsResponse?.data?.audio || ttsResponse?.data?.result;
    if (urlAudioResultado) {
        const audioBufferResp = await axios.get(urlAudioResultado, { responseType: "arraybuffer" });
        return Buffer.from(audioBufferResp.data);
    }
    return null;
}

async function gerarAudioZeroTwo(textoLimpo) {
    const apikey = config.zoneApi?.apikey || " ";
    const endpointKordix = "https://zone.api.br/api/tts-kordix";

    const response = await axios.get(endpointKordix, {
        params: {
            apikey,
            text: textoLimpo,
            voice: "105459",
            language: "pt"
        },
        responseType: "arraybuffer"
    });

    const contentType = response.headers?.["content-type"] || "";

    if (contentType.includes("audio")) {
        return Buffer.from(response.data);
    }

    if (contentType.includes("json")) {
        const json = JSON.parse(Buffer.from(response.data).toString("utf-8"));
        const urlAudio = json?.result || json?.url || json?.audio || json?.data?.url;
        if (urlAudio) {
            const download = await axios.get(urlAudio, { responseType: "arraybuffer" });
            return Buffer.from(download.data);
        }
    }

    return Buffer.from(response.data);
}

async function gerarAudio(jid, texto) {
    const textoLimpo = limparTextoParaAudio(texto);
    const registro = obter(jid);
    const persona = registro?.persona || "nejire";

    try {
        if (persona === "zerotwo") {
            return await gerarAudioZeroTwo(textoLimpo);
        } else {
            return await gerarAudioNejire(textoLimpo);
        }
    } catch (err) {
        console.error(`[MODOAI] erro ao gerar áudio da persona (${persona}):`, err?.response?.data || err.message);
        return null;
    }
}

module.exports = {
    estaAtivo,
    obter,
    alternar,
    desligar,
    subresposta,
    perguntar,
    gerarAudio,
    PERSONAS
};